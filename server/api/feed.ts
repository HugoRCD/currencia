import { H3Event } from "h3";
import { getRssFeed, insertItemArticle } from "~/server/app/feedService";

export default eventHandler(async (event: H3Event) => {
  const url = "https://Blockchain.News/RSS/";
  const url2 = "https://www.cryptopolitan.com/feed/";
  const urlArray = [url, url2];
  let data = null;

  if (urlArray.length !== 0) {
    for (const url1 of urlArray) {
      data = await getRssFeed(url1);
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
