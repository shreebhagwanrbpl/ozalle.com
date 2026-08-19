import ProductDetails from "./ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    const catalog = await fetchFullCatalog();
    product = catalog.find(
      (p) => p.slug === slug || (p.title && p.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") === slug)
    );
  } catch (err) {
    console.error("Metadata fetch product error:", err);
  }

  const rawName = slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const productName = product?.title || rawName || "Biomedical Equipment";
  const category = product?.category || "Biomedical Equipment";
  const brand = product?.brand ? ` by ${product.brand}` : "";

  const title = `${productName}${brand} Supplier in India | Price, Dealer & Distributor | Central Biomedicals`;
  const description =
    product?.desc ||
    product?.description ||
    `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, laboratories, diagnostic centers, research institutes and healthcare facilities. Contact Central Biomedicals for quotation.`;

  const url = `https://ozalle.com/items/${slug}`;
  const imageUrl = product?.images?.[0] || product?.image || "https://ozalle.com/logo.png";

  return {
    title,
    description,
    keywords: [
      productName,
      `${productName} Supplier`,
      `${productName} Dealer`,
      `${productName} Distributor`,
      `${productName} Manufacturer`,
      `${productName} Exporter`,
      `${productName} Price`,
      `${productName} Price in India`,
      `${productName} Supplier in India`,
      `${productName} Dealer in India`,
      `${productName} Distributor in India`,
      `Buy ${productName}`,
      `${productName} for Laboratory`,
      `${productName} for Hospital`,
      `${productName} for Diagnostic Center`,
      category,
      "Biomedical Equipment Supplier",
      "Central Biomedicals",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Central Biomedicals",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: new URL("https://ozalle.com"),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    const catalog = await fetchFullCatalog();
    product = catalog.find(
      (p) => p.slug === slug || (p.title && p.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") === slug)
    );
  } catch (err) {
    console.error("Page fetch product error:", err);
  }

  const rawName = slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const productName = product?.title || rawName || "Biomedical Equipment";
  const description =
    product?.desc ||
    product?.description ||
    `High precision biomedical equipment ${productName} supplied across India by Central Biomedicals.`;
  const imageUrl = product?.images?.[0] || product?.image || "https://ozalle.com/logo.png";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: [imageUrl],
    description: description,
    sku: product?.uid || slug,
    brand: {
      "@type": "Brand",
      name: product?.brand || "Central Biomedicals",
    },
    offers: {
      "@type": "Offer",
      url: `https://ozalle.com/items/${slug}`,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Central Biomedicals",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ozalle.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Items",
        item: "https://ozalle.com/items",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
        item: `https://ozalle.com/items/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetails slug={slug} />
    </>
  );
}