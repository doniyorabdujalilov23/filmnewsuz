import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPublishedArticles } from "@/lib/data/articles";
import { getCategoryBySlug } from "@/lib/data/taxonomy";
import { NewsCard } from "@/components/news/NewsCard";

interface CategorySectionProps {
  categorySlug: string;
  title?: string;
  count?: number;
}

export async function CategorySection({ categorySlug, title, count = 4 }: CategorySectionProps) {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const { items } = await getPublishedArticles({ categorySlug, pageSize: count });
  if (!items.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{title || category.name}</h2>
        <Link
          href={`/kategoriya/${category.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover"
        >
          Barchasini ko'rish <ChevronRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
