import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          PAGE TITLE / HERO
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-900 rounded-md">
              <Globe2 size={15} />
              <span>परिचय एवं उद्देश्य</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
              हमारे बारे में (About Jan Connect)
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              <strong>Jan Connect</strong> एक डिजिटल नागरिक संपर्क मंच है, जिसका उद्देश्य नागरिकों को उपयोगी सार्वजनिक जानकारी, सेवाओं और स्थानीय संपर्क सुविधाओं से एक व्यवस्थित एवं पारदर्शी डिजिटल माध्यम के द्वारा जोड़ना है।
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION & VISION
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* Left Column */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              जन कनेक्ट का उद्देश्य
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              नागरिकों और जनसुविधाओं के बीच डिजिटल सेतु
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              आज के डिजिटल युग में नागरिकों को सही जानकारी और संबंधित सेवाओं तक आसानी से पहुँचाना अत्यंत महत्वपूर्ण है। Jan Connect इसी उद्देश्य को ध्यान में रखते हुए एक सरल, पारदर्शी और व्यवस्थित डिजिटल प्लेटफॉर्म के रूप में विकसित किया गया है।
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              इस मंच के माध्यम से आम नागरिकों, अधिकृत जनप्रतिनिधियों, कार्यालय कर्मचारियों तथा बूथ स्तर के कार्यकर्ताओं को उनकी जिम्मेदारियों और भूमिका के अनुसार सुरक्षित डिजिटल डैशबोर्ड्स उपलब्ध कराए जा रहे हैं।
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              हमारा प्रयास है कि सूचना का अधिकार, योजना पात्रता और जनसमस्या निवारण हेतु संपर्क सूत्र सभी नागरिकों के लिए समान रूप से सुलभ रहें।
            </p>
          </div>

          {/* Right Information Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
                <ShieldCheck size={26} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  सुरक्षित और नियंत्रित मंच
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  उपयोगकर्ता की भूमिका (Role) के अनुसार सुरक्षित अभिगम
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">
                  चार स्पष्ट भूमिकाएँ: नागरिक, जनप्रतिनिधि, कार्यालय स्टाफ, और बूथ कार्यकर्ता।
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">
                  नागरिक गोपनीयता का पूर्ण सम्मान — संवेदनशील डेटा केवल अधिकृत प्रयोजनों हेतु।
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">
                  सत्यापित मोबाइल OTP आधारित नागरिक प्रमाणीकरण प्रणाली।
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">
                  सरल हिंदी एवं अंग्रेजी द्विभाषी इंटरफेस जो प्रत्येक नागरिक के अनुकूल है।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO CAN USE
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              उपयोगकर्ता एवं भूमिकाएँ
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              जन कनेक्ट से कौन जुड़ सकता है?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              प्लेटफॉर्म को विभिन्न भूमिकाओं के अनुसार संरचित किया गया है, ताकि प्रत्येक उपयोगकर्ता को उसकी आवश्यकता और अधिकार क्षेत्र के अनुसार सुविधाएँ प्राप्त हों।
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Citizen */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
                <Users size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                नागरिक (Citizen)
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                नागरिक अपने मोबाइल नंबर से सुरक्षित पंजीकरण करके सार्वजनिक सूचनाओं, योजनाओं और सेवाओं का लाभ ले सकते हैं।
              </p>
            </div>

            {/* Politician */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                <Building2 size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                जनप्रतिनिधि (Politician)
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                अधिकृत जनप्रतिनिधि अपने क्षेत्र के नागरिक संपर्क, कार्यालय स्टाफ तथा जनसूचनाओं का सुरक्षित प्रबंधन कर सकते हैं।
              </p>
            </div>

            {/* Staff */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                PA / कार्यालय स्टाफ
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                कार्यालय कर्मचारी नागरिक संपर्क संदेशों, सूचनाओं के प्रारूप और दैनिक समन्वय में सहयोग करते हैं।
              </p>
            </div>

            {/* Booth Worker */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <MapPin size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                बूथ कार्यकर्ता (Booth Worker)
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                निर्धारित स्थानीय बूथ क्षेत्र की अधिकृत जानकारी और जमीनी स्तर के नागरिक समन्वय के लिए मंच का उपयोग करते हैं।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DISCLAIMER & LEGAL COMPLIANCE
      ====================================================== */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-l-4 border-orange-500 bg-slate-50 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">
              महत्वपूर्ण वैधानिक स्पष्टीकरण (Statutory Disclaimer)
            </h3>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              <strong>Jan Connect</strong> एक स्वतंत्र जनसंपर्क एवं नागरिक सूचना प्रौद्योगिकी मंच है। यह किसी भी केंद्रीय अथवा राज्य सरकार का आधिकारिक पोर्टल या निर्वाचन आयोग का अंग नहीं है। पोर्टल पर प्रस्तुत योजनाओं व सेवाओं की जानकारी जनसाधारण के मार्गदर्शन हेतु उपलब्ध कराई जाती है।
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-blue-950 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              जन कनेक्ट परिवार से जुड़ें
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-blue-100 sm:text-sm">
              अपना नागरिक प्रोफाइल आज ही बनाएं और अपने क्षेत्र से जुड़ी उपयोगी जानकारी से जुड़े रहें।
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700 shadow-md"
          >
            नागरिक पंजीयन करें
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}