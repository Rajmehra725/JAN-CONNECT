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
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-900 text-white">
              <Building2 size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-900">
                JAN CONNECT
              </h1>

              <p className="text-[10px] text-slate-500 sm:text-xs">
                नागरिक संपर्क पोर्टल
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">

            <Link
              href="/"
              className="font-medium text-slate-600 hover:text-blue-900"
            >
              होम
            </Link>

            <Link
              href="/about"
              className="font-semibold text-blue-900"
            >
              हमारे बारे में
            </Link>

            <Link
              href="/services"
              className="font-medium text-slate-600 hover:text-blue-900"
            >
              सेवाएँ
            </Link>

            <Link
              href="/schemes"
              className="font-medium text-slate-600 hover:text-blue-900"
            >
              योजनाएँ
            </Link>

            <Link
              href="/notices"
              className="font-medium text-slate-600 hover:text-blue-900"
            >
              सूचनाएँ
            </Link>

            <Link
              href="/contact"
              className="font-medium text-slate-600 hover:text-blue-900"
            >
              संपर्क
            </Link>

          </nav>

          {/* Login */}
          <Link
            href="/login/citizen"
            className="flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            लॉगिन
            <ArrowRight size={16} />
          </Link>

        </div>
      </header>


      {/* =====================================================
          PAGE TITLE
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900">
              <Globe2 size={16} />
              जन कनेक्ट
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              हमारे बारे में
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              जन कनेक्ट एक डिजिटल नागरिक संपर्क मंच है, जिसका उद्देश्य
              नागरिकों को उपयोगी सार्वजनिक जानकारी, सेवाओं और स्थानीय
              संपर्क सुविधाओं से एक व्यवस्थित डिजिटल माध्यम के द्वारा जोड़ना है।
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

          {/* Left */}
          <div>

            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              जन कनेक्ट का उद्देश्य
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              नागरिकों और सार्वजनिक सेवाओं के बीच डिजिटल संपर्क
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              आज के डिजिटल युग में नागरिकों को सही जानकारी और संबंधित
              सेवाओं तक आसानी से पहुँचाना महत्वपूर्ण है। जन कनेक्ट इसी
              उद्देश्य को ध्यान में रखते हुए एक सरल और व्यवस्थित डिजिटल
              प्लेटफॉर्म के रूप में तैयार किया जा रहा है।
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              इस प्लेटफॉर्म के माध्यम से नागरिकों, जनप्रतिनिधियों,
              कार्यालय कर्मचारियों और बूथ स्तर के कार्यकर्ताओं के लिए
              उनकी भूमिका के अनुसार सुविधाएँ उपलब्ध कराई जा सकती हैं।
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              हमारा प्रयास है कि आवश्यक जानकारी और डिजिटल सुविधाएँ
              एक सुव्यवस्थित, सुरक्षित और उपयोगकर्ता-अनुकूल अनुभव के
              माध्यम से उपलब्ध हों।
            </p>

          </div>


          {/* Right Information Box */}
          <div className="border border-slate-200 bg-slate-50 p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-900">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  सुरक्षित और व्यवस्थित प्लेटफॉर्म
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  उपयोगकर्ता की भूमिका के अनुसार नियंत्रित पहुँच
                </p>
              </div>

            </div>


            <div className="mt-7 space-y-4">

              <div className="flex gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-sm leading-6 text-slate-600">
                  अलग-अलग उपयोगकर्ता भूमिकाओं के लिए नियंत्रित पहुँच।
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-sm leading-6 text-slate-600">
                  नागरिक जानकारी को व्यवस्थित रूप से प्रबंधित करने की सुविधा।
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-sm leading-6 text-slate-600">
                  आवश्यक जानकारी तक भूमिका आधारित पहुँच।
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-sm leading-6 text-slate-600">
                  नागरिकों के लिए सरल और उपयोगकर्ता-अनुकूल इंटरफेस।
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

            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              उपयोगकर्ता
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              जन कनेक्ट से कौन जुड़ सकता है?
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              प्लेटफॉर्म को अलग-अलग भूमिकाओं के अनुसार संरचित किया गया है,
              ताकि प्रत्येक उपयोगकर्ता को उसकी आवश्यकता के अनुसार सुविधाएँ
              उपलब्ध कराई जा सकें।
            </p>

          </div>


          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Citizen */}
            <div className="border border-slate-200 bg-white p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-900">
                <Users size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                नागरिक
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                नागरिक अपने लिए उपलब्ध सार्वजनिक जानकारी, सेवाओं,
                सूचनाओं और अन्य सुविधाओं का उपयोग कर सकते हैं।
              </p>

            </div>


            {/* Politician */}
            <div className="border border-slate-200 bg-white p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-700">
                <Building2 size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                जनप्रतिनिधि
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                अधिकृत जनप्रतिनिधि अपने क्षेत्र से संबंधित संपर्क और
                सार्वजनिक गतिविधियों को व्यवस्थित रूप से संभाल सकते हैं।
              </p>

            </div>


            {/* Staff */}
            <div className="border border-slate-200 bg-white p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-700">
                <CheckCircle2 size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                PA / कार्यालय स्टाफ
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                अधिकृत कार्यालय कर्मचारी नागरिक संपर्क और कार्यालय से
                संबंधित कार्यों में सहयोग कर सकते हैं।
              </p>

            </div>


            {/* Booth Worker */}
            <div className="border border-slate-200 bg-white p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-700">
                <MapPin size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                बूथ कार्यकर्ता
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                निर्धारित बूथ और क्षेत्र से संबंधित अधिकृत जानकारी
                और गतिविधियों के लिए प्लेटफॉर्म का उपयोग कर सकते हैं।
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR APPROACH
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              हमारी प्राथमिकताएँ
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              जन कनेक्ट की प्रमुख विशेषताएँ
            </h2>

          </div>


          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">

            {/* Security */}
            <div className="border border-slate-200 p-7 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <ShieldCheck size={23} />
              </div>

              <h3 className="mt-5 font-bold">
                सुरक्षा
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                उपयोगकर्ता और उनकी भूमिका के अनुसार जानकारी तक नियंत्रित
                पहुँच उपलब्ध कराने पर ध्यान।
              </p>

            </div>


            {/* Accessibility */}
            <div className="border border-slate-200 p-7 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                <Globe2 size={23} />
              </div>

              <h3 className="mt-5 font-bold">
                आसान पहुँच
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                नागरिकों के लिए आवश्यक जानकारी और डिजिटल सुविधाओं को
                सरल तरीके से उपलब्ध कराने का प्रयास।
              </p>

            </div>


            {/* Community */}
            <div className="border border-slate-200 p-7 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Users size={23} />
              </div>

              <h3 className="mt-5 font-bold">
                नागरिक संपर्क
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                नागरिकों और संबंधित अधिकृत भूमिकाओं के बीच बेहतर डिजिटल
                संपर्क और समन्वय को बढ़ावा देना।
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          NOTE
      ====================================================== */}
      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="border-l-4 border-orange-500 bg-white p-5 shadow-sm">

            <h3 className="font-bold text-slate-900">
              महत्वपूर्ण सूचना
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Jan Connect एक डिजिटल नागरिक संपर्क प्लेटफॉर्म के रूप में
              विकसित किया जा रहा है। किसी सरकारी विभाग, मंत्रालय अथवा
              निर्वाचन संस्था से आधिकारिक संबद्धता का दावा केवल अधिकृत
              होने की स्थिति में ही किया जाना चाहिए।
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-blue-900">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <div>

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              जन कनेक्ट से जुड़ें
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              अपना नागरिक प्रोफाइल बनाएं और उपलब्ध डिजिटल सुविधाओं
              तक आसान पहुँच प्राप्त करें।
            </p>

          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            नागरिक पंजीयन करें
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <p>
            © 2026 Jan Connect. सर्वाधिकार सुरक्षित।
          </p>

          <div className="flex gap-5">

            <Link
              href="/privacy"
              className="hover:text-blue-900"
            >
              गोपनीयता नीति
            </Link>

            <Link
              href="/terms"
              className="hover:text-blue-900"
            >
              नियम एवं शर्तें
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}