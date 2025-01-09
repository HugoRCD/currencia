import { z } from 'zod'

const symbolParams = z.object({
  symbol: z.string(),
})

export default defineEventHandler(async (event) => {
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)
  const body = await readBody(event)
  const { price, timestamp } = await readValidatedBody(event, z.object({
    price: z.number(),
    timestamp: z.number(),
  }).parse)

  const crypto = await prisma.crypto.findUnique({
    where: {
      symbol,
    }
  })
  if (!crypto) return createError({ statusCode: 404, message: 'Crypto not found' })
  await prisma.prices.create({
    data: {
      cryptoId: crypto.id,
      timestamp,
      price
    }
  })
  return {
    statusCode: 201,
    body: {
      message: 'Price saved successfully'
    }
  }
})
