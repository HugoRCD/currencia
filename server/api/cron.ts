import { getRssFeed, insertItemArticle } from "~/server/app/feedService";

export default eventHandler(async () => {
  console.log("Sync new articles");
  const sources = ["https://Blockchain.News/RSS/", "https://www.cryptopolitan.com/feed/"];
  let data = null;

  for (const url of sources) {
    data = await getRssFeed(url);
  }
  if (data !== null) {
    for (const article of data) {
      await insertItemArticle(article);
    }
  }
});
