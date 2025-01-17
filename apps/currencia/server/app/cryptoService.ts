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
