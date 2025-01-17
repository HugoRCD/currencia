import { z } from 'zod'
import { Prices } from '@prisma/client'

const symbolParams = z.object({
  symbol: z.string(),
})

async function getCryptoPrice(symbol: string): Promise<Prices> {
  return await prisma.prices.findFirst({
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
  eventStream.push(JSON.stringify(crypto, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ))

  const interval = setInterval(async () => {
    const crypto = await getCryptoPrice(symbol)
    eventStream.push(JSON.stringify(crypto, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    ))
  }, 5000)

  eventStream.onClosed(() => {
    clearInterval(interval)
    eventStream.close()
  })

  return eventStream.send()
})
