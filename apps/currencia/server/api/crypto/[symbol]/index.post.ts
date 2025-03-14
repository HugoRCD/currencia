import { z } from 'zod'

const symbolParams = z.object({
  symbol: z.string(),
})

const priceSchema = z.object({
  price: z.number(),
  timestamp: z.number(),
})

const bodySchema = z.object({
  prices: z.array(priceSchema)
})

export default defineEventHandler(async (event) => {
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)
  const body = await readValidatedBody(event, bodySchema.parse)

  const crypto = await prisma.crypto.findUnique({
    where: {
      symbol,
    }
  })

  if (!crypto) return createError({ statusCode: 404, message: 'Crypto not found' })

  await prisma.cryptoPrice.createMany({
    data: body.prices.map(({ price, timestamp }) => ({
      cryptoId: crypto.id,
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
