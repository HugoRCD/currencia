import type { User, UpdateUserDto } from '~~/types/User'

const { fetch } = useUserSession()

export async function updateUser(id: number, updateUserInput: UpdateUserDto) {
  const { error, data } = await useFetch<User>(`/api/user/${id}`, {
    method: 'PUT',
    body: {
      username: updateUserInput.username,
      email: updateUserInput.email,
      avatar: updateUserInput.avatar,
    },
  })
  if (error.value || !data.value) {
    toast.error('Whoops! Something went wrong.')
    return
  }
  await fetch()

  toast.success('User updated!')
}
