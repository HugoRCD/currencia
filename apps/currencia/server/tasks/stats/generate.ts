import { type CryptoPrice, type Crypto, StatType } from '@prisma/client'

export default defineTask({
  meta: {
    name: 'stats:generate',
    description: 'Generate various crypto statistics',
  },
  async run() {
    try {
      console.log('[TASK:STATS] - Generating Stats...')

      const cryptos = await prisma.crypto.findMany({
        include: {
          prices: true
        }
      })

      await Promise.all(cryptos.map(async (crypto) => {
        const { prices } = crypto

        // ATH
        const ath = prices.reduce((acc, price) => Math.max(acc, price.price), 0)

        const weeklyPerformance = await getPerformanceStats(crypto, 7)

        const monthlyPerformance = await getPerformanceStats(crypto, 30)

        const volatility = getVolatilityStats(prices)

        const { support, resistance } = getSupportResistance(prices)

        await Promise.all([
          prisma.stat.upsert({
            where: { cryptoId_type: { cryptoId: crypto.id, type: StatType.ALL_TIME_HIGH } },
            update: { value: ath },
            create: { cryptoId: crypto.id, type: StatType.ALL_TIME_HIGH, value: ath }
          }),
          prisma.stat.upsert({
            where: { cryptoId_type: { cryptoId: crypto.id, type: StatType.WEEKLY_PERFORMANCE } },
            update: { value: weeklyPerformance },
            create: { cryptoId: crypto.id, type: StatType.WEEKLY_PERFORMANCE, value: weeklyPerformance }
          }),
          prisma.stat.upsert({
            where: { cryptoId_type: { cryptoId: crypto.id, type: StatType.MONTHLY_PERFORMANCE } },
            update: { value: monthlyPerformance },
            create: { cryptoId: crypto.id, type: StatType.MONTHLY_PERFORMANCE, value: monthlyPerformance }
          }),
          prisma.stat.upsert({
            where: { cryptoId_type: { cryptoId: crypto.id, type: StatType.VOLATILITY } },
            update: { value: volatility },
            create: { cryptoId: crypto.id, type: StatType.VOLATILITY, value: volatility }
          }),
          prisma.stat.upsert({
            where: { cryptoId_type: { cryptoId: crypto.id, type: StatType.SUPPORT_LEVEL } },
            update: { value: support },
            create: { cryptoId: crypto.id, type: StatType.SUPPORT_LEVEL, value: support }
          }),
          prisma.stat.upsert({
            where: { cryptoId_type: { cryptoId: crypto.id, type: StatType.RESISTANCE_LEVEL } },
            update: { value: resistance },
            create: { cryptoId: crypto.id, type: StatType.RESISTANCE_LEVEL, value: resistance }
          })
        ])
      }))

      return { result: 'Success' }
    } catch (error) {
      console.error('[TASK:STATS] - Error in generating stats task:', error)
      throw error
    }
  },
})

const getPerformanceStats = (crypto: Crypto & { prices: CryptoPrice[] }, days: number) => {
  const oldestDate = new Date()
  oldestDate.setDate(oldestDate.getDate() - days)

  const prices = crypto.prices.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const currentPrice = prices[0]?.price || 0
  const oldPrice = prices.find(p => new Date(p.timestamp) <= oldestDate)?.price || currentPrice

  return ((currentPrice - oldPrice) / oldPrice) * 100
}

const getVolatilityStats = (prices: CryptoPrice[]) => {
  const priceValues = prices.map(p => p.price)
  const mean = priceValues.reduce((a, b) => a + b) / priceValues.length
  const variance = priceValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / priceValues.length
  return Math.sqrt(variance)
}

const getSupportResistance = (prices: CryptoPrice[]) => {
  const sortedPrices = prices.map(p => p.price).sort((a, b) => a - b)
  const support = sortedPrices[Math.floor(sortedPrices.length * 0.1)] // 10e percentile
  const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.9)] // 90e percentile
  return { support, resistance }
}
