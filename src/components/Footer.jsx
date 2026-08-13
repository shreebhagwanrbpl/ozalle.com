"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);

  const pathname = usePathname();

  // =========================================================
  // GET DISTRICT FROM URL
  // =========================================================

  const pathParts = pathname
    ? pathname.split("/").filter(Boolean)
    : [];

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  // =========================================================
  // LOAD CONTACT INFORMATION
  // =========================================================

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "ozallecom",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          const data = snap.data();

          console.log("CONTACT FIREBASE DATA:", data);

          /*
            contactInfo expected example:

            contactInfo: [
              {
                label: "Phone Number",
                value: "9876543210"
              },
              {
                label: "Email Address",
                value: "info@example.com"
              },
              {
                label: "Office Address",
                value: "Jaipur, Rajasthan"
              }
            ]
          */

          setContactInfo(
            Array.isArray(data.contactInfo)
              ? data.contactInfo
              : []
          );
        }
      } catch (error) {
        console.error(
          "Error loading contact information:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  // =========================================================
  // LOAD DISTRICT DATA
  // =========================================================

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) {
        setDistrictData(null);
        return;
      }

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "ozallecom",
            "districts",
            district
          )
        );

        if (snap.exists()) {
          const data = snap.data();

          console.log(
            "DISTRICT FIREBASE DATA:",
            data
          );

          setDistrictData(data);
        }
      } catch (error) {
        console.error(
          "Error loading district:",
          error
        );
      }
    };

    loadDistrict();
  }, [district]);

  // =========================================================
  // NORMALIZE CONTACT DATA
  // =========================================================

  const normalize = (value = "") => {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");
  };

  // =========================================================
  // GET VALUE FROM CONTACT ARRAY
  // =========================================================

  const getContactValue = (types = []) => {
    if (!Array.isArray(contactInfo)) return "";

    const normalizedTypes = types.map(normalize);

    const item = contactInfo.find((contact) => {
      if (!contact) return false;

      const label = normalize(
        contact.label ||
        contact.name ||
        contact.title ||
        contact.type ||
        contact.key ||
        ""
      );

      // EXACT MATCH ONLY
      return normalizedTypes.includes(label);
    });

    if (!item) return "";

    return String(
      item.value ??
      item.content ??
      item.text ??
      item.data ??
      ""
    ).trim();
  };

  // =========================================================
  // CONTACT VALUES
  // =========================================================

  const phone =
    getContactValue([
      "phone",
      "phone number",
      "mobile",
      "mobile number",
      "contact number",
      "telephone",
      "tel",
    ]) || "";

  const email =
    getContactValue([
      "email",
      "email address",
      "email id",
      "mail",
      "mail address",
    ]) || "";

  const firebaseAddress =
    getContactValue([
      "address",
      "office",
      "office address",
      "office location",
      "location",
      "company address",
      "business address",
    ]) || "";

  // =========================================================
  // DISTRICT ADDRESS
  // =========================================================

  const districtName =
    districtData?.district ||
    districtData?.name ||
    districtData?.city ||
    "";

  const districtState =
    districtData?.state ||
    districtData?.stateName ||
    "India";

  const districtAddress =
    districtName
      ? `${districtName}, ${districtState}, India`
      : "";

  const dynamicAddress =
    districtAddress ||
    firebaseAddress ||
    "India";

  // =========================================================
  // ROUTING
  // =========================================================

  const makeLink = (path) => {
    if (!district) {
      return path;
    }

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {[...Array(4)].map((_, index) => (
              <div key={index}>

                <div className="mb-6 h-7 w-40 animate-pulse rounded-lg bg-slate-200" />

                {[...Array(4)].map((_, item) => (
                  <div
                    key={item}
                    className="mb-4 h-4 w-full animate-pulse rounded bg-slate-100"
                  />
                ))}

              </div>
            ))}

          </div>

          <div className="mt-12 border-t border-slate-200 pt-6">
            <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>

        </div>
      </footer>
    );
  }

  // =========================================================
  // FOOTER
  // =========================================================

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">

      {/* Background decoration */}

      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-50 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-sky-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

        {/* =================================================
            MAIN FOOTER GRID
        ================================================== */}

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">

          {/* =================================================
              BRAND
          ================================================== */}

          <div>

            <Link
              href={makeLink("/")}
              className="inline-block"
            >
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Rajbiosis{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
                  Private Limited
                </span>
              </h2>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
              Delivering trusted diagnostic and biomedical
              solutions with innovation, quality and precision
              for modern healthcare facilities.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Trusted Biomedical Solutions
            </div>

          </div>

          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <div>

            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Quick Links
            </h3>

            <div className="mt-6 flex flex-col gap-4">

              <Link
                href={makeLink("/")}
                className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600"
              >
                <ArrowRight
                  size={14}
                  className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
                Home
              </Link>

              <Link
                href={makeLink("/about")}
                className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600"
              >
                <ArrowRight
                  size={14}
                  className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
                About Us
              </Link>

              <Link
                href={makeLink("/services")}
                className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600"
              >
                <ArrowRight
                  size={14}
                  className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
                Services
              </Link>

              <Link
                href={makeLink("/items")}
                className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600"
              >
                <ArrowRight
                  size={14}
                  className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
                Products
              </Link>

              <Link
                href={makeLink("/contact")}
                className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600"
              >
                <ArrowRight
                  size={14}
                  className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
                Contact
              </Link>

            </div>

          </div>

          {/* =================================================
              SERVICES
          ================================================== */}

          <div>

            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Our Services
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-slate-600">

              <p className="transition hover:text-indigo-600">
                Diagnostic Equipment
              </p>

              <p className="transition hover:text-indigo-600">
                Laboratory Solutions
              </p>

              <p className="transition hover:text-indigo-600">
                Biomedical Instruments
              </p>

              <p className="transition hover:text-indigo-600">
                Laboratory Automation
              </p>

              <p className="transition hover:text-indigo-600">
                Maintenance Support
              </p>

            </div>

          </div>

          {/* =================================================
              CONTACT
          ================================================== */}

          <div>

            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5">

              {/* ADDRESS */}

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={18} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Office Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {dynamicAddress}
                  </p>

                </div>

              </div>

              {/* PHONE */}

              {phone && (
                <a
                  href={`tel:${String(phone).replace(/\s+/g, "")}`}
                  className="flex items-center gap-4 group"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Phone size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 transition group-hover:text-indigo-600">
                      {phone}
                    </p>

                  </div>

                </a>
              )}

              {/* EMAIL */}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 group"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-slate-700 transition group-hover:text-indigo-600">
                      {email}
                    </p>

                  </div>

                </a>
              )}

              {/* FALLBACK */}

              {!phone && !email && !firebaseAddress && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Contact information will be updated soon.
                </div>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            BOTTOM
        ================================================== */}

        <div className="mt-14 border-t border-slate-200 pt-7">

          <div className="flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

            <p>
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-slate-700">
                Central Biomedicals
              </span>
              . All rights reserved.
            </p>

            <p>
              Designed with precision for modern diagnostics.
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}