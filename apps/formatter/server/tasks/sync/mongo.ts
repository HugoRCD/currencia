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

    const cleanup = async () => {
      console.log('[TASK:SYNC] - Cleaning up connections')
      await mongoClient.disconnect()
      await rabbitClient.disconnect()
    }

    try {
      console.log('[TASK:SYNC] - Starting sync process')

      process.on('SIGINT', async () => {
        await cleanup()
        process.exit(0)
      })

      const prices = await mongoClient.getPricesBatch(10)
      if (!prices?.length) {
        console.log('[TASK:SYNC] - No prices found in MongoDB')
        await cleanup()
        return { result: 'No prices found' }
      }

      await rabbitClient.connect()

      for (const price of prices) {
        rabbitClient.publishMessage(price._id.toString())
        console.log(`[TASK:SYNC] - Published ID: ${price._id}`)
      }

      console.log(`[TASK:SYNC] - ${prices.length} IDs sent to RabbitMQ successfully`)
      await cleanup()

      return {
        result: 'Success',
        count: prices.length
      }
    } catch (error) {
      console.error('[TASK:SYNC] - Error in sync task:', error)
      await cleanup()
      throw error
    }
  },
})
