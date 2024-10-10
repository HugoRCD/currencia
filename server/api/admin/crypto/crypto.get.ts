import { getAllCryptos } from '~~/server/app/cryptoService'

export default eventHandler(() => {
  return getAllCryptos(true)
})
