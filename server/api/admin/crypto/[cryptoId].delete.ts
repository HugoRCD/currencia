import { H3Event } from 'h3'
import { deleteCrypto } from '~~/server/app/cryptoService'

export default eventHandler(async (event: H3Event) => {
  const { params } = event.context
  if (!params) throw createError({ statusCode: 400, statusMessage: 'Missing params' })
  const cryptoId = parseInt(params.cryptoId)
  return await deleteCrypto(cryptoId)
})
