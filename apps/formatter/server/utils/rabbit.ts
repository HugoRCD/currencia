import * as amqp from 'amqplib'
import type { Connection, Channel } from 'amqplib'

export type RabbitConfig = {
  url: string
  queue: string
}

export type RabbitMessage = {
  _id: string
}

export class RabbitMQClient {

  private connection: Connection | null = null
  private channel: Channel | null = null
  private readonly config: RabbitConfig

  constructor(config: RabbitConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.url)
      this.channel = await this.connection.createChannel()
      await this.assertQueue()
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error)
      throw error
    }
  }

  private async assertQueue(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized')

    await this.channel.assertQueue(this.config.queue, {
      durable: true
    })
  }

  async publishMessages(messages: RabbitMessage | RabbitMessage[]): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized')

    const messagesToPublish = Array.isArray(messages) ? messages : [messages]

    for (const message of messagesToPublish) {
      if (message._id) {
        await this.channel.sendToQueue(
          this.config.queue,
          Buffer.from(message._id.toString())
        )
      }
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close()
      }
      if (this.connection) {
        await this.connection.close()
      }
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error)
      throw error
    }
  }

}
