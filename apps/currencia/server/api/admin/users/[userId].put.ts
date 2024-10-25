import { H3Event } from 'h3'
import { updateRoleUser } from '~~/server/app/userService'

export default eventHandler(async (event: H3Event) => {
  const { params } = event.context
  const body = await readBody(event)
  const { role } = body
  if (!params) throw createError({ statusCode: 400, statusMessage: 'Missing params' })
  const userId = parseInt(params.userId)
  return await updateRoleUser(userId, role)
})
