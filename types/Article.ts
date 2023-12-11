export type Article = {
  id: number;
  title: string;
  description: string;
  link: string;
  preview: string;
  publishedAt: Date;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateArticleDto = {
  title: string;
  description: string;
  link: string;
  preview: string;
  publishedAt: string;
};
