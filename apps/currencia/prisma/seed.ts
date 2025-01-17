import { cryptos } from '@currencia/cryptos'
import { Classification, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

async function main() {
  for (const crypto of cryptos) {
    await prisma.crypto.upsert({
      where: { symbol: crypto.symbol },
      update: {
        name: crypto.name,
        symbol: crypto.symbol,
        logo: crypto.logo,
        description: crypto.description,
      },
      create: {
        name: crypto.name,
        symbol: crypto.symbol,
        logo: crypto.logo,
        description: crypto.description
      },
    })
  }
/*
  const sentiments = await prisma.sentiment.createMany({
    data: [
      {
        classification: Classification.BULLISH,
        message: 'Upward trend',
        date: new Date(),
        value: 80
      },
      {
        classification: Classification.BEARISH,
        message: 'Downward trend',
        date: new Date(),
        value: 30
      }
    ]
  })
*/
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
