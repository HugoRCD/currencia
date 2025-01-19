import { H3Event } from 'h3'
import { z } from 'zod'
import { type Stat, StatType } from '@prisma/client'

const symbolParams = z.object({
  symbol: z.string(),
})

export default defineEventHandler(async (event: H3Event): Promise<Stat> => {
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)

  const ath = await prisma.stat.findFirst({
    where: {
      crypto: {
        symbol
      },
      type: StatType.ATH
    }
  })
  if (!ath) throw createError({ statusCode: 404, message: 'ATH not found' })

  return ath
})
