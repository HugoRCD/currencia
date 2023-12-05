import { H3Event } from "h3";
import { getData } from "~/server/app/feedService";

export default eventHandler(async (event: H3Event) => {
  // const body = await readBody(event);
  const data = await getData();

  return data;
});
