"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export default function CTASection({ city }) {

  const pathname = usePathname();

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
    "enquiry",
  ];

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const urlDistrict =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const districtSlug = city
    ? city.toLowerCase().replace(/\s+/g, "-")
    : urlDistrict;

  const makeLink = (path) => {
    if (!districtSlug) return path;

    if (path === "/") {
      return `/${districtSlug}`;
    }

    return `/${districtSlug}${path}`;
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white via-slate-50 to-cyan-50/30">
      <div className="container-custom">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="relative overflow-hidden rounded-[42px] bg-gradient-to-r from-slate-900 via-cyan-900 to-cyan-700 p-10 lg:p-20 text-white shadow-[0_30px_80px_rgba(8,145,178,0.25)]"
        >

          {/* Background Effects */}
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-[120px]" />

          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-white/10 blur-[140px]" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>

              <span className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-100 mb-6">
                Get In Touch
              </span>

              <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight">
                Need Premium
                <br />
                Biomedical Solutions?
              </h2>

              <p className="mt-7 text-lg leading-8 text-slate-200 max-w-xl">
                Discover innovative diagnostic systems and trusted
                biomedical technologies designed for hospitals,
                laboratories, research centers and modern healthcare
                professionals.
              </p>

              {/* Highlights */}

              <div className="grid sm:grid-cols-2 gap-4 mt-10">

                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-5">

                  <h4 className="font-semibold text-white">
                    ✔ Premium Equipment
                  </h4>

                  <p className="mt-2 text-sm text-slate-200">
                    Trusted diagnostic systems with high precision.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-5">

                  <h4 className="font-semibold text-white">
                    ✔ Expert Consultation
                  </h4>

                  <p className="mt-2 text-sm text-slate-200">
                    Dedicated biomedical engineers for complete support.
                  </p>

                </div>

              </div>

            </div>

            {/* Right Card */}
            <div className="flex lg:justify-end">

              <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-[0_25px_60px_rgba(15,23,42,0.18)] border border-cyan-100">

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">

                  <PhoneCall size={30} />

                </div>

                <h3 className="text-3xl font-bold text-slate-900">
                  Let's Talk
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  Connect with our biomedical specialists for product
                  consultation, laboratory setup, installation and
                  after-sales support.
                </p>

                <div className="mt-8 space-y-4">

                  <Link
                    href={makeLink("/contact")}
                    className="block"
                  >
                    <button className="w-full rounded-2xl bg-slate-900 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-700 flex items-center justify-center gap-2">

                      Contact Us

                      <ArrowRight size={18} />

                    </button>
                  </Link>

                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center rounded-2xl border border-cyan-200 py-4 font-semibold text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-50"
                  >
                    Call Now
                  </a>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}