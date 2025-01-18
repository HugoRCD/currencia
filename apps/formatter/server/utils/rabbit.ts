import * as amqp from 'amqplib'
import type { Connection, Channel } from 'amqplib'

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
  private readonly config: RabbitConfig
  private reconnectTimeout: Timer = null
  private readonly maxReconnectAttempts = 5
  private reconnectAttempts = 0
  private isConnecting: boolean = false
  private shouldReconnect: boolean = true
  private reconnectTimer: Timer = null
  private consumers: Map<string, (msg: amqp.ConsumeMessage | null) => void> = new Map()

  constructor(config: RabbitConfig) {
    this.config = {
      maxRetries: 3,
      retryDelay: 5000,
      prefetchCount: 1,
      ...config
    }
  }

  private async createConnection(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.url)

      this.connection.on('error', (err) => {
        console.error('RabbitMQ Connection Error:', err)
        this.scheduleReconnect()
      })

      this.connection.on('close', () => {
        console.log('RabbitMQ Connection Closed')
        this.scheduleReconnect()
      })

      this.channel = await this.connection.createChannel()

      this.channel.on('error', (err) => {
        console.error('RabbitMQ Channel Error:', err)
        this.scheduleReconnect()
      })

      this.channel.on('close', () => {
        console.log('RabbitMQ Channel Closed')
        this.scheduleReconnect()
      })

      await this.setupQueues()

      for (const [queue, callback] of this.consumers) {
        await this.channel.consume(queue, callback)
      }

      this.reconnectAttempts = 0
      console.log('Successfully connected to RabbitMQ')
    } catch (error) {
      console.error('Connection creation failed:', error)
      throw error
    }
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect || this.isConnecting || this.reconnectTimer) {
      return
    }

    this.cleanup()

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      this.shouldReconnect = false
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000)

    console.log(`Scheduling reconnection in ${delay}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null
      await this.connect()
    }, delay)
  }

  private cleanup(): void {
    if (this.channel) {
      try {
        this.channel.close().then(r => r)
      } catch (err) {
        console.error('Error closing channel:', err)
      }
      this.channel = null
    }

    if (this.connection) {
      try {
        this.connection.close().then(r => r)
      } catch (err) {
        console.error('Error closing connection:', err)
      }
      this.connection = null
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

  disconnect(): void {
    this.shouldReconnect = false

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.cleanup()
    this.consumers.clear()
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized')

    await this.channel.assertQueue(this.config.queue, {
      durable: true
    })

    await this.channel.assertQueue(`${this.config.queue}.dlq`, {
      durable: true
    })

    await this.channel.prefetch(this.config.prefetchCount)
  }

  async consumeMessages(callback: (message: string) => Promise<void>): Promise<void> {
    if (!this.channel) {
      await this.connect()
    }

    const messageHandler = async (msg: amqp.ConsumeMessage | null) => {
      if (!msg) return

      try {
        const messageContent = msg.content.toString()
        const retryCount = (msg.properties.headers?.['x-retry-count'] || 0) as number

        try {
          await callback(messageContent)
          this.channel?.ack(msg)
        } catch (error) {
          console.error(`Error processing message (attempt ${retryCount + 1}):`, error)

          if (retryCount < this.config.maxRetries) {
            this.republishWithDelay(messageContent, retryCount + 1)
            this.channel?.ack(msg)
          } else {
            this.sendToDLQ(messageContent, retryCount, error as Error)
            this.channel?.ack(msg)
          }
        }
      } catch (error) {
        console.error('Critical error processing message:', error)
        if (this.channel?.connection?.connection) {
          this.channel.nack(msg, false, true)
        }
      }
    }

    this.consumers.set(this.config.queue, messageHandler)
    await this.channel!.consume(this.config.queue, messageHandler)
  }

  private republishWithDelay(
    content: string,
    retryCount: number
  ): void {
    if (!this.channel) throw new Error('Channel not initialized')

    const delay = this.config.retryDelay * Math.pow(2, retryCount - 1)

    this.channel.publish('', this.config.queue, Buffer.from(content), {
      headers: {
        'x-retry-count': retryCount,
        'x-original-timestamp': new Date().toISOString()
      },
      expiration: delay.toString(),
      persistent: true
    })
  }

  private sendToDLQ(
    content: string,
    retryCount: number,
    error: Error
  ): void {
    if (!this.channel) throw new Error('Channel not initialized')

    this.channel.sendToQueue(
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

  async processDLQ(callback: (message: string) => Promise<void>): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized')

    await this.channel.consume(`${this.config.queue}.dlq`, async (msg) => {
      if (!msg) return

      try {
        const messageContent = msg.content.toString()
        await callback(messageContent)
        this.channel?.ack(msg)
      } catch (error) {
        console.error('Error processing DLQ message:', error)
        this.channel?.nack(msg, false, true)
      }
    })
  }

  publishMessage(id: string, options: amqp.Options.Publish = {}): void {
    if (!this.channel) throw new Error('Channel not initialized')

    this.channel.sendToQueue(
      this.config.queue,
      Buffer.from(id.toString()),
      {
        persistent: true,
        ...options
      }
    )
  }

}
