import { getUserWatchlist } from '~~/server/app/cryptoService'

export default eventHandler(() => {
  return getUserWatchlist()
})
