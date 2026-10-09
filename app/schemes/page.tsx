"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  IndianRupee,
  Search,
  Users,
  Wheat,
  X,
} from "lucide-react";

interface SchemeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  eligibility: string;
  documents: string[];
}

const SCHEMES_DATA: SchemeItem[] = [
  {
    id: "kisan-krishi",
    title: "किसान एवं कृषि कल्याण योजनाएँ",
    description: "किसानों के लिए कृषि उपकरण सहायता, सिंचाई सुविधाएं, फसल सुरक्षा और अनुदान संबंधी योजनाओं की जानकारी।",
    category: "कृषि",
    icon: Wheat,
    eligibility: "किसान एवं कृषि भूमि धारक",
    documents: ["भू-अभिलेख / खसरा खतौनी", "बैंक पासबुक", "आधार कार्ड"],
  },
  {
    id: "shiksha-chhatra",
    title: "शिक्षा एवं छात्रवृत्ति योजनाएँ",
    description: "विद्यार्थियों के लिए उच्च शिक्षा सहायता, छात्रवृत्ति, तकनीकी प्रशिक्षण एवं प्रतियोगी परीक्षा सहायता।",
    category: "शिक्षा",
    icon: GraduationCap,
    eligibility: "अध्ययनरत छात्र एवं छात्राएं",
    documents: ["शैक्षणिक प्रमाण पत्र", "आय प्रमाण पत्र", "मूल निवासी प्रमाण पत्र"],
  },
  {
    id: "swasthya-kalyan",
    title: "स्वास्थ्य एवं परिवार कल्याण",
    description: "मुफ्त अथवा रियायती उपचार, जन आरोग्य योजना, मातृ-शिशु सुरक्षा एवं जीवनरक्षक स्वास्थ्य सहायता।",
    category: "स्वास्थ्य",
    icon: HeartPulse,
    eligibility: "सभी पात्र परिवार एवं नागरिक",
    documents: ["राशन कार्ड", "आधार कार्ड", "परिवार समग्र/पहचान पत्र"],
  },
  {
    id: "aawas-sahayata",
    title: "आवास एवं सामाजिक सुरक्षा",
    description: "पक्का मकान निर्माण सहायता, ग्रामीण एवं शहरी आवास योजना, वृद्धावस्था व दिव्यांग पेंशन।",
    category: "आवास",
    icon: Home,
    eligibility: "आवासहीन अथवा कच्चे मकान धारक परिवार",
    documents: ["निवास प्रमाण पत्र", "आय प्रमाण पत्र", "आधार कार्ड"],
  },
  {
    id: "mahila-bal",
    title: "महिला एवं बाल विकास",
    description: "बालिकाओं की शिक्षा, पोषण आहार, मातृत्व सहायता तथा महिला स्व-सहायता समूह प्रोत्साहन।",
    category: "महिला एवं बाल",
    icon: Users,
    eligibility: "महिलाएं, बालिकाएं एवं धात्री माताएं",
    documents: ["जन्म प्रमाण पत्र", "बैंक खाता विवरण", "आधार कार्ड"],
  },
  {
    id: "rozgar-kaushal",
    title: "रोजगार एवं स्वरोजगार प्रोत्साहन",
    description: "कौशल विकास प्रशिक्षण, युवा स्वरोजगार ऋण योजना, मुद्रा ऋण तथा उद्यम स्थापना में सहयोग।",
    category: "रोजगार",
    icon: IndianRupee,
    eligibility: "18 से 45 वर्ष के बेरोजगार युवा एवं उद्यमी",
    documents: ["शैक्षणिक योग्यता प्रमाण पत्र", "प्रोजेक्ट रिपोर्ट", "आधार व पैन"],
  },
];

const CATEGORIES = ["सभी", "कृषि", "शिक्षा", "स्वास्थ्य", "आवास", "महिला एवं बाल", "रोजगार"];

export default function SchemesPage() {
  const [selectedCategory, setSelectedCategory] = useState("सभी");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalScheme, setActiveModalScheme] = useState<SchemeItem | null>(null);

  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATA.filter((scheme) => {
      const matchesCategory =
        selectedCategory === "सभी" || scheme.category === selectedCategory;
      const matchesSearch =
        scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <FileText size={15} />
              <span>कल्याणकारी योजनाओं का सूचना केंद्र</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl lg:text-5xl">
              नागरिक कल्याणकारी <span className="text-orange-600">योजनाएँ</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Jan Connect पोर्टल पर विभिन्न क्षेत्रों से संबंधित जनकल्याणकारी योजनाओं की पात्रता, आवश्यक दस्तावेज और आवेदन प्रक्रिया की प्रामाणिक जानकारी एक स्थान पर प्राप्त करें।
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTER & SEARCH BAR
      ====================================================== */}
      <section className="sticky top-[69px] z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-blue-900 text-white shadow-xs"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="योजना खोजें..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SCHEMES GRID
      ====================================================== */}
      <section className="bg-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              कुल {filteredSchemes.length} योजना श्रेणियाँ उपलब्ध
            </p>
          </div>

          {filteredSchemes.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                आपकी खोज के अनुसार कोई योजना नहीं मिली।
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("सभी");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-bold text-blue-900 underline"
              >
                सभी योजनाएं पुनः देखें
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSchemes.map((scheme) => {
                const Icon = scheme.icon;
                return (
                  <div
                    key={scheme.id}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                          <Icon size={22} />
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                          {scheme.category}
                        </span>
                      </div>

                      <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-900">
                        {scheme.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-slate-600">
                        {scheme.description}
                      </p>

                      <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs">
                        <p className="font-semibold text-slate-700">
                          पात्रता: <span className="font-normal text-slate-600">{scheme.eligibility}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveModalScheme(scheme)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-orange-600 transition"
                      >
                        <span>दस्तावेज एवं विवरण देखें</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          SCHEME DETAILS MODAL
      ====================================================== */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="rounded bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                  {activeModalScheme.category}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {activeModalScheme.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalScheme(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-800">विवरण / Description:</p>
                <p className="mt-1 leading-relaxed text-slate-600">{activeModalScheme.description}</p>
              </div>

              <div>
                <p className="font-bold text-slate-800">पात्रता / Eligibility:</p>
                <p className="mt-1 text-slate-600">{activeModalScheme.eligibility}</p>
              </div>

              <div>
                <p className="font-bold text-slate-800">आवश्यक दस्तावेज / Required Documents:</p>
                <ul className="mt-2 space-y-1.5 list-disc pl-4 text-slate-600">
                  {activeModalScheme.documents.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md bg-amber-50 p-3 border border-amber-200 text-amber-900">
                <p className="font-semibold">महत्वपूर्ण सूचना:</p>
                <p className="mt-0.5 text-[11px] text-amber-800">
                  आवेदन करने से पहले संबंधित विभाग की आधिकारिक वेबसाइट अथवा निकटतम सेवा केंद्र से शर्तों की पुष्टि अवश्य करें।
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalScheme(null)}
                className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PRE-APPLICATION GUIDELINES
      ====================================================== */}
      <section className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                महत्वपूर्ण निर्देश
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                योजना में आवेदन करने से पहले
              </h2>

              <p className="mt-4 text-xs leading-6 text-slate-600 sm:text-sm">
                किसी भी कल्याणकारी योजना का लाभ उठाने के लिए सही दस्तावेज और आधिकारिक प्रक्रिया की जानकारी होना आवश्यक है। धोखाधड़ी या अनुचित दावों से सावधान रहें।
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-xs">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                      पात्रता की पूर्व-जाँच करें
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      आयु सीमा, आय सीमा व क्षेत्र संबंधित शर्तों की पुष्टि करें।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                      आवश्यक दस्तावेज अद्यतन रखें
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      आधार कार्ड, मोबाइल लिंक, बैंक खाता व आय प्रमाण पत्र सक्रिय रखें।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                      आधिकारिक स्रोत से ही आवेदन करें
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      अधिकृत सरकारी सेवा केंद्रों (CSC/MP Online) अथवा अधिकृत पोर्टलों से ही आवेदन करें।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-blue-950 py-12 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Jan Connect से जुड़े रहें
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-blue-100 sm:text-sm">
            नागरिक पंजीयन करके अपने क्षेत्र से संबंधित नवीनतम योजनाओं और नागरिक सुविधाओं की सूचना प्राप्त करें।
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-orange-700 shadow-md"
            >
              नागरिक पंजीयन करें
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-700 bg-blue-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              सहायता केंद्र से संपर्क करें
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}