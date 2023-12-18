import type { CreateUserDto, UpdateUserDto } from "~/types/User";
import prisma, { formatUser } from "~/server/database/client";
import { isString } from "@vueuse/core";
import { Role } from "~/types/User";
import jwt from "jsonwebtoken";
import { H3Event } from "h3";
import bcrypt from "bcryptjs";

export async function createUser(userData: CreateUserDto) {
  const foundUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: userData.username,
        },
        {
          email: userData.email,
        },
      ],
    },
  });
  if (foundUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists",
    });
  }
  const password = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      ...userData,
      password,
    },
  });
  return formatUser(user);
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      watchlist: true,
    },
  });
  if (!user) throw createError({ statusCode: 404, message: "User not found" });
  return formatUser(user);
}

export async function getUserByLogin(login: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: login }, { username: login }],
    },
    include: {
      watchlist: true,
    },
  });
}

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users.map((user) => {
    return formatUser(user);
  });
}

export async function getUserByAuthToken(authToken: string) {
  const user = await prisma.user.findFirst({
    where: {
      authToken,
    },
    include: {
      watchlist: true,
    },
  });
  if (!user) return null;
  return formatUser(user);
}

export async function setAuthToken(userId: number) {
  const user = await getUserById(userId);
  const authToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    },
    useRuntimeConfig().private.authSecret,
    { expiresIn: "30d" },
  );
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      authToken,
    },
  });
}

export async function adminCheck(event: H3Event): Promise<boolean> {
  const authToken = getCookie(event, "authToken");
  const hasAuthToken = isString(authToken);
  if (!hasAuthToken) return false;
  const user = await getUserByAuthToken(authToken);
  if (!user) return false;
  return user.role === Role.Admin;
}

export async function deleteUser(userId: number) {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

export async function updateUser(userId: number, updateUserInput: UpdateUserDto) {
  const foundUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!foundUser) throw createError({ statusCode: 404, message: "User not found" });
  const newUsername = updateUserInput.username;
  if (newUsername && newUsername !== foundUser.username) {
    const usernameTaken = await prisma.user.findFirst({
      where: {
        username: newUsername,
      },
    });
    if (usernameTaken) throw createError({ statusCode: 400, message: "Username already taken" });
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateUserInput,
    },
  });
  return formatUser(user);
}

export async function updateRoleUser(userId: number, role: Role) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
    },
  });
  return formatUser(user);
}

export async function toggleCryptoWatchlist(userId: number, cryptoId: number) {
  const foundUser = await getUserById(userId);
  if (!foundUser) throw createError({ statusCode: 404, message: "User not found" });
  const foundCrypto = await prisma.watchlist.findFirst({
    where: {
      userId: foundUser.id,
      cryptoId,
    },
  });
  if (foundCrypto) {
    await prisma.watchlist.delete({
      where: {
        id: foundCrypto.id,
      },
    });
  } else {
    await prisma.watchlist.create({
      data: {
        userId: foundUser.id,
        cryptoId,
      },
    });
  }
  return getUserById(userId);
}
