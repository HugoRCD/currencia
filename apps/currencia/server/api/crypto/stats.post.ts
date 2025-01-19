import { z } from 'zod'
import { StatType } from '@prisma/client'

const statSchema = z.object({
  value: z.string(),
  symbol: z.string(),
  type: z.nativeEnum(StatType)
})

const bodySchema = z.object({
  stats: z.array(statSchema)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const cryptos = await prisma.crypto.findMany({
    where: {
      symbol: {
        in: body.stats.map(({ symbol }) => symbol)
      }
    }
  })

  await prisma.stat.createMany({
    data: body.stats.map(({ value, type, symbol }) => {
      const crypto = cryptos.find(c => c.symbol === symbol)
      return {
        cryptoId: crypto ? Number(crypto.id) : null,
        value: parseFloat(value),
        type
      }
    })
  })

  return {
    statusCode: 201,
    body: {
      message: `${body.stats.length} stats saved successfully`
    }
  }
})
