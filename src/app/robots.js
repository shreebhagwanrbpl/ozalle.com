export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/*?*", "/_next/", "/private/"],
        },
        sitemap: "https://ozalle.com/sitemap.xml",
    };
}