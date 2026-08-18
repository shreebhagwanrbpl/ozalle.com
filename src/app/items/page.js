// import { fetchFullCatalog } from "@/lib/data-fetcher-server";
// import ProductsClient from "./ProductsClient";

// export const revalidate = 3600; // Revalidate cache every hour

// export async function generateMetadata() {
//   const title = "Biomedical Equipment & Lab Supply Catalog | Central Biomedicals";
//   const description =
//     "Explore our complete catalog of biomedical equipment, hematology analyzers, biochemistry analyzers, electrolyte reagents, ELISA readers, and diagnostic test kits supplied across India.";
//   const url = "https://ozallecom.com/items";

//   return {
//     title,
//     description,
//     keywords: [
//       "Biomedical Equipment Catalog",
//       "Laboratory Equipment Supplier",
//       "Medical Analyzers India",
//       "Hematology Analyzer",
//       "Biochemistry Analyzer",
//       "Electrolyte Reagents",
//       "Rapid Test Kits",
//       "Diagnostic Equipment Distributor",
//       "Central Biomedicals Catalog",
//     ],
//     alternates: {
//       canonical: url,
//     },
//     openGraph: {
//       title,
//       description,
//       url,
//       siteName: "Central Biomedicals",
//       locale: "en_IN",
//       type: "website",
//       images: [
//         {
//           url: "https://ozallecom.com/logo.png",
//           width: 1200,
//           height: 630,
//           alt: "Central Biomedicals Product Catalog",
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: ["https://ozallecom.com/logo.png"],
//     },
//     robots: {
//       index: true,
//       follow: true,
//       googleBot: {
//         index: true,
//         follow: true,
//         "max-image-preview": "large",
//         "max-snippet": -1,
//       },
//     },
//   };
// }

// export default async function ProductsPage({ district = null, city = null }) {
//   // Fetch full catalog from server cache
//   const allProducts = await fetchFullCatalog();

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Central Biomedicals Product Catalog",
//     description:
//       "Catalog of biomedical and laboratory equipment, analyzers, and reagents supplied across India.",
//     url: "https://ozallecom.com/items",
//     numberOfItems: allProducts?.length || 0,
//     itemListElement: (allProducts || []).slice(0, 30).map((product, index) => ({
//       "@type": "ListItem",
//       position: index + 1,
//       name: product.title || product.name || "Biomedical Equipment",
//       url: `https://ozallecom.com/items/${product.slug}`,
//     })),
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
//       <ProductsClient
//         initialProducts={allProducts}
//         district={district}
//         city={city}
//       />
//     </>
//   );
// }




import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "./ProductsClient";

export const revalidate = 3600;

export async function generateMetadata() {
  const title =
    "Biomedical & Laboratory Equipment | Central Biomedicals";

  const description =
    "Explore biomedical, diagnostic, laboratory and hospital equipment from Central Biomedicals. Browse quality medical equipment, analyzers and laboratory instruments across India.";

  return {
    title,
    description,

    alternates: {
      canonical: "https://ozalle.com/items",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title,
      description,
      url: "https://ozalle.com/items",
      siteName: "Central Biomedicals",
      type: "website",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductsPage({
  district = null,
  city = null,
}) {
  const allProducts = await fetchFullCatalog();

  return (
    <ProductsClient
      initialProducts={allProducts}
      district={district}
      city={city}
    />
  );
}