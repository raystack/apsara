export type Frontmatter = {
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  publishedAt?: string;
  metaImage?: string;
  readingTime?: { text: string; minutes: number; time: number; words: number };
  radix?: { link: string; api: string };
  links?: { label: string; link: string }[];
};
