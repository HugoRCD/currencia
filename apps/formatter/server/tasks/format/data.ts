import { MongoDBClient } from '@currencia/mongo'
import { cryptos } from '@currencia/cryptos'
import { ObjectId } from 'mongodb'

// create type
type Crypto = {
  symbol: string;
  timestamp: number;
  value: number;
};

export default defineTask({
  meta: {
    name: 'format:data',
    description: 'format data from MongoDB',
  },
  async run() {
    console.log('start formatting data from MongoDB')
    const id = '6736189f7374eada511d9bfd'
    try {
      console.log('Formatting data from MongoDB')
      const client = await MongoDBClient.create()
      const objectId = new ObjectId(id)
      const crypto = await client.getPricesById(objectId)
      const { timestamp } = crypto

      if (!crypto) {
        throw new Error(`Data Prices not found with id: ${id}`)
      }

      const cryptoArray: Crypto[] = []

      try {
        for (const [name, price] of Object.entries(crypto.prices)) {
          const crypto = formatCrypto(name, price, timestamp)
          cryptoArray.push(crypto)
        }
      } catch (error) {
        console.error('Failed to format crypto:', error)
      }
      // TODO : Added the data to the postgreSQL

      // TODO : Deleted the data from the MongoDB with the id

      console.log('Formatted crypto:', cryptoArray)
    } catch (error) {
      console.error('Failed to fetch crypto from MongoDB:', error)
      throw error
    }
  },
})

function formatCrypto(name: string, price: number, timestamp: Date): Crypto {
  return {
    symbol: cryptos.find(c => c.name.toLowerCase() === name.toLowerCase())?.symbol || cryptos.find(c => c.symbol.toLowerCase() === name.toLowerCase())?.symbol,
    timestamp: timestamp.getTime(),
    value: price
  }
}

