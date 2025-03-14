import { H3Event } from 'h3'
import { Role } from '~~/types/User'

export default defineEventHandler((event: H3Event) => {
  const protectedRoutes = ['/api/admin']

  const { user } = event.context

  if (protectedRoutes.some((route) => event.path?.startsWith(route)) && (!user || user.role !== Role.Admin)) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'insufficient permissions',
      }),
    )
  }
})
