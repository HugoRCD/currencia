import { H3Event } from 'h3'
import { z } from 'zod'
import { StatType } from '@prisma/client'

const symbolParams = z.object({
  symbol: z.string(),
})

export default defineEventHandler(async (event: H3Event) => {
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)

  const ath = await prisma.stat.findFirst({
    where: {
      crypto: {
        symbol
      },
      type: StatType.ATH
    }
  })
  if (!ath) return createError({ statusCode: 404, message: 'ATH not found' })

  return ath
})
