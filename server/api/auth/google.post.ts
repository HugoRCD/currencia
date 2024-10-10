import { H3Event } from "h3";
import { formatUser } from "~~/server/database/client";
import { getUserProfile } from "~~/server/app/googleService";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const user = await getUserProfile(body.access_token);
  setCookie(event, "authToken", user.authToken as string, {
    httpOnly: true,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return formatUser(user);
});
