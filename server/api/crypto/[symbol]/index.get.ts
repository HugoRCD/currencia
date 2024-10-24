import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const { params } = event.context
  const body = await readBody(event)
  if (!params) throw createError({ statusCode: 400, statusMessage: 'Missing params' })
  const symbol = parseInt(params.symbol)
  // Do something with the symbol

})
