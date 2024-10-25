import type { UpdateUserDto, Role, User } from '~~/types/User'

export async function upsertUser(createUserInput: CreateUserInput): Promise<publicUser> {
  const foundUser = await prisma.user.findUnique({
    where: {
      username: createUserInput.username,
    },
  })
  const newUsername = foundUser ? `${createUserInput.username}_#${Math.floor(Math.random() * 1000)}` : createUserInput.username
  return prisma.user.upsert({
    where: {
      email: createUserInput.email,
    },
    update: {
      updatedAt: new Date(),
    },
    create: {
      ...createUserInput,
      username: newUsername,
    },
  })
}

export function getUserById(userId: number) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      watchlist: true,
    },
  })
}

export function getAllUsers() {
  return prisma.user.findMany()
}

export function deleteUser(userId: number) {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  })
}

export async function updateUser(userId: number, updateUserInput: UpdateUserDto): Promise<User> {
  const foundUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })
  if (!foundUser) throw createError({ statusCode: 404, message: 'User not found' })
  const newUsername = updateUserInput.username
  if (newUsername && newUsername !== foundUser.username) {
    const usernameTaken = await prisma.user.findFirst({
      where: {
        username: newUsername,
      },
    })
    if (usernameTaken) throw createError({ statusCode: 400, message: 'Username already taken' })
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...updateUserInput,
    },
  })
}

export function updateRoleUser(userId: number, role: Role) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role,
    },
  })
}

export async function toggleCryptoWatchlist(userId: number, cryptoId: number) {
  const foundUser = await getUserById(userId)
  if (!foundUser) throw createError({ statusCode: 404, message: 'User not found' })
  const foundCrypto = await prisma.watchlist.findFirst({
    where: {
      userId: foundUser.id,
      cryptoId,
    },
  })
  if (foundCrypto) {
    await prisma.watchlist.delete({
      where: {
        id: foundCrypto.id,
      },
    })
  } else {
    await prisma.watchlist.create({
      data: {
        userId: foundUser.id,
        cryptoId,
      },
    })
  }
  return getUserById(userId)
}
