"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  ArrowRight,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import CTASection from "@/components/CTASection";

export default function ContactPage() {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);
  const [contactInfo, setContactInfo] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  /*
  |--------------------------------------------------------------------------
  | DISTRICT
  |--------------------------------------------------------------------------
  */

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "products",
    "contact",
  ];

  const currentDistrict =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  /*
  |--------------------------------------------------------------------------
  | LOAD CONTACT DATA
  |--------------------------------------------------------------------------
  */

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

          console.log(
            "CONTACT FIREBASE DATA:",
            data.contactInfo
          );

          setContactInfo(
            Array.isArray(data.contactInfo)
              ? data.contactInfo
              : []
          );
        }
      } catch (error) {
        console.error(
          "Contact loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD DISTRICT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadDistrict = async () => {
      if (!currentDistrict) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "ozallecom",
            "districts",
            currentDistrict
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (error) {
        console.error(
          "District loading error:",
          error
        );
      }
    };

    loadDistrict();
  }, [currentDistrict]);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const normalizeValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "string") {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (
            typeof item === "string" ||
            typeof item === "number"
          ) {
            return String(item);
          }

          if (
            item &&
            typeof item === "object"
          ) {
            return (
              item.value ||
              item.label ||
              item.name ||
              ""
            );
          }

          return "";
        })
        .filter(Boolean)
        .join(", ");
    }

    if (typeof value === "object") {
      return (
        value.value ||
        value.label ||
        value.name ||
        ""
      );
    }

    return String(value);
  };

  const getValueByLabel = (labels) => {
    const item = contactInfo.find((item) => {
      const label = String(
        item?.label || ""
      )
        .trim()
        .toLowerCase();

      return labels.some(
        (x) =>
          label === x.toLowerCase()
      );
    });

    return normalizeValue(item?.value);
  };

  /*
  |--------------------------------------------------------------------------
  | PHONE
  |--------------------------------------------------------------------------
  */

  const rawPhone =
    getValueByLabel([
      "Phone Number",
      "Phone",
      "Mobile Number",
      "Contact Number",
    ]);

  /*
   * Firebase value array/object ko safely string
   * mein convert kar raha hai.
   */
  const phone = normalizeValue(rawPhone);

  /*
  |--------------------------------------------------------------------------
  | EMAIL
  |--------------------------------------------------------------------------
  */

  const emailRegex =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

  let email = "";

  /*
   * Pehle proper Email Address label search karo.
   */
  const emailItem = contactInfo.find(
    (item) => {
      const label = String(
        item?.label || ""
      )
        .trim()
        .toLowerCase();

      return (
        label === "email address" ||
        label === "email" ||
        label === "email id"
      );
    }
  );

  const emailCandidate =
    normalizeValue(
      emailItem?.value
    );

  /*
   * Sirf tab email accept hoga jab usme
   * actual email address ho.
   */
  const emailMatch =
    emailCandidate.match(emailRegex);

  if (emailMatch) {
    email = emailMatch[0];
  }

  /*
   * Agar Email field galat data contain kar rahi ho,
   * to contactInfo ke andar kisi valid email ko
   * automatically find kar lega.
   */
  if (!email) {
    for (const item of contactInfo) {
      const value = normalizeValue(
        item?.value
      );

      const match =
        value.match(emailRegex);

      if (match) {
        email = match[0];
        break;
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ADDRESS
  |--------------------------------------------------------------------------
  */

  const firebaseAddress =
    getValueByLabel([
      "Office Address",
      "Address",
      "Office",
      "Location",
    ]);

  /*
  |--------------------------------------------------------------------------
  | WORKING HOURS
  |--------------------------------------------------------------------------
  */

  const hours =
    getValueByLabel([
      "Working Hours",
      "Working Hour",
      "Business Hours",
    ]);

  /*
  |--------------------------------------------------------------------------
  | DISTRICT ADDRESS
  |--------------------------------------------------------------------------
  */

  const dynamicAddress =
    districtData?.district
      ? `${districtData.district}, ${districtData.state || ""
      }, India`
      : firebaseAddress;

  /*
  |--------------------------------------------------------------------------
  | PHONE CLEAN
  |--------------------------------------------------------------------------
  */

  const phoneHref = phone
    ? phone.replace(/[^\d+]/g, "")
    : "";

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

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

    if (!form.message.trim()) {
      return toast.error(
        "Message is required"
      );
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "ozallecom",
          "contactQueries"
        ),
        {
          ...form,
          createdAt: new Date(),
        }
      );

      toast.success(
        "Message submitted successfully"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
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

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <>
        <PageBanner
          title="Contact Us"
          subtitle="Get in touch with Central Biomedicals for premium diagnostic and biomedical solutions."
        />

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-14">

              <div>
                <div className="h-8 w-52 bg-slate-200 rounded animate-pulse" />

                <div className="h-12 w-96 bg-slate-200 rounded mt-5 animate-pulse" />

                <div className="space-y-5 mt-10">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-28 bg-slate-100 rounded-[28px] animate-pulse"
                      />
                    )
                  )}
                </div>
              </div>

              <div className="h-[650px] bg-slate-100 rounded-[40px] animate-pulse" />

            </div>
          </div>
        </section>
      </>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* PAGE BANNER */}

      <PageBanner
        title="Contact Us"
        subtitle="Get in touch with Central Biomedicals for premium diagnostic and biomedical solutions."
      />

      {/* CONTACT */}

      <section className="section-padding bg-white">
        <div className="container-custom">

          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* LEFT */}

            <div>

              <span className="inline-flex items-center bg-sky-100 text-sky-700 px-5 py-2 rounded-full font-semibold">
                Contact Information
              </span>

              <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Let’s Start a Conversation
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600 max-w-xl">
                Reach out to our team for
                biomedical equipment,
                laboratory solutions,
                healthcare consultation,
                and technical support.
              </p>

              {/* CONTACT CARDS */}

              <div className="space-y-5 mt-10">

                {/* PHONE */}

                <div className="group flex items-start gap-5 p-6 rounded-[28px] border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-sky-200 transition-all duration-300">

                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-sky-700 group-hover:text-white transition">
                    <Phone size={24} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    {phone ? (
                      <a
                        href={`tel:${phoneHref}`}
                        className="block mt-2 text-lg font-semibold text-slate-900 hover:text-sky-700 break-words"
                      >
                        {phone}
                      </a>
                    ) : (
                      <p className="mt-2 text-slate-400">
                        Phone number not available
                      </p>
                    )}

                  </div>
                </div>

                {/* EMAIL */}

                <div className="group flex items-start gap-5 p-6 rounded-[28px] border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-sky-200 transition-all duration-300">

                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-sky-700 group-hover:text-white transition">
                    <Mail size={24} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Email
                    </p>

                    {email ? (
                      <a
                        href={`mailto:${email}`}
                        className="block mt-2 text-lg font-semibold text-slate-900 hover:text-sky-700 break-all"
                      >
                        {email}
                      </a>
                    ) : (
                      <p className="mt-2 text-slate-400">
                        Email address not available
                      </p>
                    )}

                  </div>
                </div>

                {/* ADDRESS */}

                <div className="group flex items-start gap-5 p-6 rounded-[28px] border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-sky-200 transition-all duration-300">

                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-sky-700 group-hover:text-white transition">
                    <MapPin size={24} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Office Address
                    </p>

                    <p className="mt-2 text-lg font-semibold text-slate-900 leading-7">
                      {dynamicAddress ||
                        "Address not available"}
                    </p>

                  </div>
                </div>

                {/* HOURS */}

                <div className="group flex items-start gap-5 p-6 rounded-[28px] border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-sky-200 transition-all duration-300">

                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-sky-700 group-hover:text-white transition">
                    <Clock3 size={24} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Working Hours
                    </p>

                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {hours ||
                        "Mon - Sat (10AM - 6PM)"}
                    </p>

                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT FORM */}

            <div className="sticky top-28 bg-white rounded-[36px] p-7 lg:p-10 border border-slate-100 shadow-[0_25px_80px_rgba(15,23,42,0.10)]">

              <div>

                <span className="text-sm font-semibold text-sky-700 uppercase tracking-wider">
                  Get In Touch
                </span>

                <h3 className="mt-3 text-3xl lg:text-4xl font-bold text-slate-900">
                  Send Us a Message
                </h3>

                <p className="text-slate-500 mt-3 leading-7">
                  Tell us what you need and
                  our team will get back to you
                  shortly.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100 transition"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100 transition"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(
                        /\D/g,
                        ""
                      ),
                    })
                  }
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100 transition"
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100 transition"
                />

                <textarea
                  rows={5}
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100 transition resize-none"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-sky-700 transition disabled:opacity-60"
                >
                  {submitting
                    ? "Submitting..."
                    : "Send Message"}

                  {!submitting && (
                    <ArrowRight size={18} />
                  )}
                </button>

              </form>

            </div>

          </div>
        </div>
      </section>

      {/* MAP */}

      {dynamicAddress && (
        <section className="pb-24 bg-white">
          <div className="container-custom">

            <div className="mb-8">
              <span className="text-sm font-semibold text-sky-700 uppercase tracking-wider">
                Find Us
              </span>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Our Location
              </h2>
            </div>

            <div className="rounded-[36px] overflow-hidden border border-slate-200 shadow-xl">

              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  dynamicAddress
                )}&z=13&output=embed`}
                width="100%"
                height="500"
                loading="lazy"
                className="border-0 w-full"
              />

            </div>

          </div>
        </section>
      )}

      {/* CTA */}

      <CTASection />
    </>
  );
}