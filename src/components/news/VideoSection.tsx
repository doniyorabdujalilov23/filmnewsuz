import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Play } from "lucide-react";
import { getArticlesWithVideo } from "@/lib/data/articles";
import { formatRelativeTime } from "@/lib/utils/format";

export async function VideoSection({ count = 4 }: { count?: number }) {
  const articles = await getArticlesWithVideo(count);
  if (!articles.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Videolar</h2>
        <Link
          href="/kategoriya/treylerlar"
          className="flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover"
        >
          Barchasini ko'rish <ChevronRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/yangilik/${article.slug}`} className="group flex flex-col">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-line dark:bg-line-dark">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/30 transition group-hover:bg-ink/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/90 text-white shadow-lg transition group-hover:scale-110">
                  <Play size={18} className="ml-0.5 fill-current" />
                </span>
              </div>
            </div>
            <span className="eyebrow mt-3">{article.categoryName}</span>
            <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug transition group-hover:text-accent">
              {article.title}
            </h3>
            <span className="mt-1.5 font-mono text-[11px] text-muted">
              {formatRelativeTime(article.publishedAt)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
