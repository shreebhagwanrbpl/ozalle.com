import ProductDetails from "../../../items/[slug]/ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export async function generateMetadata({ params }) {
  const { slug, district } = await params;

  const cityName = district
    ? district
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "India";

  let product = null;
  try {
    const catalog = await fetchFullCatalog();
    product = catalog.find(
      (p) => p.slug === slug || (p.title && p.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") === slug)
    );
  } catch (err) {
    console.error("District metadata error:", err);
  }

  const rawName = slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const productName = product?.title || rawName || "Biomedical Equipment";
  const brand = product?.brand ? ` (${product.brand})` : "";

  const title = `${productName}${brand} Supplier in ${cityName} | Central Biomedicals`;
  const description =
    product?.desc ||
    product?.description ||
    `Leading supplier, dealer and distributor of ${productName} in ${cityName}. Contact Central Biomedicals for quick pricing, installation, and laboratory support.`;

  const url = `https://ozallecom.com/${district}/items/${slug}`;
  const imageUrl = product?.images?.[0] || product?.image || "https://ozallecom.com/logo.png";

  return {
    title,
    description,
    keywords: [
      `${productName} in ${cityName}`,
      `${productName} Supplier ${cityName}`,
      `${productName} Dealer ${cityName}`,
      `${productName} Price ${cityName}`,
      `Laboratory Equipment ${cityName}`,
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
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${productName} in ${cityName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    metadataBase: new URL("https://ozallecom.com"),
  };
}

export default async function Page({ params }) {
  const { slug, district } = await params;

  return (
    <ProductDetails
      slug={slug}
      district={district}
    />
  );
}