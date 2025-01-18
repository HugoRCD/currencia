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

    try {
      if (this.connection) {
        await this.connection.close()
      }

      this.connection = await amqp.connect(this.config.url)
      this.channel = await this.connection.createChannel()

      this.reconnectAttempts = 0

      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err)
        this.handleDisconnect()
      })

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed')
        this.handleDisconnect()
      })

      this.channel.on('error', (err) => {
        console.error('RabbitMQ channel error:', err)
      })

      this.channel.on('close', () => {
        console.log('RabbitMQ channel closed')
      })

      await this.setupQueues()

      console.log('Successfully connected to RabbitMQ')
      this.isConnecting = false
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error)
      this.isConnecting = false
      this.handleDisconnect()
      throw error
    }
  }

  private handleDisconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000)

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect()
      } catch (error) {
        console.error('Reconnection failed:', error)
      }
    }, delay)
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

    await this.channel!.consume(this.config.queue, async (msg) => {
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
        if (this.channel && this.channel.connection.connection) {
          this.channel.nack(msg, false, false)
        }
      }
    })
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

  async disconnect(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    try {
      if (this.channel) {
        await this.channel.close()
        this.channel = null
      }
      if (this.connection) {
        await this.connection.close()
        this.connection = null
      }
      console.log('Disconnected from RabbitMQ')
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error)
      throw error
    }
  }

}
