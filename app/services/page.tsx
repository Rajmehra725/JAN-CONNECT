import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  FileText,
  HelpCircle,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

export default function ServicesPage() {
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
              className="font-medium text-slate-600 hover:text-blue-900"
            >
              हमारे बारे में
            </Link>

            <Link
              href="/services"
              className="font-semibold text-blue-900"
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
          PAGE HERO
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900">
              <FileText size={16} />
              जन कनेक्ट सेवाएँ
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              नागरिक सेवाएँ
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              जन कनेक्ट के माध्यम से नागरिकों को आवश्यक जानकारी,
              डिजिटल सुविधाओं और संपर्क सेवाओं तक एक व्यवस्थित माध्यम
              से पहुँच उपलब्ध कराने का उद्देश्य है।
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          QUICK SERVICES
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              प्रमुख सेवाएँ
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              नागरिकों के लिए उपलब्ध सुविधाएँ
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              नीचे दी गई सेवाएँ प्लेटफॉर्म के प्रस्तावित डिजिटल
              नागरिक सुविधाओं का हिस्सा हैं।
            </p>

          </div>


          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Citizen Registration */}
            <ServiceCard
              icon={<UserPlus size={23} />}
              title="नागरिक पंजीयन"
              description="जन कनेक्ट पर अपना नागरिक प्रोफाइल बनाने के लिए ऑनलाइन पंजीयन करें।"
              href="/register"
              iconClass="bg-blue-100 text-blue-900"
            />

            {/* Citizen Profile */}
            <ServiceCard
              icon={<Users size={23} />}
              title="नागरिक प्रोफाइल"
              description="अपनी व्यक्तिगत जानकारी और संबंधित प्रोफाइल विवरण को व्यवस्थित रूप से देखें।"
              href="/login/citizen"
              iconClass="bg-green-100 text-green-700"
            />

            {/* Public Notices */}
            <ServiceCard
              icon={<Bell size={23} />}
              title="सार्वजनिक सूचनाएँ"
              description="महत्वपूर्ण स्थानीय सूचनाएँ, घोषणाएँ और सार्वजनिक जानकारी देखें।"
              href="/notices"
              iconClass="bg-orange-100 text-orange-700"
            />

            {/* Schemes */}
            <ServiceCard
              icon={<FileText size={23} />}
              title="योजनाओं की जानकारी"
              description="उपलब्ध सार्वजनिक योजनाओं और उनसे संबंधित जानकारी को एक स्थान पर देखें।"
              href="/schemes"
              iconClass="bg-purple-100 text-purple-700"
            />

            {/* Contact */}
            <ServiceCard
              icon={<MessageSquare size={23} />}
              title="संपर्क एवं सहायता"
              description="सामान्य जानकारी या सहायता के लिए संबंधित संपर्क माध्यमों का उपयोग करें।"
              href="/contact"
              iconClass="bg-cyan-100 text-cyan-700"
            />

            {/* Location */}
            <ServiceCard
              icon={<MapPin size={23} />}
              title="क्षेत्र एवं स्थान जानकारी"
              description="क्षेत्र, वार्ड, बूथ और अन्य स्थान संबंधी जानकारी को व्यवस्थित रूप से उपलब्ध कराने की सुविधा।"
              href="/contact"
              iconClass="bg-red-100 text-red-700"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          CITIZEN SERVICES
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left */}
            <div>

              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                नागरिकों के लिए
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                एक ही स्थान पर आवश्यक डिजिटल सुविधाएँ
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                जन कनेक्ट का उद्देश्य नागरिकों को बार-बार अलग-अलग
                स्थानों पर जानकारी खोजने के बजाय एक व्यवस्थित डिजिटल
                प्लेटफॉर्म के माध्यम से संबंधित जानकारी तक पहुँच
                उपलब्ध कराना है।
              </p>

              <Link
                href="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                नागरिक पंजीयन करें
                <ArrowRight size={18} />
              </Link>

            </div>


            {/* Right */}
            <div className="border border-slate-200 bg-white p-6 sm:p-8">

              <h3 className="text-lg font-bold text-slate-900">
                उपलब्ध डिजिटल सुविधाएँ
              </h3>

              <div className="mt-6 space-y-4">

                <Feature text="ऑनलाइन नागरिक पंजीयन" />

                <Feature text="नागरिक प्रोफाइल प्रबंधन" />

                <Feature text="सार्वजनिक सूचनाओं की जानकारी" />

                <Feature text="योजनाओं से संबंधित जानकारी" />

                <Feature text="संपर्क एवं सहायता सुविधा" />

                <Feature text="क्षेत्र और स्थानीय जानकारी" />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ROLE BASED SERVICES
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              भूमिका आधारित सुविधा
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              अलग भूमिका, अलग पहुँच
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              प्लेटफॉर्म पर प्रत्येक उपयोगकर्ता को उसकी भूमिका और
              अधिकृत जिम्मेदारी के अनुसार सुविधाएँ उपलब्ध कराई जा सकती हैं।
            </p>

          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* Citizen */}
            <RoleCard
              icon={<Users size={23} />}
              title="नागरिक"
              description="नागरिक सेवाएँ, प्रोफाइल, सूचनाएँ और उपलब्ध सार्वजनिक जानकारी।"
              iconClass="bg-blue-100 text-blue-900"
            />

            {/* Politician */}
            <RoleCard
              icon={<Building2 size={23} />}
              title="जनप्रतिनिधि"
              description="अधिकृत क्षेत्रीय संपर्क और सार्वजनिक गतिविधियों से संबंधित सुविधाएँ।"
              iconClass="bg-orange-100 text-orange-700"
            />

            {/* Staff */}
            <RoleCard
              icon={<ShieldCheck size={23} />}
              title="PA / कार्यालय स्टाफ"
              description="अधिकृत कार्यालय कार्यों और नागरिक संपर्क में सहायता।"
              iconClass="bg-green-100 text-green-700"
            />

            {/* Booth Worker */}
            <RoleCard
              icon={<MapPin size={23} />}
              title="बूथ कार्यकर्ता"
              description="निर्धारित बूथ एवं क्षेत्र से संबंधित अधिकृत जानकारी और कार्य।"
              iconClass="bg-purple-100 text-purple-700"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW TO USE
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
              उपयोग करने का तरीका
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              सेवा का उपयोग कैसे करें?
            </h2>

          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <StepCard
              number="01"
              title="पंजीयन करें"
              description="अपनी आवश्यक जानकारी भरकर नागरिक के रूप में पंजीयन करें।"
            />

            <StepCard
              number="02"
              title="लॉगिन करें"
              description="अपने अधिकृत मोबाइल नंबर या उपलब्ध लॉगिन माध्यम से प्रवेश करें।"
            />

            <StepCard
              number="03"
              title="सेवा का उपयोग करें"
              description="अपनी भूमिका के अनुसार उपलब्ध डिजिटल सेवाओं और जानकारी का उपयोग करें।"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          HELP
      ====================================================== */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="border border-slate-200 bg-white p-6 sm:p-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-900">
                  <HelpCircle size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    सहायता की आवश्यकता है?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    किसी सेवा या प्रक्रिया से संबंधित जानकारी के लिए
                    संपर्क पृष्ठ देखें।
                  </p>
                </div>

              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-900 px-5 py-2.5 font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
              >
                संपर्क करें
                <ArrowRight size={17} />
              </Link>

            </div>

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
            नागरिक पंजीयन
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


/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({
  icon,
  title,
  description,
  href,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  iconClass: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-md ${iconClass}`}
      >
        {icon}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <ArrowRight
          size={18}
          className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-900"
        />

      </div>
    </Link>
  );
}


/* =========================================================
   FEATURE
========================================================= */

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <CheckCircle2
        size={19}
        className="mt-0.5 shrink-0 text-green-600"
      />

      <p className="text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   ROLE CARD
========================================================= */

function RoleCard({
  icon,
  title,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-6">

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-md ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-6">

      <div className="text-sm font-bold text-orange-600">
        चरण {number}
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

    </div>
  );
}