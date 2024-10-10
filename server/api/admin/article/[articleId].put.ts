import { H3Event } from 'h3'
import { updateVisibleArticle } from '~~/server/app/feedService'
import { updateRoleUser } from '~~/server/app/userService'

export default eventHandler(async (event: H3Event) => {
  const { params } = event.context
  const body = await readBody(event)
  const { visible } = body
  if (!params) throw createError({ statusCode: 400, statusMessage: 'Missing params' })
  const articleId = parseInt(params.articleId)
  return await updateVisibleArticle(articleId, !visible)
})
