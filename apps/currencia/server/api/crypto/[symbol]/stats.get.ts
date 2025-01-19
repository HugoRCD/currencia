import { H3Event } from 'h3'
import { z } from 'zod'
import { StatType } from '@prisma/client'

const symbolParams = z.object({
  symbol: z.string(),
})

type CryptoStats = {
  allTimeHigh: number | null
  weeklyChange: number | null
  monthlyChange: number | null
  volatility: number | null
  supportLevel: number | null
  resistanceLevel: number | null
  timestamp: string | null
}

export default defineEventHandler(async (event: H3Event): Promise<CryptoStats> => {
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)

  const stats = await prisma.stat.findMany({
    where: {
      crypto: {
        symbol
      },
      type: {
        in: [
          StatType.ALL_TIME_HIGH,
          StatType.WEEKLY_PERFORMANCE,
          StatType.MONTHLY_PERFORMANCE,
          StatType.VOLATILITY,
          StatType.SUPPORT_LEVEL,
          StatType.RESISTANCE_LEVEL,
        ]
      }
    },
    include: {
      crypto: {
        select: {
          symbol: true,
          name: true
        }
      }
    }
  })

  const defaultStats: CryptoStats = {
    allTimeHigh: null,
    weeklyChange: null,
    monthlyChange: null,
    volatility: null,
    supportLevel: null,
    resistanceLevel: null,
    timestamp: null
  }

  return stats.reduce((acc, stat) => {
    switch (stat.type) {
      case StatType.ALL_TIME_HIGH:
        acc.allTimeHigh = stat.value
        acc.timestamp = stat.updatedAt.toISOString()
        break
      case StatType.WEEKLY_PERFORMANCE:
        acc.weeklyChange = stat.value
        break
      case StatType.MONTHLY_PERFORMANCE:
        acc.monthlyChange = stat.value
        break
      case StatType.VOLATILITY:
        acc.volatility = stat.value
        break
      case StatType.SUPPORT_LEVEL:
        acc.supportLevel = stat.value
        break
      case StatType.RESISTANCE_LEVEL:
        acc.resistanceLevel = stat.value
        break
    }
    return acc
  }, defaultStats)
})
