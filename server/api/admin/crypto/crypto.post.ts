import { H3Event } from 'h3'
import { UpsertCryptoDto } from '~/types/Crypto'
import { upsertCrypto } from '~~/server/app/cryptoService'

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const upsertCryptoDto: UpsertCryptoDto = {
    name: body.name,
    symbol: body.symbol,
    description: body.description,
    logo: body.logo,
    visible: body.visible,
  }
  return await upsertCrypto(upsertCryptoDto)
})
