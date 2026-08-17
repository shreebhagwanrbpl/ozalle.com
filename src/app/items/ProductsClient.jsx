// "use client";

// import React, { useEffect, useMemo, useState, useCallback, memo, Profiler } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   ShieldCheck,
//   Truck,
//   BadgeCheck,
//   PackageCheck,
//   Search,
//   ChevronRight,
//   ChevronUp,
// } from "lucide-react";
// import { Toaster, toast } from "react-hot-toast";
// import PageBanner from "@/components/PageBanner";
// import SectionTitle from "@/components/SectionTitle";
// // import CTASection from "@/components/CTASection";
// import ProductCard from "@/components/ProductCard";

// // 1. Memoized Product Link Component
// const ProductLink = memo(function ProductLink({ item, category, scrollToProduct }) {
//   return (
//     <button
//       onClick={() => scrollToProduct(item.slug, category)}
//       className="block w-full text-left py-1 text-sm text-slate-500 hover:text-blue-700 hover:translate-x-1 transition-all duration-200 font-medium"
//     >
//       • {item.title}
//     </button>
//   );
// });

// // 2. Memoized Subcategory Component (renders product list only when expanded)
// const SubCategoryItem = memo(function SubCategoryItem({
//   category,
//   subCategory,
//   subList,
//   isSubOpened,
//   toggleSubCategory,
//   scrollToProduct,
// }) {
//   return (
//     <div className="space-y-2 pl-2">
//       {/* Subcategory Header */}
//       <button
//         onClick={() => toggleSubCategory(category, subCategory)}
//         className="w-full text-left py-1.5 flex justify-between items-center text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors uppercase tracking-wider border-b border-slate-100 pb-1"
//       >
//         <span className="flex items-center gap-1.5">
//           <span className={`transition-transform duration-200 ${isSubOpened ? "rotate-90" : ""}`}>
//             <ChevronRight size={12} className="text-blue-700" />
//           </span>
//           {subCategory}
//         </span>
//         <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
//           {subList.length}
//         </span>
//       </button>

//       {/* Product List Wrapper */}
//       <div
//         className={`transition-all duration-300 ease-in-out pl-3 overflow-hidden ${isSubOpened
//           ? "max-h-48 opacity-100 mt-1 mb-2"
//           : "max-h-0 opacity-0"
//           }`}
//       >
//         {isSubOpened && (
//           <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
//             {subList.map((item) => (
//               <ProductLink
//                 key={item.uid}
//                 item={item}
//                 category={category}
//                 scrollToProduct={scrollToProduct}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// // 3. Memoized Category Component (renders subcategories only when expanded)
// const CategoryItem = memo(function CategoryItem({
//   category,
//   isOpened,
//   isActive,
//   subcategories,
//   categoryProductCount,
//   toggleCategory,
//   toggleSubCategory,
//   openedSubCategories,
//   scrollToProduct,
// }) {
//   return (
//     <div className="group">
//       <button
//         onClick={() => toggleCategory(category)}
//         className={`sticky top-[116px] z-10 w-full px-4 py-3 flex justify-between items-center rounded-2xl transition-all duration-200 text-left ${isActive
//           ? "bg-blue-50 text-blue-700 font-bold"
//           : "bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-700"
//           }`}
//       >
//         <span className="flex items-center gap-3 text-sm font-semibold leading-none">
//           <span className={`transition-transform duration-200 ${isOpened ? "rotate-90" : ""}`}>
//             <ChevronRight size={16} className={isActive ? "text-blue-700" : "text-slate-400 group-hover:text-blue-700"} />
//           </span>
//           {category}
//         </span>
//         <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"
//           }`}>
//           {categoryProductCount}
//         </span>
//       </button>

//       {/* Subcategories Wrapper */}
//       <div
//         className={`transition-all duration-300 ease-in-out pl-4 overflow-hidden ${isOpened
//           ? "max-h-[1000px] opacity-100 mt-2 mb-4"
//           : "max-h-0 opacity-0"
//           }`}
//       >
//         {isOpened && (
//           <div className="space-y-3 pt-1">
//             {Object.entries(subcategories || {}).map(([subCategory, subList]) => {
//               const subKey = `${category}-${subCategory}`;
//               const isSubOpened = !!openedSubCategories[subKey];

//               return (
//                 <SubCategoryItem
//                   key={subKey}
//                   category={category}
//                   subCategory={subCategory}
//                   subList={subList}
//                   isSubOpened={isSubOpened}
//                   toggleSubCategory={toggleSubCategory}
//                   scrollToProduct={scrollToProduct}
//                 />
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// export default function ProductsClient({ initialProducts = [], district = null, city = null }) {
//   const [categorySearch, setCategorySearch] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [openedCategory, setOpenedCategory] = useState("");
//   const [activeCategory, setActiveCategory] = useState("");
//   const [openedSubCategories, setOpenedSubCategories] = useState({});
//   const [pendingScroll, setPendingScroll] = useState(null);
//   const [showTopButton, setShowTopButton] = useState(false);

//   // Debounce search term updates to make search typing instant
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setProductSearch(searchInput);
//     }, 200);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   // Combined single-pass product filtering, grouping, category count, and sorting for maximum performance
//   const { filteredProducts, sortedGroupedProducts, categoryCounts } = useMemo(() => {
//     const start = performance.now();
//     const query = productSearch.trim().toLowerCase();
//     const filtered = query
//       ? initialProducts.filter((item) => {
//         const title = (item.title || "").toLowerCase();
//         const brand = (item.brand || "").toLowerCase();
//         const model = (item.model || "").toLowerCase();
//         const category = (item.category || "").toLowerCase();
//         const subCategory = (item.subCategory || "").toLowerCase();

//         return (
//           title.includes(query) ||
//           brand.includes(query) ||
//           model.includes(query) ||
//           category.includes(query) ||
//           subCategory.includes(query)
//         );
//       })
//       : initialProducts;

//     const grouped = {};
//     const counts = {};

//     filtered.forEach((item) => {
//       const cat = item.category || "Other Products";
//       const sub = item.subCategory || cat;

//       if (!grouped[cat]) {
//         grouped[cat] = {};
//         counts[cat] = 0;
//       }
//       if (!grouped[cat][sub]) {
//         grouped[cat][sub] = [];
//       }

//       grouped[cat][sub].push(item);
//       counts[cat]++;
//     });

//     const entries = Object.entries(grouped);
//     entries.sort(([a], [b]) => {
//       if (a === "Other Products") return 1;
//       if (b === "Other Products") return -1;
//       return a.localeCompare(b);
//     });

//     const sortedObj = {};
//     for (const [cat, subObj] of entries) {
//       const subEntries = Object.entries(subObj);
//       subEntries.sort(([a], [b]) => {
//         if (a === cat) return -1;
//         if (b === cat) return 1;
//         return a.localeCompare(b);
//       });
//       sortedObj[cat] = Object.fromEntries(subEntries);
//     }

//     const end = performance.now();
//     console.log(`[ProductsClient] Grouping, filtering, and sorting completed in ${(end - start).toFixed(2)}ms`);

//     return {
//       filteredProducts: filtered,
//       sortedGroupedProducts: sortedObj,
//       categoryCounts: counts,
//     };
//   }, [initialProducts, productSearch]);

//   const getCategoryProductCount = useCallback((categoryName) => {
//     return categoryCounts[categoryName] || 0;
//   }, [categoryCounts]);

//   const toggleCategory = useCallback((category) => {
//     setOpenedCategory((prev) => (prev === category ? "" : category));
//   }, []);

//   const toggleSubCategory = useCallback((category, subCategory) => {
//     const key = `${category}-${subCategory}`;
//     setOpenedSubCategories((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   }, []);

//   const scrollToProduct = useCallback((slug, category) => {
//     setOpenedCategory(category);
//     setActiveCategory(category);
//     setPendingScroll(slug);

//     // Auto-expand the target subcategory when scrolling to its product
//     const prod = initialProducts.find((p) => p.slug === slug);
//     if (prod && prod.subCategory) {
//       const subKey = `${category}-${prod.subCategory}`;
//       setOpenedSubCategories((prev) => ({
//         ...prev,
//         [subKey]: true,
//       }));
//     }
//   }, [initialProducts]);

//   // Scroll to selected sidebar item when category expansion finishes
//   useEffect(() => {
//     if (!pendingScroll) return;

//     const timer = setTimeout(() => {
//       const el = document.getElementById(pendingScroll);
//       if (el) {
//         el.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//       setPendingScroll(null);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [openedCategory, pendingScroll]);

//   // Scroll back to top visibility
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowTopButton(window.scrollY > 500);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // Measure hydration completion time
//   useEffect(() => {
//     if (typeof window !== "undefined" && window.performance) {
//       const navigationStart = window.performance.timing?.navigationStart || 0;
//       if (navigationStart) {
//         const timeSinceNavigation = Date.now() - navigationStart;
//         console.log(`[ProductsClient] Hydration completed in ${timeSinceNavigation}ms since navigation start`);
//       }
//     }
//   }, []);

//   const onRenderCallback = (id, phase, actualDuration) => {
//     console.log(`[React Profiler] ${id} render time (${phase}): ${actualDuration.toFixed(2)}ms`);
//   };

//   return (
//     <Profiler id="ProductsLayout" onRender={onRenderCallback}>
//       {/* Banner */}
//       <PageBanner
//         title={city ? `Our Products in ${city}` : "Our Products"}
//         subtitle="Explore advanced biomedical and diagnostic equipment designed for modern healthcare excellence."
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "MedicalEquipmentSupplier",
//             name: "Raj Biosis",
//             url: "https://ozalle.com",
//             areaServed: city,
//             description: `Medical laboratory and hospital equipment in ${city}`,
//             address: {
//               "@type": "PostalAddress",
//               addressLocality: city,
//               addressCountry: "India",
//             },
//           }),
//         }}
//       />

//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             borderRadius: "14px",
//             padding: "14px 18px",
//             fontSize: "15px",
//             fontWeight: "600",
//           },
//         }}
//       />

//       {/* Products */}
//       <section className="section-padding bg-white">
//         <div className="container-custom">
//           <SectionTitle
//             badge="Featured Products"
//             title="Premium Biomedical Equipment"
//             description="Discover high-quality diagnostic and biomedical technologies tailored for laboratories, healthcare institutions, and modern diagnostics."
//             center
//           />
//         </div>

//         {/* Search */}
//         <div className="max-w-2xl mx-auto mt-6 lg:mt-10 px-4 lg:px-0 relative">
//           <Search
//             size={22}
//             className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
//           />

//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             className="w-full h-16 pl-14 pr-5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-10 mt-8 lg:mt-16 items-start px-4 lg:px-0">
//           {/* Main Sidebar (Only scrollable container for the sidebar) */}
//           <aside className="lg:sticky lg:top-24 self-start rounded-[32px] border border-slate-200 bg-white shadow-xl px-6 pb-6 pt-0 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar relative">
//             {/* Sticky Header Section */}
//             <div className="sticky top-0 -mx-6 pt-6 px-6 pb-3 bg-white z-20 border-b border-slate-100 mb-4 h-[116px]">
//               <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center justify-between">
//                 <span>Categories</span>
//                 <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
//                   {Object.keys(sortedGroupedProducts).length}
//                 </span>
//               </h3>

//               {/* Sticky Category Search Box */}
//               <div className="relative">
//                 <Search
//                   size={16}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search categories..."
//                   value={categorySearch}
//                   onChange={(e) => setCategorySearch(e.target.value)}
//                   className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               {Object.keys(sortedGroupedProducts)
//                 .filter((category) =>
//                   category.toLowerCase().includes(categorySearch.toLowerCase())
//                 )
//                 .map((category) => {
//                   const isOpened = openedCategory === category;
//                   const isActive = activeCategory === category;
//                   const subcategories = sortedGroupedProducts[category] || {};
//                   const count = getCategoryProductCount(category);

//                   return (
//                     <CategoryItem
//                       key={category}
//                       category={category}
//                       isOpened={isOpened}
//                       isActive={isActive}
//                       subcategories={subcategories}
//                       categoryProductCount={count}
//                       toggleCategory={toggleCategory}
//                       toggleSubCategory={toggleSubCategory}
//                       openedSubCategories={openedSubCategories}
//                       scrollToProduct={scrollToProduct}
//                     />
//                   );
//                 })}
//             </div>
//           </aside>

//           {/* RIGHT SIDE START */}
//           <div className="space-y-16">
//             {filteredProducts.length === 0 ? (
//               <div className="bg-white border border-slate-200 rounded-[32px] p-10 lg:p-16 text-center shadow-lg">
//                 <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-5xl mb-6">
//                   🔍
//                 </div>

//                 <h2 className="text-2xl lg:text-4xl font-bold text-slate-900">
//                   Product Not Found
//                 </h2>

//                 <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-7">
//                   {"We couldn't find any products matching"}
//                   <span className="font-semibold text-blue-700">
//                     {" \"" + productSearch + "\" "}
//                   </span>
//                   . Please try another keyword or browse categories.
//                 </p>

//                 <button
//                   onClick={() => {
//                     setSearchInput("");
//                     setProductSearch("");
//                   }}
//                   className="mt-8 px-8 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
//                 >
//                   View All Products
//                 </button>
//               </div>
//             ) : (
//               Object.entries(sortedGroupedProducts).map(
//                 ([category, subcategoriesObj]) => (
//                   <section
//                     key={category}
//                     id={category.replace(/\s+/g, "-").toLowerCase()}
//                   >
//                     {/* Category Header */}
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4 lg:pb-5 mb-8">
//                       <h2 className="text-3xl font-bold text-slate-900">
//                         {category}
//                       </h2>
//                       <span className="text-slate-500 font-medium">
//                         {Object.values(subcategoriesObj).reduce(
//                           (sum, list) => sum + list.length,
//                           0
//                         )}{" "}
//                         Products
//                       </span>
//                     </div>

//                     {/* Subcategories */}
//                     <div className="space-y-12">
//                       {Object.entries(subcategoriesObj).map(
//                         (([subCategory, list]) => (
//                           <div key={subCategory} className="space-y-6">
//                             {/* Subcategory Heading */}
//                             <div className="flex items-center gap-3">
//                               <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
//                                 {subCategory}
//                               </h3>
//                               <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
//                                 {list.length}{" "}
//                                 {list.length === 1 ? "Product" : "Products"}
//                               </span>
//                             </div>

//                             {/* Product List */}
//                             <div className="space-y-8">
//                               {list.slice(0, 12).map((product) => (
//                                 <ProductCard
//                                   key={product.uid}
//                                   product={product}
//                                   district={district}
//                                 />
//                               ))}
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </section>
//                 )
//               )
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Products */}
//       <section className="section-padding bg-slate-50">
//         <div className="container-custom">
//           <SectionTitle
//             badge="Why Our Products"
//             title="Trusted Quality & Innovation"
//             description="We provide biomedical products designed for performance, reliability, and healthcare excellence."
//             center
//           />

//           <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">
//             {[
//               {
//                 icon: <ShieldCheck size={30} />,
//                 title: "Certified Quality",
//               },
//               {
//                 icon: <Truck size={30} />,
//                 title: "Fast Delivery",
//               },
//               {
//                 icon: <BadgeCheck size={30} />,
//                 title: "Trusted Support",
//               },
//               {
//                 icon: <PackageCheck size={30} />,
//                 title: "Premium Equipment",
//               },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-[30px] border border-slate-100 card-shadow text-center p-8"
//               >
//                 <div className="w-16 h-16 mx-auto rounded-[22px] bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
//                   {item.icon}
//                 </div>

//                 <h3 className="text-xl font-semibold">{item.title}</h3>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       {/* <CTASection /> */}

//       {/* Back To Top */}
//       {showTopButton && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-blue-700 text-white shadow-2xl hover:scale-110 transition flex items-center justify-center"
//         >
//           <ChevronUp size={24} />
//         </button>
//       )}
//     </Profiler>
//   );
// }



"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { usePathname } from "next/navigation";

import {
  FaPlay,
  FaShareAlt,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLink,
} from "react-icons/fa";

import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import { Download } from "lucide-react";
const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
export default function ProductDetails({ slug }) {
  const [product, setProduct] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState("image");
  const [showShare, setShowShare] = useState(false);

  const shareRef = useRef();
  const brochureRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [submitting, setSubmitting] =
    useState(false);
  const [downloading, setDownloading] = useState(false);
  const [brochureImage, setBrochureImage] = useState("");
  const [contactData, setContactData] = useState({
    phone: "+91 9983123469\n+91 9983333489",
    email: "rajbiosis@yahoo.in",
    address: "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021"
  });

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const city =
    pathParts.length > 1 && !["about", "services", "items", "contact"].includes(pathParts[0])
      ? pathParts[0]
      : "India";

  const cityName =
    city.charAt(0).toUpperCase() +
    city.slice(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const allProducts = await fetchFullCatalog();
        const found = allProducts.find(
          (p) => p.slug === slug
        );
        setProduct(found || null);

        if (found) {
          if (found.images?.length > 0) {
            setSelectedImage(found.images[0]);
          } else {
            setSelectedImage(found.image || "");
          }
          setSelectedMedia("image");
        }
      } catch (error) {
        console.error("Error loading product catalog:", error);
      }
    };

    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "ozallecom", "pages", "contact")
        );
        if (snap.exists()) {
          const info = snap.data().contactInfo || [];
          const phoneVal = info.find(x => x.label === "Phone Number")?.value || "";
          const emailVal = info.find(x => x.label === "Email Address")?.value || "";
          const addressVal = info.find(x => x.label === "Office Address")?.value || "";
          setContactData({
            phone: phoneVal || "+91 9983123469\n+91 9983333489",
            email: emailVal || "rajbiosis@yahoo.in",
            address: addressVal || "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021"
          });
        }
      } catch (err) {
        console.error("Error loading contact details:", err);
      }
    };

    loadProduct();
    loadContact();
  }, [slug]);

  const handleDownloadBrochure = async () => {
    if (downloading || !product) return;
    setDownloading(true);
    const toastId = toast.loading("Generating brochure PDF...");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Convert image to same-origin Base64 to bypass CORS and load instant
      let base64Img = "";
      const imageUrl = selectedImage || product.image;
      if (imageUrl) {
        try {
          // Use Next.js image optimizer endpoint to proxy and bypass CORS
          const proxyUrl = `/_next/image?url=${encodeURIComponent(imageUrl)}&w=640&q=75`;
          const res = await fetch(proxyUrl);
          if (res.ok) {
            const blob = await res.blob();
            base64Img = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          }
        } catch (imgErr) {
          console.error("Error proxying image for brochure:", imgErr);
        }
      }

      // Fallback to original URL if proxying failed
      setBrochureImage(base64Img || imageUrl || "/placeholder.svg");

      const input = brochureRef.current;
      if (!input) throw new Error("Brochure template not found");

      // Make it temporarily visible offscreen
      input.style.display = "block";
      input.style.position = "absolute";
      input.style.left = "-9999px";
      input.style.top = "0px";

      // Wait a tiny bit for the base64 image render inside the template (no network load needed!)
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(input, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff"
      });

      // Hide the template again
      input.style.display = "none";

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const height = Math.min(imgHeight, pageHeight);

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, height, undefined, 'FAST');
      pdf.save(`Raj_Biosis_${product.title.replace(/\s+/g, "_")}_Brochure.pdf`);

      toast.success("Brochure downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error generating PDF brochure:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      return toast.error(
        "Name is required"
      );
    }

    if (!emailRegex.test(form.email)) {
      return toast.error(
        "Enter valid email"
      );
    }

    if (!phoneRegex.test(form.phone)) {
      return toast.error(
        "Enter valid mobile number"
      );
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "ozallecom",
          "productQueries"
        ),
        {
          ...form,
          productName: product.title,
          productSlug: product.slug,
          brand: product.brand || "",
          model: product.model || "",
          createdAt: new Date(),
        }
      );

      toast.success(
        "Your enquiry has been submitted successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };
  const productSchema = product
    ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      image: product.image ? [product.image] : [],
      description:
        product.desc ||
        product.description ||
        product.title,
      brand: {
        "@type": "Brand",
        name: product.brand || "Raj Biosis",
      },
    }
    : null;

  const faqSchema = product
    ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is ${product.title} used for?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
          },
        },
        {
          "@type": "Question",
          name: "Do you provide installation support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, installation and technical support are available.",
          },
        },
      ],
    }
    : null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied");
    setShowShare(false);
  };

  const handleWhatsapp = () => {
    const shareText = `🔬 ${product?.title}

${product?.desc}

🌐 ${window.location.href}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  const handleInstagram = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Instagram direct sharing available nahi hai. Link copied.");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: product.desc,
        url: window.location.href,
      });
    } else {
      setShowShare(!showShare);
    }
  };

  useEffect(() => {
    const close = (e) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(e.target)
      ) {
        setShowShare(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  if (!product) {
    return (
      <section className="py-10 md:py-20 bg-slate-50">
        <div className="container-custom">

          <div className="grid lg:grid-cols-2 gap-12">

            <div className="h-[420px] md:h-[520px] rounded-[36px] bg-slate-200 animate-pulse" />

            <div>
              <div className="h-12 w-3/4 bg-slate-200 rounded-xl animate-pulse mb-8" />

              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-slate-200 rounded-lg animate-pulse mb-4"
                />
              ))}
            </div>

          </div>

          <div className="mt-16 grid lg:grid-cols-[600px_1fr] gap-8">

            <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
              <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />

              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-200 rounded-2xl animate-pulse mb-4"
                />
              ))}
            </div>

            <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
              <div className="h-10 w-60 bg-slate-200 rounded-lg animate-pulse mb-6" />

              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 bg-slate-200 rounded animate-pulse mb-4"
                />
              ))}
            </div>

          </div>

        </div>
      </section>
    );
  }
  return (
    <section className="py-10 md:py-20 bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <div className="container-custom">
        <div className="mb-6 text-sm text-slate-500">
          Home / Products / {product.title}
        </div>
        {/* Top Section */}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}

          <div>

            <div className="
  relative 
  h-[340px] 
  sm:h-[420px] 
  md:h-[500px] 
  lg:h-[580px]
  rounded-[24px]
  md:rounded-[36px]
  overflow-hidden
  bg-white
  border border-[#E8C8D0]
  shadow-[0_25px_80px_rgba(123,30,58,0.12)]
">


              {selectedMedia === "video" && product.video ? (


                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain p-6"
                >

                  <source
                    src={product.video}
                    type="video/mp4"
                  />

                </video>


              ) : (


                <>


                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-[#F3E5E8] animate-pulse" />
                  )}



                  <Image
                    src={selectedImage || product.image}
                    alt={product.title}
                    fill
                    priority
                    onLoad={() => setImageLoaded(true)}
                    className={`
          object-contain 
          p-4 
          transition 
          duration-500
          ${imageLoaded
                        ? "opacity-100"
                        : "opacity-0"
                      }
        `}
                  />


                </>


              )}


            </div>

            <div className="flex flex-wrap gap-3 mt-5">


              {(product.images?.length
                ? product.images
                : [product.image]
              ).map((img, index) => (


                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(img);
                    setSelectedMedia("image");
                  }}
                  className={`
        w-20 
        h-20 
        rounded-xl 
        overflow-hidden 
        border-2
        transition-all
        duration-300

        ${selectedMedia === "image" &&
                      selectedImage === img
                      ? "border-[#7B1E3A] shadow-[0_5px_15px_rgba(123,30,58,0.25)]"
                      : "border-[#E8C8D0] hover:border-[#7B1E3A]"
                    }
      `}
                >


                  <Image
                    src={img}
                    alt=""
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />


                </button>


              ))}





              {/* Video */}
              {product.video && (


                <button
                  onClick={() =>
                    setSelectedMedia("video")
                  }
                  className={`
        w-20 
        h-20 
        rounded-xl 
        border-2 
        flex 
        flex-col 
        items-center 
        justify-center
        transition-all

        ${selectedMedia === "video"
                      ? "border-[#7B1E3A] bg-[#FFF5F7] text-[#7B1E3A]"
                      : "border-[#E8C8D0] hover:bg-[#FFF5F7]"
                    }
      `}
                >


                  <FaPlay size={20} />


                  <span className="text-xs mt-1">
                    Video
                  </span>


                </button>


              )}





              {/* PDF */}
              {product.pdf && (


                <a
                  href={product.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
        w-20 
        h-20 
        rounded-xl 
        border 
        border-[#E8C8D0]
        flex 
        flex-col 
        items-center 
        justify-center
        text-[#7B1E3A]
        hover:bg-[#FFF5F7]
        transition-all
      "
                >

                  📄

                  <span className="text-xs text-[#6B4A54]">
                    PDF
                  </span>


                </a>


              )}


            </div>

          </div>

          {/* Product Details */}

          <div>

            <div className="flex justify-between items-start gap-4 relative">


              {/* Product Title */}
              <h1 className="
    text-2xl 
    sm:text-3xl 
    md:text-4xl 
    lg:text-5xl 
    font-bold 
    leading-tight 
    text-[#2D1B21]
  ">
                {product.title}
              </h1>




              {/* Share */}
              <div
                ref={shareRef}
                className="relative"
              >


                <button
                  onClick={handleNativeShare}
                  className="
        w-12 
        h-12 
        rounded-full 
        border 
        border-[#E8C8D0]
        bg-white 
        text-[#7B1E3A]
        shadow-md
        flex 
        items-center 
        justify-center 
        hover:bg-[#FFF5F7]
        hover:scale-105
        transition-all
      "
                >

                  <FaShareAlt size={18} />

                </button>




                {showShare && (


                  <div className="
        absolute 
        right-0 
        top-14 
        w-56 
        bg-white 
        rounded-xl 
        shadow-[0_20px_50px_rgba(123,30,58,0.15)]
        border 
        border-[#E8C8D0]
        p-2 
        z-50
      ">


                    {/* Copy Link */}
                    <button
                      onClick={handleCopy}
                      className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                    >

                      <FaLink />
                      Copy Link

                    </button>





                    {/* WhatsApp */}
                    <button
                      onClick={handleWhatsapp}
                      className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                    >

                      <FaWhatsapp className="text-green-600" />
                      WhatsApp

                    </button>





                    {/* Facebook */}
                    <button
                      onClick={handleFacebook}
                      className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                    >

                      <FaFacebook className="text-blue-600" />
                      Facebook

                    </button>





                    {/* Instagram */}
                    <button
                      onClick={handleInstagram}
                      className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                    >

                      <FaInstagram className="text-pink-600" />
                      Instagram

                    </button>


                  </div>


                )}


              </div>


            </div>

            <div className="
  mt-6 
  md:mt-8 
  bg-white 
  p-5 
  sm:p-6 
  md:p-8 
  rounded-[24px] 
  md:rounded-[30px]
  border border-[#E8C8D0]
  shadow-[0_20px_60px_rgba(123,30,58,0.10)]
  space-y-4
">


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Brand:
                </b>{" "}
                {product.brand || "N/A"}
              </p>


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Model:
                </b>{" "}
                {product.model || "N/A"}
              </p>


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Instrument:
                </b>{" "}
                {product.instrument || "N/A"}
              </p>


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Capacity:
                </b>{" "}
                {product.capacity || "N/A"}
              </p>


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Throughput:
                </b>{" "}
                {product.throughput || "N/A"}
              </p>


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Usage:
                </b>{" "}
                {product.usage || "N/A"}
              </p>


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Automation:
                </b>{" "}
                {product.automation || "N/A"}
              </p>


              <p className="text-[#6B4A54]">
                <b className="text-[#2D1B21]">
                  Availability:
                </b>{" "}
                {product.availability || "N/A"}
              </p>


            </div>

          </div>

        </div>

        {/* Description + Form */}

        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] gap-6 md:gap-8">

            {/* Quote Form */}

            <div className="
  bg-white 
  rounded-[24px] 
  md:rounded-[32px]
  p-5 
  sm:p-6 
  md:p-8
  border border-[#E8C8D0]
  shadow-[0_20px_60px_rgba(123,30,58,0.10)]
  h-fit 
  lg:sticky 
  lg:top-24
">


              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#2D1B21]">
                Request A Quote
              </h2>



              <p className="text-[#6B4A54] mb-8">

                Product:

                <span className="font-semibold ml-2 text-[#7B1E3A]">
                  {product.title}
                </span>

              </p>




              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >



                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="
        w-full
        bg-[#FFF8F9]
        border border-[#E8C8D0]
        rounded-xl
        md:rounded-2xl
        px-4
        md:px-5
        py-3
        md:py-4
        text-[#2D1B21]
        placeholder:text-[#9A7B84]
        outline-none
        focus:border-[#7B1E3A]
        focus:ring-2
        focus:ring-[#7B1E3A]/20
        transition
      "
                />





                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="
        w-full
        bg-[#FFF8F9]
        border border-[#E8C8D0]
        rounded-xl
        md:rounded-2xl
        px-4
        md:px-5
        py-3
        md:py-4
        text-[#2D1B21]
        placeholder:text-[#9A7B84]
        outline-none
        focus:border-[#7B1E3A]
        focus:ring-2
        focus:ring-[#7B1E3A]/20
        transition
      "
                />





                <input
                  type="tel"
                  placeholder="Phone Number"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone:
                        e.target.value.replace(
                          /\D/g,
                          ""
                        ),
                    })
                  }
                  className="
        w-full
        bg-[#FFF8F9]
        border border-[#E8C8D0]
        rounded-2xl
        px-5
        py-4
        text-[#2D1B21]
        placeholder:text-[#9A7B84]
        outline-none
        focus:border-[#7B1E3A]
        focus:ring-2
        focus:ring-[#7B1E3A]/20
        transition
      "
                />





                <button
                  type="submit"
                  disabled={submitting}
                  className="
        w-full
        bg-gradient-to-r
        from-[#7B1E3A]
        to-[#A63D5A]
        text-white
        py-4
        rounded-2xl
        font-semibold
        shadow-md
        hover:from-[#5A132B]
        hover:to-[#7B1E3A]
        transition-all
        duration-300
        disabled:opacity-70
      "
                >

                  {submitting
                    ? "Submitting..."
                    : "Get Quote"}

                </button>



              </form>


            </div>

            {/* Description */}

            <div className="
  bg-white 
  rounded-[24px]
  md:rounded-[32px]
  p-5 
  sm:p-6 
  md:p-10
  border border-[#E8C8D0]
  shadow-[0_20px_60px_rgba(123,30,58,0.10)]
">


              {/* Description Title */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#2D1B21]">
                Product Description
              </h3>




              {/* Description */}
              <p className="text-[#6B4A54] leading-7 md:leading-9 text-base md:text-lg">

                {product.desc ||
                  product.description ||
                  "No description available."}

              </p>





              {/* Specifications Table */}
              <div className="mt-10 overflow-x-auto">

                <table className="w-full border border-[#E8C8D0]">


                  <tbody>


                    {[
                      ["Brand", product.brand],
                      ["Model", product.model],
                      ["Usage", product.usage],
                      ["Automation", product.automation],
                      ["Capacity", product.capacity],
                      ["Throughput", product.throughput],
                    ].map(([label, value], index) => (

                      <tr key={index}>


                        <td className="
              border 
              border-[#E8C8D0]
              p-3
              font-semibold
              text-[#2D1B21]
              bg-[#FFF8F9]
            ">
                          {label}
                        </td>


                        <td className="
              border 
              border-[#E8C8D0]
              p-3
              text-[#6B4A54]
            ">
                          {value || "N/A"}
                        </td>


                      </tr>

                    ))}


                  </tbody>


                </table>


              </div>





              {/* SEO Content */}
              <div className="mt-12">


                <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                  Why Choose Raj Biosis in {cityName}?
                </h3>


                <p className="text-[#6B4A54] leading-8">

                  Raj Biosis is a trusted supplier and
                  distributor of {product.title} in {cityName}.
                  We provide high-quality biomedical and laboratory
                  equipment for hospitals, pathology laboratories,
                  diagnostic centres and healthcare facilities.

                </p>




                <div className="mt-8">


                  <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                    Features of {product.title}
                  </h3>


                  <p className="text-[#6B4A54] leading-8">

                    {product.title} offers reliable performance,
                    accurate results, easy operation, long service
                    life and efficient workflow for laboratories
                    and hospitals.

                  </p>


                </div>




                <div className="mt-8">


                  <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                    Applications of {product.title}
                  </h3>

                  <p className="text-[#6B4A54] leading-8">
                    Widely used in hospitals, pathology labs,
                    diagnostic centres, blood banks, research
                    institutes and healthcare facilities.
                  </p>


                </div>




                <div className="mt-8">


                  <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                    {product.title} Supplier in {cityName}
                  </h3>


                  <p className="text-[#6B4A54] leading-8">
                    Raj Biosis supplies {product.title}
                    in {cityName} with technical support,
                    installation assistance and customer service
                    for hospitals and laboratories.
                  </p>


                </div>




                <div className="mt-8">


                  <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                    {product.title} Dealer in {cityName}
                  </h3>


                  <p className="text-[#6B4A54] leading-8">
                    Raj Biosis is a trusted dealer of
                    {product.title} in {cityName}. We supply
                    biomedical equipment, laboratory instruments,
                    diagnostic analyzers and healthcare devices
                    to hospitals, pathology labs and research centres.
                  </p>


                </div>





                <div className="mt-8">


                  <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                    {product.title} Distributor in {cityName}
                  </h3>


                  <p className="text-[#6B4A54] leading-8">
                    Looking for a reliable distributor of
                    {product.title} in {cityName}? We provide
                    installation support, product guidance,
                    maintenance assistance and fast delivery.
                  </p>


                </div>





                <div className="mt-8">


                  <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                    Buy {product.title} in {cityName}
                  </h3>


                  <p className="text-[#6B4A54] leading-8">
                    Buy high quality {product.title} in
                    {cityName} at competitive prices.
                    Contact Raj Biosis for the
                    latest quotation and product availability.
                  </p>


                </div>





                <div className="mt-8">


                  <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                    {product.title} Price in {cityName}
                  </h3>


                  <p className="text-[#6B4A54] leading-8">
                    The price of {product.title} depends on
                    brand, model, specifications and features.
                    Contact our team for the latest pricing,
                    availability and delivery details.
                  </p>


                </div>
              </div>

              {/* FAQ Section */}

              <div className="mt-12">


                <h3 className="text-2xl font-bold mb-6 text-[#2D1B21]">
                  Frequently Asked Questions
                </h3>



                <div className="space-y-8">



                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      What is {product.title} used for in {cityName}?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      {product.title} is commonly used in hospitals,
                      pathology laboratories and diagnostic centres.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      What is the price of {product.title} in {cityName}?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      Pricing depends on specifications,
                      brand and model. Contact us for a quote.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      Are you an authorized supplier of {product.title}?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      We supply genuine biomedical and
                      laboratory equipment from trusted brands.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      Can hospitals in {cityName} order this product?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      Yes, hospitals, pathology laboratories,
                      diagnostic centres and healthcare facilities
                      can order this product.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      Do you provide installation support?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      Yes, installation and technical support
                      are available depending on the product.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      Can I request a quotation?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      Yes, you can submit the enquiry form on
                      this page to receive pricing and product
                      information.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      Do you provide warranty?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      Warranty depends on the manufacturer and
                      product model.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      Do you deliver across India?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      Yes, we supply products across India with
                      safe packaging and logistics support.
                    </p>
                  </div>





                  <div>
                    <h4 className="font-semibold text-lg text-[#7B1E3A]">
                      How can I contact Raj Biosis?
                    </h4>

                    <p className="text-[#6B4A54] mt-2">
                      You can fill out the enquiry form or
                      contact our team directly for product
                      details and quotations.
                    </p>
                  </div>



                </div>


              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Hidden Brochure Template for PDF Generation */}
      <div
        ref={brochureRef}
        style={{
          display: "none",
          width: "800px",
          padding: "40px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#2D1B21",
          background: "#ffffff",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #7B1E3A",
          paddingBottom: "20px",
          marginBottom: "30px"
        }}>
          {/* Logo & Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img src="/logo.png" style={{ height: "65px", width: "auto", objectFit: "contain" }} />
            <div>
              <h1 style={{ margin: "0", fontSize: "28px", color: "#7B1E3A", fontWeight: "800", letterSpacing: "-0.5px" }}>
                Raj Biosis
              </h1>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6B4A54", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                Trusted Biomedical Systems
              </p>
            </div>
          </div>
          {/* Contact Details */}
          <div style={{ textAlign: "right", fontSize: "12px", lineHeight: "1.6", color: "#6B4A54" }}>
            <p style={{ margin: "0", fontWeight: "700", color: "#7B1E3A", fontSize: "14px" }}>www.ozalle.com</p>
            <p style={{ margin: "0" }}>Email: {contactData.email}</p>
            <div style={{ margin: "0" }}>
              {contactData.phone.split(/[\n,]+/).map((num, i) => (
                <span key={i} style={{ display: "block" }}>Mob: {num.trim()}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Title */}
        <h2 style={{ fontSize: "26px", color: "#2D1B21", margin: "0 0 25px 0", textAlign: "center", fontWeight: "800", textTransform: "uppercase" }}>
          {product.title}
        </h2>

        {/* Main Layout Grid */}
        <div style={{ display: "flex", gap: "30px", marginBottom: "35px" }}>
          {/* Left Column: Image */}
          <div style={{
            flex: "1.2",
            border: "1px solid #E8C8D0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "320px",
            backgroundColor: "#FFF8F9"
          }}>
            <img
              src={brochureImage || "/placeholder.jpg"}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>

          {/* Right Column: Specs */}
          <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ backgroundColor: "#FFF8F9", border: "1px solid #E8C8D0", borderRadius: "16px", padding: "20px", height: "100%", boxSizing: "border-box" }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#7B1E3A", fontSize: "18px", fontWeight: "700", borderBottom: "1px solid #E8C8D0", paddingBottom: "8px" }}>
                Specifications
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                  <strong style={{ color: "#2D1B21" }}>Brand:</strong> {product.brand || "Raj Biosis"}
                </p>
                <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                  <strong style={{ color: "#2D1B21" }}>Model:</strong> {product.model || "N/A"}
                </p>
                {product.instrument && (
                  <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                    <strong style={{ color: "#2D1B21" }}>Instrument:</strong> {product.instrument}
                  </p>
                )}
                {product.category && (
                  <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                    <strong style={{ color: "#2D1B21" }}>Category:</strong> {product.category}
                  </p>
                )}
                {product.subCategory && (
                  <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                    <strong style={{ color: "#2D1B21" }}>Subcategory:</strong> {product.subCategory}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "35px" }}>
          <h3 style={{ color: "#7B1E3A", fontSize: "18px", fontWeight: "700", borderLeft: "4px solid #7B1E3A", paddingLeft: "10px", margin: "0 0 12px 0" }}>
            Product Overview
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#6B4A54", margin: "0", textAlign: "justify" }}>
            {product.description || product.desc || "Premium biomedical equipment designed for laboratories, hospitals, and diagnostic centers."}
          </p>
        </div>

        {/* Footer Details */}
        <div style={{
          marginTop: "auto",
          borderTop: "1px solid #E8C8D0",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "11px",
          color: "#9A7B84",
          lineHeight: "1.5"
        }}>
          <p style={{ margin: "0", fontWeight: "600" }}>Office Address: {contactData.address}</p>
          <p style={{ margin: "5px 0 0 0" }}>© 2026 Raj Biosis. All rights reserved. Premium diagnostics and biomedical solutions.</p>
        </div>
      </div>

      {/* Sticky floating download brochure FAB */}
      <button
        onClick={handleDownloadBrochure}
        disabled={downloading}
        title="Download Brochure"
        className="fixed bottom-24 right-8 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-[#7B1E3A] px-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#5A132B] hover:shadow-xl active:scale-95 disabled:opacity-75 font-semibold"
      >
        {downloading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Download size={20} />
        )}
        <span>Download Brochure</span>
      </button>
    </section>
  );
}
