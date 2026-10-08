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
  ShieldCheck,
  Users,
  Wheat,
} from "lucide-react";

const schemes = [
  {
    title: "किसान एवं कृषि योजनाएँ",
    description:
      "किसानों के लिए कृषि, सिंचाई, बीज, सहायता एवं अन्य संबंधित योजनाओं की जानकारी।",
    icon: Wheat,
    category: "कृषि",
  },
  {
    title: "शिक्षा एवं छात्र योजनाएँ",
    description:
      "विद्यार्थियों के लिए छात्रवृत्ति, शिक्षा सहायता और अन्य शैक्षणिक योजनाओं की जानकारी।",
    icon: GraduationCap,
    category: "शिक्षा",
  },
  {
    title: "स्वास्थ्य एवं परिवार कल्याण",
    description:
      "स्वास्थ्य सुविधाओं, उपचार सहायता और परिवार कल्याण से जुड़ी योजनाओं की जानकारी।",
    icon: HeartPulse,
    category: "स्वास्थ्य",
  },
  {
    title: "आवास एवं सामाजिक सहायता",
    description:
      "आवास, सामाजिक सुरक्षा और जरूरतमंद नागरिकों के लिए उपलब्ध सहायता योजनाएँ।",
    icon: Home,
    category: "आवास",
  },
  {
    title: "महिला एवं बाल कल्याण",
    description:
      "महिलाओं और बच्चों के विकास, सुरक्षा एवं कल्याण से संबंधित योजनाओं की जानकारी।",
    icon: Users,
    category: "महिला एवं बाल",
  },
  {
    title: "रोजगार एवं कौशल विकास",
    description:
      "रोजगार, प्रशिक्षण, स्वरोजगार एवं कौशल विकास से जुड़ी योजनाओं की जानकारी।",
    icon: IndianRupee,
    category: "रोजगार",
  },
];

const steps = [
  {
    number: "01",
    title: "योजना खोजें",
    description: "अपनी आवश्यकता के अनुसार उपलब्ध योजना की जानकारी देखें।",
  },
  {
    number: "02",
    title: "पात्रता समझें",
    description: "योजना के लिए आवश्यक पात्रता एवं दस्तावेजों की जानकारी प्राप्त करें।",
  },
  {
    number: "03",
    title: "आवेदन प्रक्रिया देखें",
    description: "संबंधित योजना की आवेदन प्रक्रिया और आवश्यक जानकारी समझें।",
  },
];

function SchemeCard({
  title,
  description,
  icon: Icon,
  category,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
}) {
  return (
    <div className="group border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-lg">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center bg-blue-50 text-blue-900">
            <Icon size={22} />
          </div>

          <span className="border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-900 transition group-hover:text-orange-600"
        >
          जानकारी देखें
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function SchemesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-600 sm:px-6 lg:px-8">
          <p>नागरिक संपर्क एवं सार्वजनिक सेवा पोर्टल</p>

          <div className="hidden items-center gap-4 sm:flex">
            <span>हिंदी</span>
            <span className="text-slate-300">|</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-blue-900 text-white">
              <ShieldCheck size={24} />
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-tight text-blue-950">
                JAN CONNECT
              </div>

              <div className="text-xs font-medium text-slate-500">
                नागरिक संपर्क पोर्टल
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              होम
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              हमारे बारे में
            </Link>

            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              सेवाएँ
            </Link>

            <Link
              href="/schemes"
              className="text-sm font-semibold text-blue-900"
            >
              योजनाएँ
            </Link>

            <Link
              href="/notices"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              सूचनाएँ
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              संपर्क
            </Link>
          </nav>

          <Link
            href="/login/citizen"
            className="inline-flex items-center gap-2 bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            लॉगिन
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <FileText size={15} />
              योजनाओं की जानकारी
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl lg:text-5xl">
              नागरिकों के लिए
              <span className="text-orange-600"> योजनाएँ</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Jan Connect पर विभिन्न क्षेत्रों से संबंधित सार्वजनिक योजनाओं
              और नागरिक सुविधाओं की जानकारी एक ही स्थान पर प्राप्त करें।
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#schemes"
                className="inline-flex items-center gap-2 bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                योजनाएँ देखें
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-900 hover:text-blue-900"
              >
                नागरिक पंजीयन
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search / Intro */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                योजना श्रेणियाँ
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                अपनी आवश्यकता के अनुसार योजना की श्रेणी चुनें।
              </p>
            </div>

            <div className="flex w-full items-center border border-slate-300 bg-white md:max-w-sm">
              <Search size={19} className="ml-3 text-slate-400" />

              <input
                type="text"
                placeholder="योजना खोजें..."
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Schemes */}
      <section id="schemes" className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              उपलब्ध जानकारी
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
              प्रमुख योजना श्रेणियाँ
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              यहां विभिन्न नागरिक आवश्यकताओं से संबंधित योजनाओं की श्रेणियाँ
              प्रदर्शित की गई हैं।
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.title}
                title={scheme.title}
                description={scheme.description}
                icon={scheme.icon}
                category={scheme.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                महत्वपूर्ण जानकारी
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                योजना की जानकारी प्राप्त करने से पहले
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                किसी भी योजना के लिए आवेदन करने से पहले उसकी पात्रता,
                आवश्यक दस्तावेज, आवेदन प्रक्रिया और संबंधित विभाग की
                आधिकारिक जानकारी अवश्य जांचें।
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-700"
                  />

                  <div>
                    <h3 className="font-bold text-slate-900">
                      पात्रता की जाँच करें
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      योजना के लिए निर्धारित पात्रता शर्तों को ध्यान से पढ़ें।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-700"
                  />

                  <div>
                    <h3 className="font-bold text-slate-900">
                      आवश्यक दस्तावेज तैयार रखें
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      आवेदन से पहले आवश्यक दस्तावेजों की सूची जांच लें।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-700"
                  />

                  <div>
                    <h3 className="font-bold text-slate-900">
                      आधिकारिक स्रोत की पुष्टि करें
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      आवेदन या भुगतान से पहले संबंधित विभाग की आधिकारिक
                      जानकारी की पुष्टि करें।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              सरल प्रक्रिया
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
              योजना की जानकारी कैसे प्राप्त करें?
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border border-slate-200 bg-white p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-blue-900 text-sm font-bold text-white">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen CTA */}
      <section className="bg-blue-950 py-14">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Jan Connect से जुड़ें
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100">
            नागरिक पंजीयन करके अपने लिए उपलब्ध सार्वजनिक सेवाओं और
            सुविधाओं तक आसान डिजिटल पहुँच प्राप्त करें।
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              नागरिक पंजीयन करें
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-blue-700 bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              सभी सेवाएँ देखें
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="font-extrabold text-blue-950">JAN CONNECT</div>

              <p className="mt-1 text-xs text-slate-500">
                नागरिक संपर्क एवं सार्वजनिक सेवा पोर्टल
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-blue-900">
                गोपनीयता नीति
              </Link>

              <Link href="/terms" className="hover:text-blue-900">
                नियम एवं शर्तें
              </Link>

              <Link href="/contact" className="hover:text-blue-900">
                संपर्क
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
            © 2026 Jan Connect. सर्वाधिकार सुरक्षित।
          </div>
        </div>
      </footer>
    </main>
  );
}