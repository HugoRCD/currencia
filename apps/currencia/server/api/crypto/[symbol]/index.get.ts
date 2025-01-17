import { z } from 'zod'
import { CryptoPrice } from '@prisma/client'

const symbolParams = z.object({
  symbol: z.string(),
})

// eslint-disable-next-line
async function getCryptoPrice(symbol: string): Promise<CryptoPrice> {
  return prisma.cryptoPrice.findFirstOrThrow({
    where: {
      crypto: {
        symbol,
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)

  const crypto = await getCryptoPrice(symbol)
  eventStream.push(JSON.stringify(crypto))

  const interval = setInterval(async () => {
    const crypto = await getCryptoPrice(symbol)
    eventStream.push(JSON.stringify(crypto))
  }, 5000)

  eventStream.onClosed(() => {
    clearInterval(interval)
    eventStream.close()
  })

  return eventStream.send()
})
