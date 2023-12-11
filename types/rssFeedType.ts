export type rssFeedItem = {
  title: string;
  description: string;
  link: string;
  published: string;
  created: string;
  image?: string;
  category: string[];
  media: {
    thumbnail: {
      url: string;
      medium?: string;
      type?: string;
    };
  };
};

export type rssFeed = {
  title: string;
  description: string;
  link: string;
  image: string;
  category: string[];
  items: rssFeedItem[];
};
