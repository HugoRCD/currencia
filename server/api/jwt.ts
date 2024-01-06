import { authOptions } from "./auth/callback";
import { getServerSession, getServerToken } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  const jwt = await getServerToken(event, authOptions);
  return { session, jwt };
});
