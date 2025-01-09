import { z } from 'zod'

const symbolParams = z.object({
  symbol: z.string(),
})

export default defineEventHandler(async (event) => {
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)
  const { price } = await readValidatedBody(event, z.object({
    price: z.number(),
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
