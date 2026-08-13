"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  ArrowRight,
  ShieldCheck,
  Microscope,
  BadgeCheck,
  Activity,
  FlaskConical,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function HeroSection({ city }) {
  const [loading, setLoading] = useState(true);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });

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

  // -----------------------------------------
  // DISTRICT ROUTING
  // -----------------------------------------

  const districtSlug = city
    ? city.toLowerCase().replace(/\s+/g, "-")
    : "";

  const makeLink = (path) => {
    return districtSlug ? `/${districtSlug}${path}` : path;
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f9fc]">

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">

        {/* Soft glow */}

        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="absolute right-[-150px] top-[20%] h-[500px] w-[500px] rounded-full bg-sky-200/30 blur-3xl" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />
      </div>

      {/* =====================================
          MAIN HERO
      ====================================== */}

      <div className="mx-auto grid min-h-[780px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-16">

        {/* =================================
            LEFT CONTENT
        ================================= */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="relative z-10"
        >

          {/* Badge */}

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
              <Sparkles size={14} />
            </span>

            Advanced Biomedical Technology

          </div>

          {/* Heading */}

          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[68px]">

            {loading ? (
              <div className="animate-pulse space-y-4">

                <div className="h-14 w-[90%] rounded-xl bg-slate-200" />

                <div className="h-14 w-[75%] rounded-xl bg-slate-200" />

                <div className="h-14 w-[60%] rounded-xl bg-slate-200" />

              </div>
            ) : (
              <>
                {heroData.title ||
                  "Advanced Biomedical Solutions for Modern Healthcare"}

                {city && (
                  <>
                    {" "}
                    <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                      in {city}
                    </span>
                  </>
                )}
              </>
            )}

          </h1>

          {/* Description */}

          {loading ? (
            <div className="mt-8 animate-pulse space-y-3">

              <div className="h-4 w-full max-w-xl rounded bg-slate-200" />

              <div className="h-4 w-[90%] max-w-xl rounded bg-slate-200" />

              <div className="h-4 w-[70%] max-w-xl rounded bg-slate-200" />

            </div>
          ) : (
            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {heroData.description ||
                "Precision-driven biomedical equipment, diagnostic systems and laboratory solutions designed to improve efficiency, accuracy and dependable healthcare operations."}

              {city && (
                <>
                  {" "}
                  Delivering advanced solutions across{" "}
                  <strong className="font-semibold text-slate-800">
                    {city}
                  </strong>
                  .
                </>
              )}
            </p>
          )}

          {/* =================================
              BUTTONS
          ================================= */}

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">

            {loading ? (
              <>
                <div className="h-14 w-48 animate-pulse rounded-2xl bg-slate-200" />

                <div className="h-14 w-40 animate-pulse rounded-2xl bg-slate-200" />
              </>
            ) : (
              <>
                <Link
                  href={makeLink("/services")}
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-600/20"
                >
                  {heroData.button1Text ||
                    "Explore Services"}

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/20">
                    <ArrowRight size={16} />
                  </span>
                </Link>

                <Link
                  href={makeLink("/contact")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {heroData.button2Text ||
                    "Talk to Our Team"}
                </Link>
              </>
            )}

          </div>

          {/* =================================
              TRUST LINE
          ================================= */}

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-indigo-600"
              />
              Quality Focused
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-indigo-600"
              />
              Reliable Support
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-indigo-600"
              />
              Healthcare Ready
            </div>

          </div>

          {/* =================================
              STATS
          ================================= */}

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-5">

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">

              <div className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                10+
              </div>

              <div className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                Years Experience
              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">

              <div className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                500+
              </div>

              <div className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                Products Delivered
              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">

              <div className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                100%
              </div>

              <div className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                Quality Focus
              </div>

            </div>

          </div>

        </motion.div>

        {/* =====================================
            RIGHT VISUAL
        ====================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 60,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative mx-auto w-full max-w-[620px]"
        >

          {/* Main Image Container */}

          <div className="relative">

            {/* Outer glow */}

            <div className="absolute -inset-5 rounded-[42px] bg-gradient-to-br from-indigo-200/40 via-purple-100/30 to-sky-200/40 blur-2xl" />

            <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white p-3 shadow-[0_30px_90px_rgba(15,23,42,0.14)]">

              <div className="relative h-[430px] overflow-hidden rounded-[27px] bg-slate-100 sm:h-[520px]">

                {/* NEW HERO IMAGE */}

                <Image
                  src="https://images.unsplash.com/photo-1581093458791-9d42e3c2e6a5?auto=format&fit=crop&w=1400&q=85"
                  alt="Modern biomedical laboratory equipment"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                {/* Dark gradient */}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Top floating label */}

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 shadow-lg backdrop-blur">

                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  Healthcare Technology

                </div>

                {/* Bottom content */}

                <div className="absolute bottom-5 left-5 right-5">

                  <div className="rounded-2xl border border-white/20 bg-slate-950/60 p-5 text-white backdrop-blur-xl">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                          Precision • Innovation • Reliability
                        </p>

                        <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                          Built for Modern Laboratories
                        </h3>

                      </div>

                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:flex">
                        <Microscope size={24} />
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================
              FLOATING CARD — TOP
          ================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
              duration: 0.5,
            }}
            className="absolute -left-5 top-12 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] lg:flex"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FlaskConical size={21} />
              </div>

              <div>

                <p className="text-sm font-bold text-slate-900">
                  Advanced Systems
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Laboratory Technology
                </p>

              </div>

            </div>

          </motion.div>

          {/* =================================
              FLOATING CARD — RIGHT
          ================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.15,
              duration: 0.5,
            }}
            className="absolute -right-5 bottom-24 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] lg:flex"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BadgeCheck size={21} />
              </div>

              <div>

                <p className="text-sm font-bold text-slate-900">
                  Quality Assured
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Trusted Solutions
                </p>

              </div>

            </div>

          </motion.div>

          {/* =================================
              MINI FLOATING ICON
          ================================= */}

          <div className="absolute -bottom-5 left-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white text-indigo-600 shadow-xl">

            <Activity size={24} />

          </div>

        </motion.div>

      </div>

      {/* =====================================
          BOTTOM TRUST STRIP
      ====================================== */}

      <div className="border-t border-slate-200/70 bg-white/70">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <ShieldCheck size={18} />
            </div>

            <div>

              <p className="text-sm font-bold text-slate-900">
                Trusted Biomedical Solutions
              </p>

              <p className="text-xs text-slate-500">
                Equipment and technology for modern healthcare
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-2 text-xs font-semibold text-slate-500">

            <span>Diagnostic Equipment</span>
            <span>Laboratory Systems</span>
            <span>Healthcare Automation</span>
            <span>Technical Support</span>

          </div>

        </div>

      </div>

    </section>
  );
}