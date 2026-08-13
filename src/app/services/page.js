"use client";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Settings2,
  Headphones,
  Building2,
} from "lucide-react";

import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import CTASection from "@/components/CTASection";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const icons = [
    Microscope,
    FlaskConical,
    ShieldCheck,
    Stethoscope,
    Wrench,
    Activity,
  ];

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

        if (snap.exists()) {
          setServices(snap.data().services || []);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      {/* =====================================================
          PAGE BANNER
      ====================================================== */}

      <PageBanner
        title="Our Services"
        subtitle="Advanced biomedical, laboratory and diagnostic solutions designed to support modern healthcare facilities with precision and reliability."
      />

      {/* =====================================================
          INTRO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-white py-20 md:py-28">

        {/* Background decoration */}
        <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              <Sparkles size={16} />
              What We Offer
            </span>

            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Premium Biomedical
              <span className="block bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Services & Solutions
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              From diagnostic equipment and laboratory solutions to
              installation, maintenance and technical support, we help
              healthcare organizations build reliable and efficient
              laboratory environments.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section className="relative bg-slate-50 py-20 md:py-28">

        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          {/* Section heading */}

          <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div className="max-w-2xl">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
                Our Expertise
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Complete Healthcare Support
              </h2>

              <p className="mt-4 text-slate-600 leading-7">
                Professional solutions built around the operational,
                diagnostic and technical requirements of modern laboratories.
              </p>

            </div>

            <div className="hidden rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm md:block">
              {loading
                ? "Loading services..."
                : `${services.length} Professional Services`}
            </div>

          </div>

          {/* Service Grid */}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-200" />

                  <div className="mt-7 h-7 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="mt-5 space-y-3">
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-8/12 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))
            ) : services.length > 0 ? (
              services.map((service, index) => {

                const Icon = icons[index % icons.length];

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-[0_25px_70px_rgba(15,23,42,0.10)]"
                  >

                    {/* Top gradient line */}

                    <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-blue-600 opacity-0 transition group-hover:opacity-100" />

                    {/* Icon */}

                    <div className="flex items-center justify-between">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-indigo-50 text-cyan-700 transition duration-500 group-hover:scale-110 group-hover:from-cyan-600 group-hover:to-indigo-600 group-hover:text-white">

                        <Icon size={30} strokeWidth={1.8} />

                      </div>

                      <span className="text-4xl font-black text-slate-100 transition group-hover:text-cyan-50">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    {/* Content */}

                    <h3 className="mt-7 text-xl font-bold text-slate-950 transition group-hover:text-cyan-700">
                      {service.title || "Biomedical Service"}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                      {service.desc ||
                        "Professional biomedical solutions designed for modern healthcare and laboratory requirements."}
                    </p>

                    {/* Bottom */}

                    <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">

                      <span className="text-sm font-semibold text-slate-700">
                        Professional Solution
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                        <ArrowRight size={17} />
                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              <div className="md:col-span-2 lg:col-span-3">

                <div className="rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                    <Settings2 size={28} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-950">
                    Services Coming Soon
                  </h3>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                    Our professional biomedical services will appear here
                    once they are added from the admin panel.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}

      <section className="bg-white py-20 md:py-28">

        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                <ShieldCheck size={17} />
                Why Choose Us
              </span>

              <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Reliable Solutions.
                <span className="block text-indigo-600">
                  Professional Support.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
                We combine biomedical expertise, dependable equipment and
                responsive technical support to help healthcare facilities
                operate with confidence.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">

                {[
                  "Quality-focused equipment",
                  "Experienced technical team",
                  "Reliable installation support",
                  "Long-term maintenance assistance",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-cyan-600"
                    />

                    <span className="text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

            </div>

            {/* Right */}

            <div className="relative">

              <div className="rounded-[35px] bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-950 p-8 shadow-2xl sm:p-10">

                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

                    <Microscope className="text-cyan-300" size={30} />

                    <h3 className="mt-6 text-xl font-bold text-white">
                      Advanced Equipment
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Modern biomedical and diagnostic technologies for
                      efficient laboratory operations.
                    </p>

                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

                    <Wrench className="text-cyan-300" size={30} />

                    <h3 className="mt-6 text-xl font-bold text-white">
                      Technical Support
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Professional assistance for installation,
                      maintenance and equipment support.
                    </p>

                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

                    <Building2 className="text-cyan-300" size={30} />

                    <h3 className="mt-6 text-xl font-bold text-white">
                      Healthcare Facilities
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Solutions suitable for hospitals, laboratories,
                      diagnostic centers and clinics.
                    </p>

                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

                    <Headphones className="text-cyan-300" size={30} />

                    <h3 className="mt-6 text-xl font-bold text-white">
                      Responsive Assistance
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Dedicated support to help keep your healthcare
                      operations running smoothly.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WORKING PROCESS
      ====================================================== */}

      <section className="bg-slate-50 py-20 md:py-28">

        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
              How We Work
            </span>

            <h2 className="mt-5 text-4xl font-black text-slate-950 sm:text-5xl">
              A Simple, Reliable Process
            </h2>

            <p className="mt-5 text-slate-600 leading-8">
              From understanding your requirements to providing ongoing
              technical support, our process is designed around reliability.
            </p>

          </div>

          <div className="relative mt-16 grid gap-6 lg:grid-cols-3">

            {[
              {
                number: "01",
                title: "Consultation",
                description:
                  "We understand your laboratory, diagnostic and healthcare requirements to identify the right solution.",
              },
              {
                number: "02",
                title: "Solution & Implementation",
                description:
                  "Our team helps with equipment selection, delivery, installation and implementation according to your needs.",
              },
              {
                number: "03",
                title: "Support & Maintenance",
                description:
                  "We continue to support your equipment with technical assistance and maintenance guidance.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
              >

                <span className="text-6xl font-black text-cyan-100">
                  {item.number}
                </span>

                <h3 className="mt-5 text-2xl font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <CTASection />

    </>
  );
}