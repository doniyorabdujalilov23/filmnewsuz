import type { Metadata } from "next";
import {
  getFeaturedArticles,
  getPopularArticles,
  getPublishedArticles,
} from "@/lib/data/articles";
import { getCategories } from "@/lib/data/taxonomy";
import { getSiteSettings } from "@/lib/data/settings";
import { FeaturedSlider } from "@/components/news/FeaturedSlider";
import { CategoryStrip } from "@/components/news/CategoryStrip";
import { PopularList } from "@/components/news/PopularList";
import { CategorySection } from "@/components/news/CategorySection";
import { VideoSection } from "@/components/news/VideoSection";
import { NewsCard } from "@/components/news/NewsCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { SITE_CONFIG, FEATURED_SLIDER_COUNT, POPULAR_ARTICLES_COUNT } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Kino, serial va multfilmlar dunyosi`,
  description: SITE_CONFIG.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, popular, latest, categories, settings] = await Promise.all([
    getFeaturedArticles(FEATURED_SLIDER_COUNT),
    getPopularArticles(POPULAR_ARTICLES_COUNT),
    getPublishedArticles({ pageSize: 4 }),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="container-page py-6">
      <section className="mb-8">
        <FeaturedSlider articles={featured.length ? featured : latest.items.slice(0, 5)} />
      </section>

      <section className="mb-8">
        <CategoryStrip categories={categories} />
      </section>

      <AdSlot code={settings.adSlots.headerCode} label="Reklama" className="mb-10" />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {/* So'nggi yangiliklar — 4 ta kattaroq rasmli sarlavha */}
          <section className="mb-12">
            <h2 className="mb-5 font-display text-2xl font-bold">So'nggi yangiliklar</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {latest.items.map((article, idx) => (
                <NewsCard key={article.id} article={article} variant="large" priority={idx === 0} />
              ))}
            </div>
          </section>

          <VideoSection count={4} />

          <AdSlot code={settings.adSlots.inArticleCode} label="Reklama" className="mb-12" />

          <CategorySection categorySlug="kinolar" title="Kinolar" count={4} />
          <CategorySection categorySlug="seriallar" title="Seriallar" count={4} />

          <AdSlot code={settings.adSlots.inArticleCode} label="Reklama" className="mb-12" />

          <CategorySection categorySlug="multfilmlar" title="Multfilmlar" count={4} />
          <CategorySection categorySlug="anime" title="Anime" count={4} />
          <CategorySection categorySlug="retsenziyalar" title="Retsenziyalar" count={4} />
        </div>

        <aside className="space-y-8">
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
          <PopularList articles={popular} />
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
        </aside>
      </div>

      <AdSlot code={settings.adSlots.footerCode} label="Reklama" className="mt-4" />
    </div>
  );
}
