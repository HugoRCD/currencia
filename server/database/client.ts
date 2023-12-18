import { publicUser, Role } from "~/types/User";
import pkg, { User as PrismaUser } from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
export default prisma;

export function formatUser(user: PrismaUser): publicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as Role,
    avatar: user.avatar,
    authToken: user.authToken || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    watchlist: user.watchlist,
  };
}
