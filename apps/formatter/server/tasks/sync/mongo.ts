import { MongoDBClient } from '@currencia/mongo'
import { RabbitMQClient } from '~/utils/rabbit'

export default defineTask({
  meta: {
    name: 'sync:mongo',
    description: 'Send MongoID to RabbitMQ',
  },
  async run() {
    const runtimeConfig = useRuntimeConfig()
    const rabbitClient = new RabbitMQClient({
      url: runtimeConfig.rabbit.url,
      queue: runtimeConfig.rabbit.queue,
      maxRetries: 3,
      retryDelay: 5000
    })
    const mongoClient = await MongoDBClient.create()

    try {
      console.log('Syncing MongoID to RabbitMQ')

      const prices = await mongoClient.getLatestPrices()

      await rabbitClient.connect()

      rabbitClient.publishMessage(prices._id.toString())

      console.log('IDs sent to RabbitMQ successfully')

      return { result: 'Success' }
    } catch (error) {
      console.error('Error in sync task:', error)
      throw error
    } finally {
      await rabbitClient.disconnect()
    }
  },
})
