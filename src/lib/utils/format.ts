import { format, formatDistanceToNow, isValid } from "date-fns";
import { uz } from "date-fns/locale";
import type { Timestamp } from "firebase/firestore";
import type { DateLike } from "@/types";

/**
 * Har qanday sana ko'rinishini (ISO-string, Date, yoki xavfsizlik uchun xom Firestore
 * Timestamp) native Date obyektiga aylantiradi. Component'lar doim shu funksiya orqali
 * sanani o'qishi kerak — DateLike (string | Date | null) Client Component'ga xavfsiz
 * uzatiladigan yagona ko'rinish hisoblanadi.
 */
export function toDate(value: DateLike | Timestamp | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return isValid(parsed) ? parsed : null;
  }
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate();
  }
  return null;
}

export function formatDate(value: DateLike | Timestamp | undefined): string {
  const date = toDate(value);
  if (!date || !isValid(date)) return "";
  return format(date, "d-MMMM, yyyy", { locale: uz });
}

export function formatDateTime(value: DateLike | Timestamp | undefined): string {
  const date = toDate(value);
  if (!date || !isValid(date)) return "";
  return format(date, "d-MMMM, yyyy HH:mm", { locale: uz });
}

export function formatRelativeTime(value: DateLike | Timestamp | undefined): string {
  const date = toDate(value);
  if (!date || !isValid(date)) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: uz });
}

export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function isYoutubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
