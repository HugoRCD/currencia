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

  const smoothPrices = (prices: CryptoPrice[]) => {
    if (prices.length === 0) return []

    const savitzkyGolay = (data: number[], windowSize: number = 51) => {
      if (data.length < windowSize) {
        windowSize = data.length
        if (windowSize % 2 === 0) windowSize--
      }

      const halfWindow = Math.floor(windowSize / 2)
      const smoothed = []

      for (let i = 0; i < data.length; i++) {
        let sum = 0
        let count = 0

        for (let j = -halfWindow; j <= halfWindow; j++) {
          const idx = i + j
          if (idx >= 0 && idx < data.length) {
            const weight = Math.exp(-(j * j) / (2 * (halfWindow * 0.5) ** 2))
            sum += data[idx] * weight
            count += weight
          }
        }

        smoothed.push(sum / count)
      }

      return smoothed
    }

    const preProcesed = prices.map((_, index) => {
      const start = Math.max(0, index - 5)
      const window = prices.slice(start, index + 1)
      return window.reduce((sum, p) => sum + p.price, 0) / window.length
    })

    const smoothed = savitzkyGolay(preProcesed)

    const significantPoints = []
    let lastValue = smoothed[0]
    const threshold = 0.1

    for (let i = 0; i < prices.length; i++) {
      const currentValue = smoothed[i]
      const variation = Math.abs((currentValue - lastValue) / lastValue)

      if (variation > threshold || i === 0 || i === prices.length - 1) {
        significantPoints.push({
          ...prices[i],
          price: Number(currentValue.toFixed(2))
        })
        lastValue = currentValue
      }
    }

    if (significantPoints.length < 100) {
      const step = Math.floor(prices.length / 100)
      return prices.map((price, index) => ({
        ...price,
        price: Number(smoothed[index].toFixed(2))
      })).filter((_, index) => index % step === 0)
    }

    return significantPoints
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
