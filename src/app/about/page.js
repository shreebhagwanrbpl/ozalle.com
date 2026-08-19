import Link from "next/link";
import {
  ShieldCheck,
  Microscope,
  FlaskConical,
  Stethoscope,
  Settings,
  ArrowRight,
  CheckCircle2,
  Target,
  Eye,
  Award,
  Users,
  Activity,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "About Us | Biomedical & Laboratory Equipment Supplier - Raj Biosis",
  description: "Learn about Raj Biosis Private Limited (Central Biomedicals), leading supplier, dealer and distributor of biomedical and laboratory equipment across India.",
  alternates: {
    canonical: "https://ozalle.com/about",
  },
  openGraph: {
    title: "About Us | Raj Biosis Biomedical Equipment Supplier",
    description: "Delivering trusted diagnostic and biomedical technologies with innovation, quality, and healthcare precision.",
    url: "https://ozalle.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* =========================================================
          PAGE BANNER
      ========================================================== */}

      <PageBanner
        title="About Rajbiosis"
        subtitle="Delivering trusted diagnostic and biomedical technologies with innovation, quality, and healthcare precision."
      />

      {/* =========================================================
          INTRODUCTION
      ========================================================== */}

      <section className="relative overflow-hidden bg-white py-20 md:py-28">

        {/* Background decoration */}

        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="container-custom relative">

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Left Content */}

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">

                <span className="h-2 w-2 rounded-full bg-indigo-600" />

                Who We Are

              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">

                Your Trusted Partner in

                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Biomedical Healthcare
                </span>

              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Rajbiosis is focused on providing reliable
                biomedical, diagnostic and laboratory solutions for
                modern healthcare environments.
              </p>

              <p className="mt-5 max-w-2xl leading-8 text-slate-600">
                We combine advanced technology, quality equipment and
                dependable technical support to help hospitals,
                laboratories and healthcare professionals improve
                diagnostic efficiency and everyday operations.
              </p>

              {/* Highlights */}

              <div className="mt-9 grid gap-4 sm:grid-cols-2">

                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-100 hover:bg-indigo-50/40">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Trusted Solutions
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Reliable biomedical technologies for healthcare.
                    </p>
                  </div>

                </div>


                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-cyan-100 hover:bg-cyan-50/40">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <Award size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Quality Focused
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Precision, performance and dependable support.
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* Right - No Image */}

            <div className="relative">

              <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-7 shadow-[0_25px_80px_rgba(15,23,42,0.15)] sm:p-9">

                {/* Small Header */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
                      Rajbiosis
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-white">
                      Healthcare Technology
                    </h3>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                    <Microscope size={24} />
                  </div>

                </div>


                {/* Feature List */}

                <div className="mt-9 space-y-4">

                  {[
                    {
                      icon: FlaskConical,
                      title: "Advanced Laboratory Solutions",
                      text: "Modern systems designed for efficient laboratory operations.",
                    },
                    {
                      icon: Stethoscope,
                      title: "Diagnostic Technologies",
                      text: "Reliable equipment supporting accurate healthcare diagnostics.",
                    },
                    {
                      icon: Settings,
                      title: "Technical Support",
                      text: "Professional assistance for dependable equipment performance.",
                    },
                    {
                      icon: Activity,
                      title: "Healthcare Efficiency",
                      text: "Solutions designed around accuracy and operational efficiency.",
                    },
                  ].map((item, index) => {

                    const Icon = item.icon;

                    return (
                      <div
                        key={index}
                        className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:bg-white/[0.09]"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300 transition group-hover:bg-cyan-500 group-hover:text-white">
                          <Icon size={20} />
                        </div>

                        <div>

                          <h4 className="font-bold text-white">
                            {item.title}
                          </h4>

                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            {item.text}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          STATS
      ========================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 py-16">

        <div className="container-custom">

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "10+",
                label: "Years of Experience",
              },
              {
                number: "500+",
                label: "Products & Solutions",
              },
              {
                number: "100%",
                label: "Quality Commitment",
              },
              {
                number: "24/7",
                label: "Support & Assistance",
              },
            ].map((stat, index) => (

              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <h3 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.number}
                </h3>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          MISSION / VISION
      ========================================================== */}

      <section className="bg-white py-20 md:py-28">

        <div className="container-custom">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">

              <span className="h-2 w-2 rounded-full bg-cyan-600" />

              Our Purpose

            </span>

            <h2 className="mt-5 text-3xl font-black text-slate-950 sm:text-4xl">
              Built Around Better Healthcare
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Our approach is simple — provide dependable technology,
              professional support and solutions that help healthcare
              facilities operate with greater confidence.
            </p>

          </div>


          <div className="mt-14 grid gap-7 md:grid-cols-2">

            {/* Mission */}

            <div className="group rounded-[30px] border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-8 transition duration-500 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <Target size={25} />
              </div>

              <h3 className="mt-7 text-2xl font-black text-slate-950">
                Our Mission
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                To deliver high-quality biomedical and diagnostic
                solutions that support healthcare professionals,
                laboratories and medical institutions in achieving
                reliable and efficient operations.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-700">
                <CheckCircle2 size={17} />
                Quality Driven
              </div>

            </div>


            {/* Vision */}

            <div className="group rounded-[30px] border border-slate-200 bg-gradient-to-br from-cyan-50 to-white p-8 transition duration-500 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/20">
                <Eye size={25} />
              </div>

              <h3 className="mt-7 text-2xl font-black text-slate-950">
                Our Vision
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                To become a trusted name in biomedical technology by
                continuously adopting innovation, improving service
                quality and creating long-term value for healthcare
                institutions.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-cyan-700">
                <CheckCircle2 size={17} />
                Innovation Focused
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          WHY CHOOSE US
      ========================================================== */}

      <section className="bg-slate-50 py-20 md:py-28">

        <div className="container-custom">

          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Heading */}

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-indigo-700">

                <span className="h-2 w-2 rounded-full bg-indigo-600" />

                Why Rajbiosis

              </span>

              <h2 className="mt-6 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">

                Technology You Can

                <span className="block text-indigo-600">
                  Depend On
                </span>

              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                We focus on delivering practical, dependable and
                technology-driven solutions that meet the evolving
                requirements of modern healthcare facilities.
              </p>

            </div>


            {/* Benefits */}

            <div className="grid gap-4 sm:grid-cols-2">

              {[
                "Advanced biomedical equipment",
                "Reliable diagnostic solutions",
                "Professional technical assistance",
                "Laboratory-focused solutions",
                "Quality-first approach",
                "Long-term customer support",
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <CheckCircle2 size={18} />
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CTA
      ========================================================== */}

      <section className="bg-white py-20 md:py-28">

        <div className="container-custom">

          <div className="relative overflow-hidden rounded-[35px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-7 py-14 text-center shadow-2xl sm:px-12 md:py-20">

            {/* Glow */}

            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative">

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-200">
                <Users size={16} />
                Let's Work Together
              </span>

              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
                Looking for Reliable Biomedical Solutions?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
                Talk to our team about your laboratory, diagnostic
                equipment and biomedical technology requirements.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">

                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-50"
                >
                  Contact Our Team

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/items"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Explore Products
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}