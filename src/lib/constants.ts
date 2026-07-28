export const SITE_CONFIG = {
  name: "FilmNews.uz",
  shortName: "FilmNews",
  description:
    "FilmNews.uz — kino, serial, multfilm va anime olamidagi eng so'nggi yangiliklar, treylerlar, retsenziyalar va tahlillar. Faqat kino olamiga oid tezkor va ishonchli manba.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://filmnews.uz",
  locale: "uz_UZ",
  themeColor: "#E11D2E",
};

export const DEFAULT_CATEGORIES: { name: string; slug: string; order: number }[] = [
  { name: "Kinolar", slug: "kinolar", order: 1 },
  { name: "Seriallar", slug: "seriallar", order: 2 },
  { name: "Multfilmlar", slug: "multfilmlar", order: 3 },
  { name: "Anime", slug: "anime", order: 4 },
  { name: "Treylerlar", slug: "treylerlar", order: 5 },
  { name: "Retsenziyalar", slug: "retsenziyalar", order: 6 },
  { name: "Aktyorlar", slug: "aktyorlar", order: 7 },
  { name: "TOP ro'yxatlar", slug: "top-royxatlar", order: 8 },
];

export const ARTICLES_PER_PAGE = 12;
export const RELATED_ARTICLES_COUNT = 4;
export const POPULAR_ARTICLES_COUNT = 6;
export const FEATURED_SLIDER_COUNT = 5;

export const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  editor: "Muharrir",
  moderator: "Moderator",
};

export const COMMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  approved: "Tasdiqlangan",
  spam: "Spam",
};
