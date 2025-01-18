import { MongoDBClient } from '@currencia/mongo'
import { RabbitMQClient } from '~/utils/rabbit'

export default defineTask({
  meta: {
    name: 'format:sentiments',
    description: 'Send Sentiments to POSTGRES',
  },
  async run() {
    const mongoClient = await MongoDBClient.create({
      collectionName: 'sentiment_analysis',
    })

    try {
      console.log('[TASK:SENTIMENTS] - Syncing Mongo Sentiments to POSTGRES')

      const sentiment = await mongoClient.getLatestSentiment()
      if (!sentiment) {
        console.log('[TASK:SENTIMENTS] - No sentiment found in MongoDB')
        return { result: 'No sentiments found' }
      }

      await saveToPostgreSQL(sentiment)

      await mongoClient.deleteSentimentById(sentiment._id)

      return { result: 'Success' }
    } catch (error) {
      console.error('[TASK:SENTIMENTS] - Error in sync sentiments task:', error)
      throw error
    } finally {
      console.log('[TASK:SENTIMENTS] - Disconnecting from MongoDB')
      await mongoClient.disconnect()
    }
  },
})

async function saveToPostgreSQL(sentiment: { classification: string; message: string, value: number, date: string }) {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig.apiUrl
  await $fetch(`${baseUrl}/api/sentiments`, {
    method: 'POST',
    body: {
      ...sentiment,
      classification: sentiment.classification.toUpperCase()
    }
  })
}
