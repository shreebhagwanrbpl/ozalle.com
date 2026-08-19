import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap() {
    const baseUrl = "https://ozalle.com";
    const urls = [];

    // 1. Static Core Pages
    urls.push(
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/items`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        }
    );

    try {
        // 2. Legitimate Districts
        const districtSnap = await getDocs(
            collection(db, "websites", "ozallecom", "districts")
        );

        const districts = districtSnap.docs.map((d) => d.data());

        districts.forEach((district) => {
            const slug = district.slug;
            if (!slug) return;

            urls.push({
                url: `${baseUrl}/${slug}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.8,
            });
        });

        // 3. Primary Products (Full Catalog)
        const products = await fetchFullCatalog();

        products.forEach((product) => {
            const productSlug = product.slug || product.productSlug;
            if (!productSlug) return;

            urls.push({
                url: `${baseUrl}/items/${productSlug}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.9,
            });
        });
    } catch (error) {
        console.error("Sitemap Error:", error);
    }

    return urls;
}