import dayjs from 'dayjs'
import type { UpsertCryptoDto } from '~~/types/Crypto'
import { generateRandomValue } from '~~/server/utils/number'

function smoothCryptoData(cryptoData: [timestamp: number, value: number][], windowSize: number) {
  const smoothedData = []

  for (let i = 0; i < cryptoData.length; i++) {
    let sum = 0
    let count = 0

    for (let j = Math.max(0, i - windowSize); j <= Math.min(cryptoData.length - 1, i + windowSize); j++) {
      sum += cryptoData[j][1]
      count++
    }

    smoothedData.push([cryptoData[i][0], sum / count])
  }

  return smoothedData
}

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
  if (!all) return cryptos.filter((crypto) => crypto.visible)
  return cryptos
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
