import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL(
    "https://ozalle.com"
  ),

  title:
    "Biomedical Equipment Supplier in India | Central Biomedicals",

  description:
    "Central Biomedicals supplies CBC Machines, Hematology Analyzers, Biochemistry Analyzers, ELISA Readers and laboratory equipment across India.",

  keywords: [
    "Biomedical Equipment Supplier",
    "Laboratory Equipment Supplier",
    "CBC Machine Supplier",
    "Hematology Analyzer Supplier",
    "Biochemistry Analyzer Supplier",
    "Diagnostic Equipment Supplier",
    "Medical Equipment Supplier India",
  ],

  openGraph: {
    title:
      "Biomedical Equipment Supplier in India | Central Biomedicals",

    description:
      "Supplier of biomedical and laboratory equipment across India.",

    url: "https://ozalle.com",

    siteName: "Central Biomedicals",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Central Biomedicals",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Biomedical Equipment Supplier in India | Central Biomedicals",

    description:
      "Supplier of biomedical and laboratory equipment across India.",

    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://ozalle.com",
  },
};

export default function RootLayout({
  children,
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Raj Biosis Private Limited",
    alternateName: "Central Biomedicals",
    url: "https://ozalle.com",
    logo: "https://ozalle.com/logo.png",
    description: "Leading biomedical, laboratory, diagnostic, and pathology equipment supplier, dealer, and distributor in India.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9829000000",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [],
  };

  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Navbar />

        <main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />

          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}