import { publicUser, User } from "~/types/User";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
export default prisma;

export function formatUser(user: User): publicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    authToken: user.authToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
