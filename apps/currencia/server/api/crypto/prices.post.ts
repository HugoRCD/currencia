import { z } from 'zod'

const symbolParams = z.object({
  symbol: z.string(),
})

const priceSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  timestamp: z.number(),
})

const bodySchema = z.object({
  prices: z.array(priceSchema)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const cryptos = await prisma.crypto.findMany({
    where: {
      symbol: {
        in: body.prices.map(({ symbol }) => symbol)
      }
    }
  })

  await prisma.cryptoPrice.createMany({
    data: body.prices.map(({ price, timestamp, symbol }) => ({
      cryptoId: cryptos.find(c => c.symbol === symbol)!.id,
      timestamp: timestamp.toString(),
      price
    }))
  })
  return {
    statusCode: 201,
    body: {
      message: `${body.prices.length} prices saved successfully`
    }
  }
})
