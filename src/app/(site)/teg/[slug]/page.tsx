import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagBySlug } from "@/lib/data/taxonomy";
import { getPublishedArticles, getPopularArticles } from "@/lib/data/articles";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InfiniteArticleGrid } from "@/components/news/InfiniteArticleGrid";
import { PopularList } from "@/components/news/PopularList";
import { AdSlot } from "@/components/ads/AdSlot";
import { POPULAR_ARTICLES_COUNT } from "@/lib/constants";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return {
    title: `#${tag.name} tegi bo'yicha yangiliklar`,
    alternates: { canonical: `/teg/${tag.slug}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const [articles, popular, settings] = await Promise.all([
    getPublishedArticles({ tagSlug: slug, pageSize: 12 }),
    getPopularArticles(POPULAR_ARTICLES_COUNT),
    getSiteSettings(),
  ]);

  return (
    <div className="container-page py-6">
      <Breadcrumb items={[{ label: `#${tag.name}` }]} />
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">#{tag.name}</h1>

      <AdSlot code={settings.adSlots.headerCode} label="Reklama" className="mt-6" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <InfiniteArticleGrid
          initialArticles={articles.items}
          initialCursor={articles.lastCursor}
          initialHasMore={articles.hasMore}
          tagSlug={slug}
        />

        <aside className="space-y-8">
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
          <PopularList articles={popular} />
        </aside>
      </div>
    </div>
  );
}
