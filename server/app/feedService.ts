import rtj from "rss-to-json";
import type { CreateArticleDto } from "~/types/Article";
import type { rssFeed, rssFeedItem } from "~/types/rssFeedType";
import prisma from "~/server/database/client";

export async function getRssFeed(url: string) {
  const parsedFeed = (await rtj.parse(url)) as rssFeed;
  const articles = [] as CreateArticleDto[];
  parsedFeed.items.forEach((item: rssFeedItem) => {
    articles.push({
      title: item.title,
      link: item.link,
      description: item.description,
      publishedAt: item.published,
      preview: item.media.thumbnail.url,
    });
  });

  return articles;
}

export async function insertItemArticle(article: CreateArticleDto) {
  const foundArticle = await getArticlesByLink(article.link);
  if (foundArticle != null && foundArticle.length > 0) return;
  else {
    return prisma.article.create({
      data: {
        title: article.title,
        description: article.description,
        link: article.link,
        preview: article.preview,
        publishedAt: new Date(article.publishedAt),
      },
    });
  }
}

export async function getArticlesByLink(link: string) {
  return prisma.article.findMany({
    where: {
      link,
    },
  });
}

export async function getAllArticles(all: boolean = false) {
  if (!all) {
    return prisma.article.findMany({
      where: {
        visible: true,
      },
    });
  } else {
    return prisma.article.findMany();
  }
}
