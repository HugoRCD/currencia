import { getAllArticles } from "~/server/app/feedService";

export default eventHandler(async () => {
  return getAllArticles(true);
});
