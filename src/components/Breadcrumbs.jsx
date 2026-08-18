import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const schemaItems = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `https://ozallecom.com${item.url}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1 transition-colors hover:text-cyan-700"
        >
          <Home size={14} />
          <span>Home</span>
        </Link>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-slate-400" />
            {idx === items.length - 1 ? (
              <span className="font-semibold text-slate-800 line-clamp-1">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="transition-colors hover:text-cyan-700"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
