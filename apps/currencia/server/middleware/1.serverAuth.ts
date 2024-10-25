import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const protectedRoutes = ['/api/admin', '/api/user']

  if (!protectedRoutes.some((route) => event.path?.startsWith(route))) {
    return
  }

  const session = await requireUserSession(event)

  event.context.user = session.user
})
