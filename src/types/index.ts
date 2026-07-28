// Firestore'dan o'qilgan barcha sana maydonlari Server Component'dan Client Component'ga
// uzatilishidan OLDIN doim ISO-string (yoki null) ko'rinishiga aylantiriladi (bu lib/data
// papkasidagi mapper funksiyalarida amalga oshiriladi). Xom Firestore Timestamp obyekti hech
// qachon Client Component'ga prop sifatida uzatilmasligi kerak — aks holda Next.js "Only plain
// objects can be passed to Client Components from Server Components" xatoligini beradi.
export type DateLike = string | Date | null;

export type UserRole = "admin" | "editor" | "moderator";

export type ArticleStatus = "draft" | "published" | "scheduled";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
  createdAt: DateLike;
  lastLoginAt?: DateLike;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  createdAt: DateLike;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: DateLike;
}

export interface GalleryImage {
  url: string;
  caption?: string;
  path: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content produced by TipTap
  coverImage: string;
  coverImagePath?: string;
  gallery: GalleryImage[];
  youtubeUrl?: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  tagIds: string[];
  tagNames: string[];
  tagSlugs: string[];
  authorId: string;
  authorName: string;
  authorPhotoURL?: string | null;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: DateLike;
  scheduledAt: DateLike;
  createdAt: DateLike;
  updatedAt: DateLike;
  views: number;
  likes: number;
  commentsCount: number;
  readingTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface ArticleFormInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImagePath?: string;
  gallery: GalleryImage[];
  youtubeUrl?: string;
  categoryId: string;
  tagIds: string[];
  status: ArticleStatus;
  featured: boolean;
  scheduledAt: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export type CommentStatus = "pending" | "approved" | "spam";

export interface Comment {
  id: string;
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  name: string;
  email: string;
  content: string;
  status: CommentStatus;
  createdAt: DateLike;
  parentId?: string | null;
  likes: number;
}

export interface MediaItem {
  id: string;
  url: string;
  path: string;
  type: "image" | "video";
  fileName: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  uploadedBy: string;
  createdAt: DateLike;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  footerText: string;
  socials: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    youtube?: string;
    twitter?: string;
  };
  googleAnalyticsId?: string;
  adSlots: {
    headerCode?: string;
    sidebarCode?: string;
    inArticleCode?: string;
    footerCode?: string;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  lastCursor: string | null;
  hasMore: boolean;
}
