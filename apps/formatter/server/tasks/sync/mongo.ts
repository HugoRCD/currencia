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
      retryDelay: 5000,
      prefetchCount: 5
    })
    const mongoClient = await MongoDBClient.create()

    try {
      console.log('[TASK:SYNC] - Syncing MongoID to RabbitMQ')

      const batchSize = 10
      const prices = await mongoClient.getPricesBatch(batchSize)

      if (!prices || prices.length === 0) {
        console.log('[TASK:SYNC] - No prices found in MongoDB')
        return { result: 'No prices found' }
      }

      await rabbitClient.connect()

      await Promise.all(
        prices.map((price) => {
          rabbitClient.publishMessage(price._id.toString())
          console.log(`[TASK:SYNC] - Published ID: ${price._id}`)
        })
      )

      console.log(`[TASK:SYNC] - ${prices.length} IDs sent to RabbitMQ successfully`)

      return {
        result: 'Success',
        count: prices.length
      }
    } catch (error) {
      console.error('[TASK:SYNC] - Error in sync task:', error)
      throw error
    } finally {
      console.log('[TASK:SYNC] - Disconnecting from MongoDB and RabbitMQ')
      await mongoClient.disconnect()
      await rabbitClient.disconnect()
    }
  },
})
