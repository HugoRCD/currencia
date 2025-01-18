import { MongoDBClient } from '@currencia/mongo'
import { cryptos } from '@currencia/cryptos'
import { ObjectId } from 'mongodb'
import { RabbitMQClient } from '~/utils/rabbit'

type Crypto = {
  symbol: string
  timestamp: number
  value: number
}

export default defineTask({
  meta: {
    name: 'format:data',
    description: 'Consume and format data from MongoDB via RabbitMQ',
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
      console.log('[TASK:DATA] - Cleaning up connections')
      await rabbitClient.disconnect()
      await mongoClient.disconnect()
    }

    try {
      console.log('[TASK:DATA] - Starting message consumer')
      await rabbitClient.connect()

      process.on('SIGINT', async () => {
        await cleanup()
        process.exit(0)
      })

      await rabbitClient.consumeMessages(async (messageContent) => {
        console.log('[TASK:DATA] - Processing message:', messageContent)

        const crypto = await processMessage(messageContent, mongoClient)
        if (!crypto) return

        const cryptoArray = formatCryptos(crypto)
        if (cryptoArray.length === 0) {
          throw new Error('No cryptocurrencies were successfully formatted')
        }

        await saveToPostgreSQL(cryptoArray, runtimeConfig.apiUrl)
        await mongoClient.deletePricesById(new ObjectId(messageContent))

        console.log(`[TASK:DATA] - Successfully processed ${cryptoArray.length} cryptocurrencies`)
      })

      await rabbitClient.processDLQ(async (messageContent) => {
        console.log('[TASK:DATA] - Processing failed message from DLQ:', messageContent)
      })

      return new Promise((resolve) => {
        process.on('SIGINT', async () => {
          await cleanup()
          resolve({ result: 'Shutdown' })
        })
      })
    } catch (error) {
      console.error('[TASK:DATA] - Error in consumer:', error)
      await cleanup()
      throw error
    }
  },
})

async function processMessage(messageContent: string, mongoClient: MongoDBClient) {
  const objectId = new ObjectId(messageContent)
  const crypto = await mongoClient.getPricesById(objectId)

  if (!crypto) {
    console.error(`[TASK:DATA] - No data found for ID: ${messageContent}`)
    await mongoClient.deletePricesById(objectId)
    return null
  }

  return crypto
}

function formatCryptos(crypto: any): Crypto[] {
  const cryptoArray: Crypto[] = []
  const { timestamp } = crypto

  for (const [name, price] of Object.entries(crypto.prices)) {
    if (!price) {
      console.error(`Price not found for crypto: ${name}`)
      continue
    }

    const symbol = cryptos.find(c =>
      c.name.toLowerCase() === name.toLowerCase() ||
      c.symbol.toLowerCase() === name.toLowerCase()
    )?.symbol

    if (!symbol) {
      console.error(`Failed to format crypto: ${name}`)
      continue
    }

    cryptoArray.push({
      symbol,
      timestamp: timestamp.getTime(),
      value: price
    })
  }

  return cryptoArray
}

async function saveToPostgreSQL(cryptos: Crypto[], apiUrl: string): Promise<void> {
  await $fetch(`${apiUrl}/api/crypto/prices`, {
    method: 'POST',
    body: {
      prices: cryptos.map(crypto => ({
        symbol: crypto.symbol,
        timestamp: crypto.timestamp,
        price: crypto.value
      }))
    }
  })
}
