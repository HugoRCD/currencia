import { MongoDBClient } from '@currencia/mongo'

export default defineTask({
  meta: {
    name: 'sync:mongo',
    description: 'Send MongoID to RabbitMQ',
  },
  async run() {
    const client = await MongoDBClient.create()
    console.log('Syncing MongoID to RabbitMQ')
    const price = await client.getLatestPrices()
    console.log('Price:', price)
    console.log('Ids to sync:', price?._id)
    return { result: 'Success' }
  },
})
