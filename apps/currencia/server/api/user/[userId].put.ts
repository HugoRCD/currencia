import { H3Event } from 'h3'
import { updateUser } from '~~/server/app/userService'

export default eventHandler(async (event: H3Event) => {
  const { params } = event.context
  if (!params) throw createError({ statusCode: 400, statusMessage: 'Missing params' })
  const userId = parseInt(params.userId)
  const updateUserInput = await readBody(event)
  const updatedUser = await updateUser(userId, updateUserInput)
  await setUserSession(event, {
    user: {
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    },
    loggedInAt: new Date().toISOString(),
  })
})
