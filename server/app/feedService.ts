import prisma from "~/server/database/client";
import rtj from "rss-to-json";

export async function getData() {
  const url = "https://www.cryptopolitan.com/feed/";
  const rss = await rtj.parse(url);
  const feed = await $fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/xml",
    },
  });
  console.log(rss);
  return rss;
}
