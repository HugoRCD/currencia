import { H3Event } from 'h3'
import { getAllFeeds } from '~~/server/app/feedService'

export default eventHandler(async (event: H3Event) => {
  return await getAllFeeds()
})
