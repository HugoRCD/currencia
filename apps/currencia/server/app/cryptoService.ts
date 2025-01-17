import { CryptoPrice } from '@prisma/client'
import type { UpsertCryptoDto } from '~~/types/Crypto'

export async function getAllCryptos(all: boolean = false) {
  const cryptos = await prisma.crypto.findMany({
    orderBy: {
      id: 'asc',
    },
    include: {
      prices: {
        orderBy: {
          timestamp: 'asc',
        },
      },
    }
  })

  const smoothPrices = (prices: CryptoPrice[], windowSize: number = 20) => {
    if (prices.length === 0) return []

    const calculateEMA = (data: number[], period: number): number[] => {
      const k = 2 / (period + 1)
      const emaData = [data[0]]

      for (let i = 1; i < data.length; i++) {
        const ema = data[i] * k + emaData[i - 1] * (1 - k)
        emaData.push(ema)
      }

      return emaData
    }

    const firstPass = prices.map((_, index) => {
      const start = Math.max(0, index - windowSize + 1)
      const windowPrices = prices.slice(start, index + 1)
      return windowPrices.reduce((sum, p) => sum + p.price, 0) / windowPrices.length
    })

    const secondPass = calculateEMA(firstPass, Math.floor(windowSize / 2))

    const skipPoints = Math.max(1, Math.floor(prices.length / 200)) // Garder environ 200 points maximum

    return prices.map((price, index) => ({
      ...price,
      price: Number(secondPass[index].toFixed(2))
    })).filter((_, index) => index % skipPoints === 0)
  }

  const processedCryptos = cryptos.map(crypto => ({
    ...crypto,
    prices: smoothPrices(crypto.prices)
  }))

  if (!all) return processedCryptos.filter((crypto) => crypto.visible)
  return processedCryptos
}

export function upsertCrypto(upsertCryptoDto: UpsertCryptoDto) {
  return prisma.crypto.upsert({
    where: {
      name: upsertCryptoDto.name,
    },
    update: upsertCryptoDto,
    create: upsertCryptoDto,
  })
}

export function deleteCrypto(cryptoId: number) {
  return prisma.crypto.delete({
    where: {
      id: cryptoId,
    },
  })
}

export function getUserWatchlist(userId: number) {
  return prisma.watchlist.findMany({
    where: {
      userId,
    },
    include: {
      crypto: true,
    },
  })
}
