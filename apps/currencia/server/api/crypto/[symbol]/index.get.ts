import { z } from 'zod'

const symbolParams = z.object({
  symbol: z.string(),
})

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const { symbol } = await getValidatedRouterParams(event, symbolParams.parse)

  const sendRandomNumber = () => generateRandomValue()

  const interval = setInterval(async () => {
    await eventStream.push(String(sendRandomNumber()))
  }, 2000)

  eventStream.onClosed(async () => {
    clearInterval(interval)
    await eventStream.close()
  })

  return eventStream.send()
})
