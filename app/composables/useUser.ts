import type { User, UpdateUserDto } from '~~/types/User'


export async function updateUser(id: number, updateUserInput: UpdateUserDto) {
  try {
    const { fetch } = useUserSession()
    await $fetch<User>(`/api/user/${id}`, {
      method: 'PUT',
      body: {
        username: updateUserInput.username,
        email: updateUserInput.email,
        avatar: updateUserInput.avatar,
      },
    })
    toast.success('User updated!')
    await fetch()
  } catch (error) {
    toast.error('Whoops! Something went wrong.')
  }
}
