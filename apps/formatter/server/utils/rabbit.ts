import * as amqp from 'amqplib'
import type { Connection, Channel, ConsumeMessage, Options } from 'amqplib'

export type RabbitConfig = {
  url: string
  queue: string
  maxRetries: number
  retryDelay: number
  prefetchCount: number
}

export class RabbitMQClient {

  private connection: Connection | null = null
  private channel: Channel | null = null
  private consumerTag: string | null = null
  private heartbeatInterval: Timer = null
  private reconnectTimer: Timer = null
  private isConnecting = false
  private shouldReconnect = true
  private reconnectAttempts = 0

  private readonly config: RabbitConfig
  private readonly maxReconnectAttempts = 5
  private readonly heartbeatInterval_ms = 30000

  constructor(config: RabbitConfig) {
    this.config = {
      maxRetries: 3,
      retryDelay: 5000,
      prefetchCount: 1,
      ...config
    }
  }

  async connect(): Promise<void> {
    if (this.isConnecting) return

    this.isConnecting = true
    this.shouldReconnect = true

    try {
      await this.createConnection()
    } catch (error) {
      this.scheduleReconnect()
    } finally {
      this.isConnecting = false
    }
  }

  async disconnect(): Promise<void> {
    this.shouldReconnect = false
    this.clearTimers()

    if (this.consumerTag && this.channel) {
      await this.channel.cancel(this.consumerTag)
    }

    await this.cleanup()
  }

  async consumeMessages(callback: (message: string) => Promise<void>): Promise<void> {
    if (!this.channel) {
      await this.connect()
    }

    const messageHandler = async (msg: ConsumeMessage | null) => {
      if (!msg) return

      try {
        const messageContent = msg.content.toString()
        const retryCount = (msg.properties.headers?.['x-retry-count'] || 0) as number

        try {
          await callback(messageContent)
          this.channel?.ack(msg)
        } catch (error) {
          this.handleMessageError(msg, messageContent, retryCount, error as Error)
        }
      } catch (error) {
        if (this.channel?.connection?.connection) {
          this.channel.nack(msg, false, true)
        }
      }
    }

    const { consumerTag } = await this.channel!.consume(
      this.config.queue,
      messageHandler,
      { noAck: false }
    )

    this.consumerTag = consumerTag

    return new Promise<void>((_, reject) => {
      this.channel!.on('close', () => reject(new Error('Channel closed')))
      this.channel!.on('error', reject)
    })
  }

  async processDLQ(callback: (message: string) => Promise<void>): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized')

    await this.channel.consume(`${this.config.queue}.dlq`, async (msg) => {
      if (!msg) return

      try {
        await callback(msg.content.toString())
        this.channel?.ack(msg)
      } catch (error) {
        this.channel?.nack(msg, false, true)
      }
    })
  }

  publishMessage(content: string, options: Options.Publish = {}): void {
    if (!this.channel) throw new Error('Channel not initialized')

    this.channel.sendToQueue(
      this.config.queue,
      Buffer.from(content),
      {
        persistent: true,
        ...options
      }
    )
  }

  private async createConnection(): Promise<void> {
    this.connection = await amqp.connect(this.config.url, { heartbeat: 60 })
    this.channel = await this.connection.createChannel()

    this.setupEventListeners()
    await this.setupQueues()
    this.startHeartbeat()
  }

  private setupEventListeners(): void {
    this.connection!.on('error', this.handleConnectionError.bind(this))
    this.connection!.on('close', this.handleConnectionError.bind(this))
    this.channel!.on('error', this.handleConnectionError.bind(this))
    this.channel!.on('close', this.handleConnectionError.bind(this))
  }

  private async setupQueues(): Promise<void> {
    await this.channel!.assertQueue(this.config.queue, { durable: true })
    await this.channel!.assertQueue(`${this.config.queue}.dlq`, { durable: true })
    await this.channel!.prefetch(this.config.prefetchCount)
  }

  private startHeartbeat(): void {
    this.clearHeartbeat()
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.channel?.checkQueue(this.config.queue)
      } catch {
        this.handleConnectionError()
      }
    }, this.heartbeatInterval_ms)
  }

  private handleMessageError(
    msg: ConsumeMessage,
    content: string,
    retryCount: number,
    error: Error
  ): void {
    if (retryCount < this.config.maxRetries) {
      this.republishWithDelay(content, retryCount + 1)
    } else {
      this.sendToDLQ(content, retryCount, error)
    }
    this.channel?.ack(msg)
  }

  private republishWithDelay(content: string, retryCount: number): void {
    const delay = this.config.retryDelay * Math.pow(2, retryCount - 1)

    this.channel!.publish('', this.config.queue, Buffer.from(content), {
      headers: {
        'x-retry-count': retryCount,
        'x-original-timestamp': new Date().toISOString()
      },
      expiration: delay.toString(),
      persistent: true
    })
  }

  private sendToDLQ(content: string, retryCount: number, error: Error): void {
    this.channel!.sendToQueue(
      `${ this.config.queue }.dlq`,
      Buffer.from(content),
      {
        headers: {
          'x-retry-count': retryCount,
          'x-error-message': error.message,
          'x-failed-at': new Date().toISOString()
        },
        persistent: true
      }
    )
  }

  private handleConnectionError(): void {
    this.clearHeartbeat()
    this.scheduleReconnect()
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect || this.isConnecting || this.reconnectTimer) return

    this.cleanup().then(r => r)

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.shouldReconnect = false
      return
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts++), 30000)
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null
      await this.connect()
    }, delay)
  }

  private async cleanup(): Promise<void> {
    if (this.channel) {
      try {
        await this.channel.close()
      } finally {
        this.channel = null
      }
    }

    if (this.connection) {
      try {
        await this.connection.close()
      } finally {
        this.connection = null
      }
    }
  }

  private clearTimers(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

}
