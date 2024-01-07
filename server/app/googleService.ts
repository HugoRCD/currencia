import { google } from "googleapis";
import { createOrLoginWithGoogle } from "./userService";

export async function getUserProfile(accessToken: string) {
  const runTimeConfig = await useRuntimeConfig();
  const oauth2Client = new google.auth.OAuth2(
    runTimeConfig.public.googleClientId,
    runTimeConfig.private.googleClientSecret,
    runTimeConfig.public.googleRedirectUri,
  );
  oauth2Client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  const { data } = await oauth2.userinfo.get();
  const user = await createOrLoginWithGoogle(data);
  return user;
}
