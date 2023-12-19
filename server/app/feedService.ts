import rtj from "rss-to-json";
import type { CreateArticleDto } from "~/types/Article";
import type { rssFeed, rssFeedItem } from "~/types/rssFeedType";
import prisma from "~/server/database/client";

export async function getRssFeed(url: string) {
  const parsedFeed = (await rtj.parse(url)) as rssFeed;
  const articles = [] as CreateArticleDto[];
  parsedFeed.items.forEach((item: rssFeedItem) => {
    if (item.media && item.media.thumbnail && item.media.thumbnail.url) {
      articles.push({
        title: item.title,
        link: item.link,
        description: item.description,
        publishedAt: item.published,
        preview: item.media.thumbnail.url,
      });
    }
  });

  return articles;
}

export async function insertItemArticle(article: CreateArticleDto) {
  const foundArticle = await getArticlesByLink(article.link);
  console.log(foundArticle);
  if (foundArticle != null && foundArticle.length > 0) {
    return;
  } else {
    return prisma.article.create({
      data: {
        title: article.title,
        description: article.description,
        link: article.link,
        preview: article.preview || "https://via.placeholder.com/150",
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

export async function getFeedByLink(link: string) {
  return prisma.rssFeed.findFirst({
    where: {
      link,
    },
  });
}

export async function getAllFeeds() {
  return prisma.rssFeed.findMany();
}

export async function insertRssFeed(url: string) {
  const foundFeed = await getFeedByLink(url);
  if (foundFeed) {
    throw createError({
      statusCode: 400,
      statusMessage: "Feed already exists",
    });
  }
  return prisma.rssFeed.create({
    data: {
      link: url,
    },
  });
}
export async function updateVisibleArticle(id: number, visible: boolean) {
  return prisma.article.update({
    where: {
      id,
    },
    data: {
      visible,
    },
  });
}
