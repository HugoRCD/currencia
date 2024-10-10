import { toggleCryptoWatchlist } from '~~/server/app/userService'

export default defineEventHandler(async (event) => {
  const { params } = event.context
  const body = await readBody(event)
  if (!params) throw createError({ statusCode: 400, statusMessage: 'Missing params' })
  const cryptoId = parseInt(params.cryptoId)
  if (!cryptoId) throw createError({ statusCode: 400, statusMessage: 'Missing cryptoId' })
  return await toggleCryptoWatchlist(body.userId, cryptoId)
})
