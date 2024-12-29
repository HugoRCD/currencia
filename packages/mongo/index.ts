import { join } from 'path'
import { MongoClient, Collection, Db } from 'mongodb'
import * as dotenv from 'dotenv'

type MongoConfig = {
  url?: string
  dbName?: string
  collectionName?: string
}

type PriceDocument = {
  _id?: string
  timestamp: Date
  prices: Record<string, number>
}

/**
 * A class for interacting with a MongoDB database.
 * It provides methods for inserting and retrieving prices.
 */
export class MongoDBClient {

  private client: MongoClient
  private db: Db | null = null
  private collection: Collection<PriceDocument> | null = null
  private readonly dbName: string
  private readonly collectionName: string

  constructor(config?: MongoConfig) {
    const envPath = join(process.cwd(), '.env')
    dotenv.config({ path: envPath })

    const url = config?.url || process.env.MONGODB_URL
    this.dbName = config?.dbName || process.env.MONGODB_DB_NAME || 'currencia'
    this.collectionName = config?.collectionName || process.env.MONGODB_COLLECTION_NAME || 'prices'

    if (!url) {
      throw new Error('MongoDB URL is not set. Please provide it in constructor or set MONGODB_URL in .env')
    }

    this.client = new MongoClient(url)
  }

  private async initialize(): Promise<void> {
    try {
      await this.client.connect()
      this.db = this.client.db(this.dbName)
      this.collection = this.db.collection<PriceDocument>(this.collectionName)
      console.log('Successfully connected to MongoDB')
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      throw error
    }
  }

  public static async create(config?: MongoConfig): Promise<MongoDBClient> {
    const client = new MongoDBClient(config)
    await client.initialize()
    return client
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.close()
      this.db = null
      this.collection = null
      console.log('Disconnected from MongoDB')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
      throw error
    }
  }

  private ensureConnection() {
    if (!this.db || !this.collection) {
      throw new Error('MongoDB client not connected')
    }
  }

  async savePrices(prices: Record<string, number>): Promise<void> {
    this.ensureConnection()

    try {
      const document: PriceDocument = {
        timestamp: new Date(),
        prices
      }

      await this.collection!.insertOne(document)
      console.log('Successfully saved prices to MongoDB')
    } catch (error) {
      console.error('Failed to save prices to MongoDB:', error)
      throw error
    }
  }

  async getLatestPrices(): Promise<PriceDocument | null> {
    this.ensureConnection()

    try {
      return await this.collection!
        .findOne({}, { sort: { timestamp: -1 } })
    } catch (error) {
      console.error('Failed to fetch latest prices from MongoDB:', error)
      throw error
    }
  }

  async getPricesByDateRange(startDate: Date, endDate: Date): Promise<PriceDocument[]> {
    this.ensureConnection()

    try {
      return await this.collection!
        .find({
          timestamp: {
            $gte: startDate,
            $lte: endDate
          }
        })
        .sort({ timestamp: 1 })
        .toArray()
    } catch (error) {
      console.error('Failed to fetch prices by date range from MongoDB:', error)
      throw error
    }
  }

}
