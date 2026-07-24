export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName?: string;
  authorAvatar?: string;
  readTime?: string;
  published: boolean;
  views?: number;
  createdAt: { seconds: number; nanoseconds: number } | string | any;
  updatedAt: { seconds: number; nanoseconds: number } | string | any;
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName?: string;
  published?: boolean;
}
