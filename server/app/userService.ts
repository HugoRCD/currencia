import type { CreateUserDto, UpdateUserDto } from "~/types/User";
import prisma, { formatUser } from "~/server/database/client";
import { isString } from "@vueuse/core";
import { Role } from "~/types/User";
import jwt from "jsonwebtoken";
import { H3Event } from "h3";

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
  const password = await Bun.password.hash(userData.password);
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
  });
  if (!user) throw createError({ statusCode: 404, message: "User not found" });
  return formatUser(user);
}

export async function getUserByLogin(login: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: login }, { username: login }],
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
    { expiresIn: "7d" },
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
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateUserInput,
    },
  });
  return formatUser(user);
}
