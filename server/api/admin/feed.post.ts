import { H3Event } from 'h3'
import { insertRssFeed } from '~~/server/app/feedService'

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { url } = body
  return await insertRssFeed(url)
})
