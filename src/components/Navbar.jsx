"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Phone,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname() || "/";

  // =========================================================
  // DISTRICT ROUTING
  // =========================================================

  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Products",
      path: "/items",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  // =========================================================
  // ACTIVE LINK
  // =========================================================

  const isActive = (path) => {
    const href = makeLink(path);

    if (path === "/") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 w-full">

        {/* Glass Background */}

        <div className="border-b border-slate-200/70 bg-white/90 shadow-[0_4px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl">

          <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              href={makeLink("/")}
              onClick={closeMenu}
              className="group flex items-center gap-3"
            >

              <Image
                src="/logo.png"
                alt="Raj Biosis Private Limited - Biomedical & Healthcare Solutions"
                width={200}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />

            </Link>

            {/* =================================================
                DESKTOP NAV
            ================================================== */}

            <nav className="hidden items-center lg:flex">

              <div className="flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50/70 p-1.5">

                {navLinks.map((link) => {
                  const active = isActive(link.path);

                  return (
                    <Link
                      key={link.name}
                      href={makeLink(link.path)}
                      className={`relative rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${active
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:bg-white/80 hover:text-indigo-700"
                        }`}
                    >
                      {link.name}

                      {active && (
                        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-600" />
                      )}
                    </Link>
                  );
                })}

              </div>

            </nav>

            {/* =================================================
                RIGHT ACTIONS
            ================================================== */}

            <div className="hidden items-center gap-3 lg:flex">

              {/* Contact / Phone */}

              <Link
                href={makeLink("/contact")}
                className="group hidden xl:flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-indigo-100">
                  <Phone size={15} />
                </div>

                <div className="text-left">

                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Need Help?
                  </p>

                  <p className="text-xs font-bold">
                    Contact Us
                  </p>

                </div>

              </Link>

              {/* CTA */}

              <Link
                href={makeLink("/contact")}
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-cyan-600/20"
              >

                <span>
                  Get Quote
                </span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/20">
                  <ArrowRight size={14} />
                </span>

              </Link>

            </div>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              onClick={() =>
                setMenuOpen((prev) => !prev)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 lg:hidden"
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

          </div>

        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <div
          className={`overflow-hidden border-b border-slate-200 bg-white shadow-xl transition-all duration-300 lg:hidden ${menuOpen
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
            }`}
        >

          <div className="mx-auto max-w-7xl px-5 pb-6 pt-4 sm:px-6">

            {/* Mobile Badge */}

            <div className="mb-4 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-xs font-semibold text-indigo-700">

              <Sparkles size={15} />

              Advanced Biomedical Solutions

            </div>

            {/* Mobile Links */}

            <nav className="flex flex-col gap-1">

              {navLinks.map((link) => {
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.name}
                    href={makeLink(link.path)}
                    onClick={closeMenu}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-700"
                      }`}
                  >

                    <span>
                      {link.name}
                    </span>

                    <ArrowRight
                      size={16}
                      className={
                        active
                          ? "text-indigo-600"
                          : "text-slate-300"
                      }
                    />

                  </Link>
                );
              })}

            </nav>

            {/* Mobile CTA */}

            <Link
              href={makeLink("/contact")}
              onClick={closeMenu}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
            >

              Get a Quote

              <ArrowRight size={17} />

            </Link>

          </div>

        </div>

      </header>
    </>
  );
}