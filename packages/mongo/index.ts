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

type SentimentDocument = {
  _id?: string
  timestamp: Date
  date: string
  value: number
  classification: string
  message: string
}

/**
 * A class for interacting with a MongoDB database.
 * It provides methods for inserting and retrieving prices.
 */
export class MongoDBClient {

  private client: MongoClient
  private db: Db | null = null
  private pricesCollection: Collection<PriceDocument> | null = null
  private sentimentCollection: Collection<SentimentDocument> | null = null
  private readonly dbName: string

  constructor(config?: MongoConfig) {
    const envPath = join(process.cwd(), '.env')
    dotenv.config({ path: envPath })

    const url = config?.url || process.env.MONGODB_URL
    this.dbName = config?.dbName || process.env.MONGODB_DB_NAME || 'currencia'

    if (!url) {
      throw new Error('MongoDB URL is not set. Please provide it in constructor or set MONGODB_URL in .env')
    }

    this.client = new MongoClient(url)
  }

  private async initialize(): Promise<void> {
    try {
      await this.client.connect()
      this.db = this.client.db(this.dbName)
      this.pricesCollection = this.db.collection<PriceDocument>('prices')
      this.sentimentCollection = this.db.collection<SentimentDocument>('sentiments')
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
      this.pricesCollection = null
      this.sentimentCollection = null
      console.log('Disconnected from MongoDB')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
      throw error
    }
  }

  private ensureConnection() {
    if (!this.db || !this.pricesCollection || !this.sentimentCollection) {
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
      await this.pricesCollection!.insertOne(document)
      console.log('Successfully saved prices to MongoDB')
    } catch (error) {
      console.error('Failed to save prices to MongoDB:', error)
      throw error
    }
  }

  async getLatestPrices(): Promise<PriceDocument | null> {
    this.ensureConnection()
    try {
      return await this.pricesCollection!
        .findOne<PriceDocument>({}, { sort: { timestamp: -1 } })
    } catch (error) {
      console.error('Failed to fetch latest prices from MongoDB:', error)
      throw error
    }
  }

  async getLatestSentiment(): Promise<SentimentDocument | null> {
    this.ensureConnection()
    try {
      return await this.sentimentCollection!
        .findOne<SentimentDocument>({}, { sort: { timestamp: -1 } })
    } catch (error) {
      console.error('Failed to fetch latest sentiments from MongoDB:', error)
      throw error
    }
  }

  async getPricesById(id: string): Promise<PriceDocument | null> {
    this.ensureConnection()
    try {
      return await this.pricesCollection!
        .findOne<PriceDocument>({ _id: id })
    } catch (error) {
      console.error('Failed to fetch prices by ID from MongoDB:', error)
      throw error
    }
  }

  async deletePricesById(id: string): Promise<void> {
    this.ensureConnection()
    try {
      await this.pricesCollection!.deleteOne({ _id: id })
    } catch (error) {
      console.error('Failed to delete prices by ID from MongoDB:', error)
      throw error
    }
  }

  async deleteSentimentById(id: string): Promise<void> {
    this.ensureConnection()
    try {
      await this.sentimentCollection!.deleteOne({ _id: id })
    } catch (error) {
      console.error('Failed to delete sentiment by ID from MongoDB:', error)
      throw error
    }
  }

}
