import { getAllArticles } from '~~/server/app/feedService'

export default eventHandler(() => {
  return getAllArticles(true)
})
