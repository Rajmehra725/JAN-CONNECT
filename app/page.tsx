import Link from "next/link";
import {
  ArrowRight,
  FileText,
  LogIn,
  UserPlus,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-linear-to-b from-slate-50 via-white to-blue-50/20 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-bold text-orange-700">
              <Sparkles size={14} className="text-orange-600" />
              <span>नागरिकों से सीधा डिजिटल संपर्क</span>
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-5xl leading-tight">
              आपकी आवाज़,{" "}
              <span className="text-blue-900">आपका कनेक्शन</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              <strong>Jan Connect</strong> एक डिजिटल नागरिक संपर्क एवं जनसूचना मंच है, जहाँ नागरिक पंजीकरण, सार्वजनिक सेवाओं, महत्वपूर्ण सूचनाओं और कल्याणकारी योजनाओं की जानकारी एक ही सुव्यवस्थित स्थान पर प्राप्त कर सकते हैं।
            </p>

            {/* Hero Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-700 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <UserPlus size={18} />
                <span>नागरिक पंजीकरण (Citizen Registration)</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/login/citizen"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-900 bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-xs transition hover:bg-blue-50 hover:border-blue-950 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
              >
                <LogIn size={18} />
                <span>नागरिक लॉगिन (Login)</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>सरल एवं सुरक्षित पंजीकरण</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>सार्वजनिक सूचनाओं का केंद्र</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>भूमिका आधारित सुरक्षित डैशबोर्ड</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Information Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              {/* Card Header */}
              <div className="border-b border-slate-100 bg-linear-to-r from-blue-900 to-blue-950 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-orange-400 backdrop-blur-xs">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-300">
                      JAN CONNECT PORTAL
                    </p>
                    <h2 className="text-lg font-bold text-white">
                      नागरिक सुविधा केंद्र
                    </h2>
                  </div>
                </div>
              </div>

              {/* Card Content Features */}
              <div className="space-y-3.5 p-6 bg-slate-50/50">
                <Link
                  href="/register"
                  className="group flex items-center gap-4 rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-900 transition group-hover:bg-blue-900 group-hover:text-white">
                    <UserPlus size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-900">
                      नागरिक पंजीयन (Registration)
                    </p>
                    <p className="text-xs text-slate-500">
                      अपना डिजिटल नागरिक प्रोफाइल बनाएं
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  href="/services"
                  className="group flex items-center gap-4 rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs transition hover:border-orange-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-orange-700">
                      सार्वजनिक सेवाएँ (Services)
                    </p>
                    <p className="text-xs text-slate-500">
                      उपलब्ध नागरिक सेवाओं की जानकारी
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  href="/notices"
                  className="group flex items-center gap-4 rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                    <Bell size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                      नवीनतम सूचनाएँ (Latest Notices)
                    </p>
                    <p className="text-xs text-slate-500">
                      महत्वपूर्ण घोषणाएँ एवं सार्वजनिक अपडेट्स
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>

              {/* Bottom Card Footer */}
              <div className="border-t border-slate-100 bg-slate-100/70 px-6 py-3 text-center">
                <p className="text-[11px] text-slate-500">
                  डिजिटल नागरिक सहभागिता एवं सेवा पोर्टल
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK SERVICES
      ====================================================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                QUICK ACCESS / त्वरित सेवाएँ
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-950">
                प्रमुख नागरिक सुविधाएँ
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                नागरिकों के लिए उपलब्ध प्रमुख सेवाओं और सूचनाओं तक त्वरित एवं आसान पहुँच।
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-900 hover:text-orange-600 transition"
            >
              <span>सभी सेवाएँ देखें</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Registration */}
            <Link
              href="/register"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-900 transition group-hover:bg-blue-900 group-hover:text-white">
                <UserPlus size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900">
                नागरिक पंजीकरण
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                अपना संपूर्ण नागरिक प्रोफाइल बनाएं और सेवाओं का लाभ उठाएं।
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-orange-600">
                <span>पंजीयन प्रारंभ करें</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Public Services */}
            <Link
              href="/services"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-700">
                सार्वजनिक सेवाएँ
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                क्षेत्रीय एवं सार्वजनिक सेवाओं की विस्तृत जानकारी एवं मार्गदर्शन।
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-orange-600">
                <span>सेवा विवरण देखें</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Schemes */}
            <Link
              href="/schemes"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800">
                योजनाओं की जानकारी
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                कृषि, स्वास्थ्य, शिक्षा एवं आवास से संबंधित कल्याणकारी योजनाएं।
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-orange-600">
                <span>योजना सूची देखें</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Notices */}
            <Link
              href="/notices"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-700 transition group-hover:bg-purple-700 group-hover:text-white">
                <Bell size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700">
                सूचनाएँ एवं घोषणाएँ
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                समय-समय पर जारी की जाने वाली आधिकारिक सूचनाएं और सार्वजनिक निर्देश।
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-orange-600">
                <span>सूचना बुलेटिन</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          LATEST NOTICES HIGHLIGHT
      ====================================================== */}
      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                UPDATES & ANNOUNCEMENTS
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-blue-950">
                नवीनतम सूचनाएँ (Latest Notices)
              </h2>
            </div>
            <Link
              href="/notices"
              className="hidden font-bold text-sm text-blue-900 hover:text-orange-600 md:flex items-center gap-1 transition"
            >
              <span>सभी सूचनाएँ देखें</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {[
              {
                text: "नागरिक पंजीकरण सेवा पोर्टल पर सुचारू रूप से उपलब्ध है।",
                category: "पंजीकरण",
              },
              {
                text: "सार्वजनिक सेवाओं और कल्याणकारी योजनाओं की अद्यतन सूची यहाँ प्रकाशित की जाएगी।",
                category: "सेवाएँ",
              },
              {
                text: "समय पर सूचना प्राप्त करने हेतु पोर्टल पर नियमित रूप से नज़र रखें।",
                category: "सामान्य",
              },
              {
                text: "जनप्रतिनिधि एवं बूथ स्तर के अधिकृत डैशबोर्ड्स आगामी चरण में जोड़े जा रहे हैं।",
                category: "अपडेट",
              },
            ].map((notice, index) => (
              <Link
                href="/notices"
                key={index}
                className="group flex items-center justify-between p-5 transition hover:bg-blue-50/40"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-100 text-xs font-black text-orange-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 mr-2">
                      {notice.category}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-900">
                      {notice.text}
                    </span>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-1 transition ml-4"
                />
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link
              href="/notices"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-900"
            >
              <span>सभी सूचनाएँ देखें</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
            HOW IT WORKS / सरल प्रक्रिया
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-950">
            Jan Connect का उपयोग कैसे करें?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            तीन आसान चरणों में Jan Connect पोर्टल से जुड़ें और उपलब्ध डिजिटल सुविधाओं का लाभ प्राप्त करें।
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-900 text-lg font-black text-white shadow-xs">
                01
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                1. पंजीकरण (Register)
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                अपना मोबाइल नंबर दर्ज करके बुनियादी नागरिक जानकारी और पता भरें।
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-orange-600 text-lg font-black text-white shadow-xs">
                02
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                2. जानकारी देखें (Explore)
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                सार्वजनिक सेवाओं, सूचनाओं और सरकारी योजनाओं की प्रामाणिक जानकारी प्राप्त करें।
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-700 text-lg font-black text-white shadow-xs">
                03
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                3. संपर्क करें (Connect)
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                आवश्यकता पड़ने पर सहायता केंद्र अथवा अधिकृत जनप्रतिनिधि कार्यालय से संवाद करें।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA BANNER
      ====================================================== */}
      <section className="bg-linear-to-r from-blue-950 via-blue-900 to-slate-900 py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div>
            <span className="rounded bg-orange-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-300">
              JAN CONNECT
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              आज ही Jan Connect से जुड़ें
            </h2>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              अपना नागरिक प्रोफाइल बनाएं और नागरिक सेवाओं तथा महत्वपूर्ण सूचनाओं तक तुरंत पहुँच प्राप्त करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-700"
            >
              <UserPlus size={18} />
              <span>पंजीकरण करें (Register Now)</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              <span>सहायता केंद्र</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}