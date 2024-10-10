import { Role } from '~~/types/User'

export default defineNuxtRouteMiddleware((): Promise<void> => {
  const { user } = useUserSession()
  if (!user.value.role === Role.Admin) {
    toast.error('You need to be an admin to access this page.')
    return '/app/dashboard'
  }
})
