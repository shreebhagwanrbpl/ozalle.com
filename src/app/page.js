"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  ArrowRight,
  BadgeCheck,
  Activity,
  Package,
} from "lucide-react";

import ServiceCard from "@/components/ServiceCard";
import ProductCard from "@/components/ProductCard";
import IMG from "../components/img/img.png";


export default function HeroSection({ city }) {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setProductsLoading(true);
        const catalog = await fetchFullCatalog();
        if (catalog && catalog.length > 0) {
          setFeaturedProducts(catalog.slice(0, 6));
        }
      } catch (err) {
        console.error("Error fetching catalog for homepage:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    loadCatalog();
  }, []);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "ozallecom",
            "pages",
            "services"
          )
        );

        if (snap.exists() && Array.isArray(snap.data().services) && snap.data().services.length > 0) {
          setServices(snap.data().services);
        } else {
          setServices([
            {
              title: "Diagnostic Equipment & Analyzers Supply",
              desc: "Complete supply and distribution of CBC machines, 3-part & 5-part hematology analyzers, fully automated biochemistry analyzers, and ELISA readers across India.",
            },
            {
              title: "Laboratory Setup & Installation",
              desc: "Turnkey diagnostic laboratory planning, calibration, installation, and operational setup tailored for hospitals, pathology labs, and clinics.",
            },
            {
              title: "Biomedical Maintenance & AMC Services",
              desc: "Annual Maintenance Contracts (AMC), preventive maintenance, regular calibration, and rapid troubleshooting to ensure minimal downtime for critical analyzers.",
            },
          ]);
        }
      } catch (error) {
        console.error(error);
        setServices([
          {
            title: "Diagnostic Equipment & Analyzers Supply",
            desc: "Complete supply and distribution of CBC machines, 3-part & 5-part hematology analyzers, fully automated biochemistry analyzers, and ELISA readers across India.",
          },
          {
            title: "Laboratory Setup & Installation",
            desc: "Turnkey diagnostic laboratory planning, calibration, installation, and operational setup tailored for hospitals, pathology labs, and clinics.",
          },
          {
            title: "Biomedical Maintenance & AMC Services",
            desc: "Annual Maintenance Contracts (AMC), preventive maintenance, regular calibration, and rapid troubleshooting to ensure minimal downtime for critical analyzers.",
          },
        ]);
      }
    };

    fetchServices();
  }, []);
  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "ozallecom", "pages", "home")
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // District Routing
  const districtSlug = city
    ? city.toLowerCase().replace(/\s+/g, "-")
    : "";

  const makeLink = (path) => {
    return districtSlug ? `/${districtSlug}${path}` : path;
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div className="container-custom min-h-[85vh] py-20 lg:py-0 grid lg:grid-cols-2 gap-14 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-5 py-2 text-sm font-semibold text-cyan-700 shadow-sm mb-8">
              <ShieldCheck size={18} />
              Trusted Biomedical Systems
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 rounded-xl bg-gray-200 w-[80%]" />
                  <div className="h-12 rounded-xl bg-gray-200 w-[60%]" />
                  <div className="h-12 rounded-xl bg-gray-200 w-[70%]" />
                </div>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-slate-900 via-cyan-700 to-sky-500 bg-clip-text text-transparent">
                    {heroData.title}
                  </span>

                  {city && (
                    <>
                      <br />
                      <span className="text-2xl lg:text-4xl text-cyan-700 font-bold">
                        in {city}
                      </span>
                    </>
                  )}
                </>
              )}
            </h1>

            {/* Description */}
            {loading ? (
              <div className="animate-pulse mt-8 space-y-3">
                <div className="h-4 rounded bg-gray-200 w-full"></div>
                <div className="h-4 rounded bg-gray-200 w-[90%]"></div>
                <div className="h-4 rounded bg-gray-200 w-[75%]"></div>
              </div>
            ) : (
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
                {heroData.description}

                {city && (
                  <>
                    {" "}
                    across <strong className="text-cyan-700">{city}</strong>
                  </>
                )}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-5">
              {loading ? (
                <>
                  <div className="animate-pulse h-14 w-48 rounded-xl bg-gray-200"></div>
                  <div className="animate-pulse h-14 w-40 rounded-xl bg-gray-200"></div>
                </>
              ) : (
                <>
                  <Link href={makeLink("/services")}>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-700 hover:shadow-cyan-300">
                      {heroData.button1Text || "Explore Services"}
                      <ArrowRight size={18} />
                    </button>
                  </Link>

                  <Link href={makeLink("/contact")}>
                    <button className="rounded-xl border-2 border-cyan-700 px-7 py-4 font-semibold text-cyan-700 transition-all duration-300 hover:bg-cyan-700 hover:text-white">
                      {heroData.button2Text || "Contact Us"}
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
                <h4 className="font-bold text-slate-900">
                  Advanced Laboratory Systems
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  High-performance biomedical equipment for hospitals,
                  diagnostic centers and research laboratories.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
                <h4 className="font-bold text-slate-900">
                  Certified Quality Products
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Reliable and trusted biomedical solutions with complete
                  quality assurance and after-sales support.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 mt-12">
              <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-md text-center transition hover:-translate-y-1">
                <h3 className="text-3xl font-bold text-cyan-700">
                  10+
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Years Experience
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-md text-center transition hover:-translate-y-1">
                <h3 className="text-3xl font-bold text-cyan-700">
                  500+
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Products Delivered
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-md text-center transition hover:-translate-y-1">
                <h3 className="text-3xl font-bold text-cyan-700">
                  100%
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Quality Assurance
                </p>
              </div>
            </div>
          </motion.div>
          {/* Right Side */}

          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center"
          >
            {/* Background Glow */}
            <div className="absolute h-[420px] w-[420px] rounded-full bg-Cyan-200/40 blur-[120px]"></div>

            {/* Image Card */}
            <div className="relative z-10 w-full max-w-[600px] overflow-hidden rounded-[35px] border border-cyan-100 bg-white p-4 shadow-[0_25px_60px_rgba(220,38,38,0.15)]">

              <Image
                src={IMG}
                alt="Central Biomedical"
                width={1200}
                height={900}
                className="h-[380px] sm:h-[500px] lg:h-[620px] w-full rounded-[28px] object-cover transition duration-700 hover:scale-105"
              />

              {/* Bottom Overlay */}
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/90 backdrop-blur-md border border-cyan-100 p-5 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900">
                  Advanced Biomedical Solutions
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Delivering trusted laboratory and hospital equipment with
                  precision, innovation and long-term reliability.
                </p>
              </div>
            </div>

            {/* Experience Badge */}
            <div className="absolute -top-6 right-0 hidden lg:flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-cyan-700 to-Cyan-700 h-28 w-28 text-white shadow-2xl">
              <span className="text-3xl font-bold">10+</span>
              <span className="text-xs tracking-wide">
                YEARS
              </span>
            </div>

            {/* Floating Card Left */}
            <div className="absolute left-0 top-1/4 hidden lg:flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-xl border border-cyan-100">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-Cyan-100">
                <Microscope className="text-cyan-700" size={26} />
              </div>

              <div>
                <h4 className="font-bold text-slate-900">
                  Precision Lab
                </h4>

                <p className="text-sm text-slate-500">
                  Modern Equipment
                </p>
              </div>
            </div>

            {/* Floating Card Bottom */}
            <div className="absolute -bottom-5 right-10 hidden lg:flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-xl border border-cyan-100">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                <BadgeCheck className="text-blue-600" size={26} />
              </div>

              <div>
                <h4 className="font-bold text-slate-900">
                  ISO Certified
                </h4>

                <p className="text-sm text-slate-500">
                  Quality Guaranteed
                </p>
              </div>
            </div>

            {/* Small Floating Dot */}
            <div className="absolute top-16 left-24 hidden lg:block h-5 w-5 rounded-full bg-Cyan-500 shadow-lg"></div>

            <div className="absolute bottom-28 right-0 hidden lg:block h-4 w-4 rounded-full bg-orange-400 shadow-lg"></div>

          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Image */}
          <div className="relative">

            <div className="overflow-hidden rounded-[40px] border border-cyan-100 bg-white p-4 shadow-[0_20px_60px_rgba(8,145,178,0.15)]">

              <Image
                src="/about-biomedical.jpg"
                alt="Raj Biosis Biomedical Laboratory Equipment & Solutions"
                width={800}
                height={600}
                className="h-[600px] w-full rounded-[30px] object-cover transition duration-700 hover:scale-105"
                priority={false}
              />

            </div>

            {/* Floating Card */}
            <div className="absolute bottom-8 left-8 hidden lg:flex items-center gap-4 rounded-3xl border border-cyan-100 bg-white px-6 py-5 shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">

                <span className="text-xl font-bold text-cyan-700">
                  10+
                </span>

              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Years Experience
                </h3>

                <p className="text-sm text-slate-500">
                  Trusted Biomedical Partner
                </p>

              </div>

            </div>

          </div>

          {/* Right Content */}
          <div>
            <div>
              <span className="inline-block rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                Who We Are
              </span>

              <h2 className="mt-5 text-4xl font-bold text-slate-900">
                Trusted Partner in Biomedical & Diagnostics
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                We provide advanced diagnostic and biomedical solutions focused on
                healthcare innovation, laboratory precision, and modern medical excellence.
              </p>
            </div>
            <p className="mt-8 text-slate-600 leading-8">
              At Central Biomedicals,
              we are committed to
              delivering premium-quality
              healthcare and biomedical
              technologies designed to
              improve diagnostics,
              laboratory performance,
              and medical efficiency.
            </p>

            <p className="mt-5 text-slate-600 leading-8">
              Our mission is to empower
              healthcare professionals
              with trusted equipment,
              expert consultation, and
              innovative biomedical
              support.
            </p>

            {/* Feature Points */}
            <div className="grid sm:grid-cols-2 gap-5 mt-10">

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-lg">
                  Premium Equipment
                </h4>

                <p className="text-slate-500 mt-2">
                  High-end diagnostic
                  technologies.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-lg">
                  Expert Support
                </h4>

                <p className="text-slate-500 mt-2">
                  Trusted healthcare
                  consultation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28">

        {/* Background Decoration */}

        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />


        <div className="container-custom relative">

          {/* =====================================================
        HEADER
    ====================================================== */}

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">

              <span className="h-2 w-2 rounded-full bg-cyan-600" />

              Our Services

            </span>


            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">

              Premium Biomedical

              <span className="block bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Services & Solutions
              </span>

            </h2>


            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">

              From advanced diagnostic equipment to laboratory
              solutions and technical support, we deliver reliable
              biomedical services built for modern healthcare.

            </p>

          </div>


          {/* =====================================================
        SERVICE CARDS
    ====================================================== */}

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {services.slice(0, 3).map((service, index) => (

              <div
                key={service.id || index}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-[0_25px_70px_rgba(6,182,212,0.12)]"
              >

                {/* Card Glow */}

                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-100/50 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />


                {/* Service Number */}

                <div className="absolute right-6 top-5 text-5xl font-black text-slate-100 transition duration-500 group-hover:text-cyan-50">
                  {String(index + 1).padStart(2, "0")}
                </div>


                {/* Icon */}

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-indigo-50 text-2xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:from-cyan-600 group-hover:to-indigo-600 group-hover:text-white">

                  {icons[index]}

                </div>


                {/* Content */}

                <div className="relative">

                  <h3 className="mt-7 text-xl font-bold text-slate-950 transition-colors duration-300 group-hover:text-cyan-700">

                    {service.title}

                  </h3>


                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">

                    {service.desc}

                  </p>


                  {/* Bottom Link */}

                  <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">

                    <span className="text-sm font-bold text-slate-800">
                      Explore Service
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                      →
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* =====================================================
        VIEW ALL BUTTON
    ====================================================== */}

          <div className="mt-12 text-center">

            <Link
              href={makeLink("/services")}
              className="group inline-flex items-center gap-3 rounded-2xl bg-white-950 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-white-900/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white-700 hover:shadow-white-700/20"
            >

              <span>
                View All Services
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURED PRODUCTS SECTION
      ====================================================== */}
      <section className="section-padding bg-slate-50 border-t border-b border-slate-200/60">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
              <Package size={16} />
              Featured Products
            </span>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              Advanced Biomedical &{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                Laboratory Equipment
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Explore our range of high-precision diagnostic analyzers, hematology instruments, and medical laboratory solutions.
            </p>
          </div>

          {productsLoading ? (
            <div className="mt-12 grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-44 rounded-3xl bg-white shadow animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="mt-12 grid gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.uid || product.slug}
                  product={product}
                  district={districtSlug}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-slate-500 py-10 bg-white rounded-3xl border border-slate-200">
              No featured products available at the moment.
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href={makeLink("/items")}
              className="group inline-flex items-center gap-3 rounded-2xl bg-cyan-700 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-800"
            >
              <span>Explore All Products</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-white to-cyan-50/30">
        <div className="container-custom">

          <div className="text-center max-w-3xl mx-auto">

            <span className="inline-block rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
              Why Choose Us
            </span>

            <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-slate-900">
              Trusted Biomedical Solutions
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We deliver high-quality biomedical equipment backed by
              experienced engineers, reliable support and innovative
              healthcare solutions.
            </p>

          </div>

          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-8 mt-16">

            <div className="rounded-3xl bg-white border border-cyan-100 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 text-3xl">
                🔬
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Advanced Equipment
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Latest biomedical instruments with accurate and reliable performance.
              </p>

            </div>

            <div className="rounded-3xl bg-white border border-cyan-100 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 text-3xl">
                🛡️
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Quality Assurance
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Every product is tested to meet healthcare industry standards.
              </p>

            </div>

            <div className="rounded-3xl bg-white border border-cyan-100 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 text-3xl">
                👨‍🔧
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Expert Engineers
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Professional installation, calibration and maintenance support.
              </p>

            </div>

            <div className="rounded-3xl bg-white border border-cyan-100 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 text-3xl">
                🚚
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Fast Delivery
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Quick nationwide delivery with dependable after-sales service.
              </p>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}