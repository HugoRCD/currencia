import { z } from 'zod'
import { CryptoPrice } from '@prisma/client'

const symbolParams = z.object({
  symbol: z.string(),
})

async function getCryptoPrice(symbol: string): Promise<CryptoPrice> {
  const crypto = await prisma.cryptoPrice.findFirst({
    where: {
      crypto: {
        symbol,
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  if (!crypto) throw createError({ statusCode: 404, statusMessage: 'Crypto not found' })
  return crypto
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
