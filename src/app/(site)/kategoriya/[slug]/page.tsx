import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/data/taxonomy";
import { getPublishedArticles, getPopularArticles } from "@/lib/data/articles";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InfiniteArticleGrid } from "@/components/news/InfiniteArticleGrid";
import { PopularList } from "@/components/news/PopularList";
import { AdSlot } from "@/components/ads/AdSlot";
import { SITE_CONFIG, POPULAR_ARTICLES_COUNT } from "@/lib/constants";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category.name} yangiliklari`;
  const description =
    category.description ||
    `${category.name} bo'yicha eng so'nggi va tezkor yangiliklar — ${SITE_CONFIG.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/kategoriya/${category.slug}` },
    openGraph: { title, description, url: `${SITE_CONFIG.url}/kategoriya/${category.slug}` },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [articles, popular, settings] = await Promise.all([
    getPublishedArticles({ categorySlug: slug, pageSize: 12 }),
    getPopularArticles(POPULAR_ARTICLES_COUNT),
    getSiteSettings(),
  ]);

  return (
    <div className="container-page py-6">
      <Breadcrumb items={[{ label: category.name }]} />
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{category.name}</h1>
      {category.description && <p className="mt-2 max-w-2xl text-muted">{category.description}</p>}

      <AdSlot code={settings.adSlots.headerCode} label="Reklama" className="mt-6" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <InfiniteArticleGrid
          initialArticles={articles.items}
          initialCursor={articles.lastCursor}
          initialHasMore={articles.hasMore}
          categorySlug={slug}
        />

        <aside className="space-y-8">
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
          <PopularList articles={popular} />
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
        </aside>
      </div>
    </div>
  );
}
