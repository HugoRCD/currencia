import { H3Event } from "h3";
import { getAllFeeds, getRssFeed, insertItemArticle } from "~/server/app/feedService";

export default eventHandler(async (event: H3Event) => {
  const feeds = await getAllFeeds();
  let data = null;

  if (feeds.length !== 0) {
    for (const url1 of feeds) {
      data = await getRssFeed(url1.link);
    }
  }
  if (data !== null) {
    for (const article of data) {
      await insertItemArticle(article);
    }
    console.log("Articles inserted");
  }

  return data;
});
