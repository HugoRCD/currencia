import { H3Event } from "h3";
import { getAllFeeds, getRssFeed, insertItemArticle } from "~~/server/app/feedService";

export default eventHandler(async (event: H3Event) => {
  const feeds = await getAllFeeds();
  const data = [];
  console.log(feeds);
  if (feeds.length !== 0) {
    for (const url of feeds) {
      data.push(await getRssFeed(url.link));
    }
  }
  if (data.length !== 0) {
    console.log("Inserting articles");
    for (const article of data) {
      for (const item of article) {
        await insertItemArticle(item);
      }
    }
  }
});
