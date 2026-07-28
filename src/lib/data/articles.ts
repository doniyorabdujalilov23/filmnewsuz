import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Article, PaginatedResult } from "@/types";
import { ARTICLES_PER_PAGE, RELATED_ARTICLES_COUNT } from "@/lib/constants";
import { mapArticleDoc, toIsoOrNull } from "@/lib/data/mappers";

const ARTICLES_COLLECTION = "news";

export async function getPublishedArticles(options?: {
  categorySlug?: string;
  tagSlug?: string;
  pageSize?: number;
  cursor?: string;
}): Promise<PaginatedResult<Article>> {
  const pageSize = options?.pageSize ?? ARTICLES_PER_PAGE;
  const constraints = [where("status", "==", "published")];

  if (options?.categorySlug) {
    constraints.push(where("categorySlug", "==", options.categorySlug));
  }
  if (options?.tagSlug) {
    constraints.push(where("tagSlugs", "array-contains", options.tagSlug));
  }

  let q = query(
    collection(db, ARTICLES_COLLECTION),
    ...constraints,
    orderBy("publishedAt", "desc"),
    limit(pageSize + 1)
  );

  if (options?.cursor) {
    const cursorDoc = await getDoc(doc(db, ARTICLES_COLLECTION, options.cursor));
    if (cursorDoc.exists()) {
      q = query(
        collection(db, ARTICLES_COLLECTION),
        ...constraints,
        orderBy("publishedAt", "desc"),
        startAfter(cursorDoc),
        limit(pageSize + 1)
      );
    }
  }

  const snap = await getDocs(q);
  const docs = snap.docs.slice(0, pageSize);
  const items = docs.map((d) => mapArticleDoc(d.id, d.data()));
  const hasMore = snap.docs.length > pageSize;
  const lastCursor = docs.length ? docs[docs.length - 1]!.id : null;

  return { items, lastCursor, hasMore };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return mapArticleDoc(d.id, d.data());
}

export async function getArticleBySlugAnyStatus(slug: string): Promise<Article | null> {
  const q = query(collection(db, ARTICLES_COLLECTION), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return mapArticleDoc(d.id, d.data());
}

export async function getFeaturedArticles(count: number): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("featured", "==", true),
    orderBy("publishedAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapArticleDoc(d.id, d.data()));
}

export async function getPopularArticles(count: number): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("views", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapArticleDoc(d.id, d.data()));
}

export async function getRelatedArticles(article: Article): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("categorySlug", "==", article.categorySlug),
    orderBy("publishedAt", "desc"),
    limit(RELATED_ARTICLES_COUNT + 1)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => mapArticleDoc(d.id, d.data()))
    .filter((item) => item.id !== article.id)
    .slice(0, RELATED_ARTICLES_COUNT);
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; updatedAt: string | null }[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(5000)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    slug: d.data().slug as string,
    updatedAt: toIsoOrNull(d.data().updatedAt),
  }));
}

export async function getArticlesWithVideo(count = 4): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(80)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => mapArticleDoc(d.id, d.data()))
    .filter((article) => !!article.youtubeUrl)
    .slice(0, count);
}

export async function searchArticles(searchTerm: string, count = 20): Promise<Article[]> {
  const normalized = searchTerm.trim().toLowerCase();
  if (!normalized) return [];

  // Firestore has no native full-text search; we fetch recent published articles
  // and filter client-side across title, excerpt, content and tags.
  // For production-grade full-text search, connect Algolia or Typesense here.
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(300)
  );
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => mapArticleDoc(d.id, d.data()));

  return all
    .filter((a) => {
      const haystack = [a.title, a.excerpt, a.content, ...(a.tagNames || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .slice(0, count);
}
