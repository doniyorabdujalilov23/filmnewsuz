import type { DocumentData, Timestamp } from "firebase/firestore";
import type { Article, AppUser, Category, Comment, MediaItem, Tag } from "@/types";

/**
 * Firestore Timestamp (yoki uning ustida .toDate() metodi bo'lgan har qanday obyekt) ni
 * ISO-string ko'rinishiga aylantiradi. Bu qiymat Server Component'dan Client Component'ga
 * xavfsiz uzatilishi mumkin (Timestamp klass instansiyasi esa mumkin emas — "Only plain
 * objects can be passed to Client Components from Server Components" xatoligiga sabab bo'ladi).
 */
export function toIsoOrNull(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate().toISOString();
  }
  return null;
}

export function mapArticleDoc(id: string, data: DocumentData): Article {
  return {
    id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    coverImagePath: data.coverImagePath || "",
    gallery: data.gallery || [],
    youtubeUrl: data.youtubeUrl || "",
    categoryId: data.categoryId,
    categorySlug: data.categorySlug,
    categoryName: data.categoryName,
    tagIds: data.tagIds || [],
    tagNames: data.tagNames || [],
    tagSlugs: data.tagSlugs || [],
    authorId: data.authorId,
    authorName: data.authorName,
    authorPhotoURL: data.authorPhotoURL || null,
    status: data.status,
    featured: !!data.featured,
    publishedAt: toIsoOrNull(data.publishedAt),
    scheduledAt: toIsoOrNull(data.scheduledAt),
    createdAt: toIsoOrNull(data.createdAt),
    updatedAt: toIsoOrNull(data.updatedAt),
    views: data.views || 0,
    likes: data.likes || 0,
    commentsCount: data.commentsCount || 0,
    readingTimeMinutes: data.readingTimeMinutes || 1,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    seoKeywords: data.seoKeywords || [],
  };
}

export function mapCategoryDoc(id: string, data: DocumentData): Category {
  return {
    id,
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    color: data.color || "",
    order: data.order ?? 0,
    createdAt: toIsoOrNull(data.createdAt),
  };
}

export function mapTagDoc(id: string, data: DocumentData): Tag {
  return {
    id,
    name: data.name,
    slug: data.slug,
    createdAt: toIsoOrNull(data.createdAt),
  };
}

export function mapCommentDoc(id: string, data: DocumentData): Comment {
  return {
    id,
    articleId: data.articleId,
    articleSlug: data.articleSlug,
    articleTitle: data.articleTitle,
    name: data.name,
    email: data.email,
    content: data.content,
    status: data.status,
    createdAt: toIsoOrNull(data.createdAt),
    parentId: data.parentId || null,
    likes: data.likes || 0,
  };
}

export function mapUserDoc(id: string, data: DocumentData): AppUser {
  return {
    uid: id,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL || null,
    role: data.role,
    createdAt: toIsoOrNull(data.createdAt),
    lastLoginAt: toIsoOrNull(data.lastLoginAt),
  };
}

export function mapMediaDoc(id: string, data: DocumentData): MediaItem {
  return {
    id,
    url: data.url,
    path: data.path,
    type: data.type,
    fileName: data.fileName,
    sizeBytes: data.sizeBytes || 0,
    width: data.width,
    height: data.height,
    uploadedBy: data.uploadedBy || "",
    createdAt: toIsoOrNull(data.createdAt),
  };
}
