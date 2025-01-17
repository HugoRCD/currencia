import { MongoDBClient } from '@currencia/mongo'
import { cryptos } from '@currencia/cryptos'
import { ObjectId } from 'mongodb'
import { RabbitMQClient } from '~/utils/rabbit'

type Crypto = {
  symbol: string;
  timestamp: number;
  value: number;
};

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
      retryDelay: 5000
    })
    const mongoClient = await MongoDBClient.create()

    try {
      console.log('[TASK:DATA] - Starting message consumer')
      await rabbitClient.connect()

      await rabbitClient.consumeMessages(async (messageContent) => {
        console.log('[TASK:DATA] - Processing message:', messageContent)

        const objectId = new ObjectId(messageContent)

        const crypto = await mongoClient.getPricesById(objectId)

        if (!crypto) {
          console.error(`[TASK:DATA] - No data found for ID: ${messageContent}`)
          await mongoClient.deletePricesById(objectId)
          return
        }

        const { timestamp } = crypto
        const cryptoArray: Crypto[] = []

        for (const [name, price] of Object.entries(crypto.prices)) {
          try {
            if (!price) {
              console.error(`Price not found for crypto: ${name}`)
              continue
            }
            const formattedCrypto = formatCrypto(name, price, timestamp)
            if (!formattedCrypto) {
              console.error(`Failed to format crypto: ${name}`)
              continue
            }
            cryptoArray.push(formattedCrypto)
          } catch (error) {
            console.error(`Failed to format crypto ${name}:`, error)
          }
        }

        if (cryptoArray.length === 0)
          throw new Error('No cryptocurrencies were successfully formatted')

        await saveToPostgreSQL(cryptoArray)

        await mongoClient.deletePricesById(objectId)

        console.log(`[TASK:DATA] - Successfully processed ${cryptoArray.length} cryptocurrencies`)
      })

      // eslint-disable-next-line
      await rabbitClient.processDLQ(async (messageContent) => {
        console.log('[TASK:DATA] - Processing failed message from DLQ:', messageContent)
      })
      return { result: 'Success' }
    } catch (error) {
      console.error('[TASK:DATA] - Error in consumer:', error)
      throw error
    }
  },
})

function formatCrypto(name: string, price: number, timestamp: Date): Crypto | null {
  const symbol = cryptos.find(c => c.name.toLowerCase() === name.toLowerCase())?.symbol ||
    cryptos.find(c => c.symbol.toLowerCase() === name.toLowerCase())?.symbol

  if (!symbol) {
    return null
  }

  return {
    symbol,
    timestamp: timestamp.getTime(),
    value: price
  }
}

async function saveToPostgreSQL(cryptos: Crypto[]): Promise<void> {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig.apiUrl
  for (const crypto of cryptos) {
    await $fetch(`${baseUrl}/api/crypto/${crypto.symbol}`, {
      method: 'POST',
      body: {
        timestamp: crypto.timestamp,
        price: crypto.value
      }
    })
  }
}
