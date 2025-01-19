import { StatType } from '@prisma/client'

export default defineTask({
  meta: {
    name: 'stats:ath',
    description: 'Generate ATH stats',
  },
  async run() {
    try {
      console.log('[TASK:STATS] - Generating ATH Stats...')

      const cryptos = await prisma.crypto.findMany({
        include: {
          prices: true
        }
      })

      await Promise.all(cryptos.map(async (crypto) => {
        const { prices } = crypto
        const ath = prices.reduce((acc, price) => {
          if (price.price > acc) return price.price
          return acc
        }, 0)

        await prisma.stat.upsert({
          where: {
            cryptoId_type: {
              cryptoId: crypto.id,
              type: StatType.ATH
            }
          },
          update: {
            value: ath
          },
          create: {
            cryptoId: crypto.id,
            type: StatType.ATH,
            value: ath
          }
        })
      }))

      return { result: 'Success' }
    } catch (error) {
      console.error('[TASK:STATS] - Error in generating stats task:', error)
      throw error
    }
  },
})
