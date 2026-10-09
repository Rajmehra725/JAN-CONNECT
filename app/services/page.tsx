import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Building2,
  FileText,
  HelpCircle,
  MapPin,
  MessageSquare,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          PAGE HERO
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-900">
              <FileText size={15} />
              <span>जन कनेक्ट सेवाएँ</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
              नागरिक सेवाएँ (Citizen Services)
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              जन कनेक्ट के माध्यम से नागरिकों को आवश्यक जानकारी, डिजिटल सुविधाओं और संपर्क सेवाओं तक एक व्यवस्थित माध्यम से पहुँच उपलब्ध कराने का उद्देश्य है।
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK SERVICES CARDS
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              प्रमुख सेवाएँ
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              नागरिकों के लिए उपलब्ध सुविधाएँ
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              नीचे दी गई सेवाएँ जन कनेक्ट डिजिटल पोर्टल की प्रस्तावित नागरिक सुविधाओं का हिस्सा हैं।
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Citizen Registration */}
            <ServiceCard
              icon={<UserPlus size={22} />}
              title="नागरिक पंजीयन"
              titleEn="Citizen Registration"
              description="जन कनेक्ट पर अपना नागरिक प्रोफाइल बनाने के लिए ऑनलाइन सुरक्षित पंजीयन करें।"
              href="/register"
              iconClass="bg-blue-100 text-blue-900"
            />

            {/* Citizen Profile */}
            <ServiceCard
              icon={<Users size={22} />}
              title="नागरिक प्रोफाइल"
              titleEn="Citizen Profile"
              description="अपनी व्यक्तिगत जानकारी और संबंधित प्रोफाइल विवरण को लॉगिन करके व्यवस्थित रूप से देखें।"
              href="/login/citizen"
              iconClass="bg-emerald-100 text-emerald-800"
            />

            {/* Public Notices */}
            <ServiceCard
              icon={<Bell size={22} />}
              title="सार्वजनिक सूचनाएँ"
              titleEn="Public Notices"
              description="महत्वपूर्ण स्थानीय सूचनाएँ, सार्वजनिक घोषणाएँ और नए प्रशासनिक अपडेट्स देखें।"
              href="/notices"
              iconClass="bg-orange-100 text-orange-700"
            />

            {/* Schemes */}
            <ServiceCard
              icon={<FileText size={22} />}
              title="योजनाओं की जानकारी"
              titleEn="Schemes Information"
              description="उपलब्ध सार्वजनिक कल्याणकारी योजनाओं और उनसे संबंधित पात्रता व दस्तावेजों की जानकारी देखें।"
              href="/schemes"
              iconClass="bg-purple-100 text-purple-700"
            />

            {/* Contact */}
            <ServiceCard
              icon={<MessageSquare size={22} />}
              title="संपर्क एवं सहायता"
              titleEn="Contact & Helpdesk"
              description="सामान्य जानकारी, पोर्टल सहायता या तकनीकी समस्या के लिए संपर्क डेस्क का उपयोग करें।"
              href="/contact"
              iconClass="bg-cyan-100 text-cyan-800"
            />

            {/* Location */}
            <ServiceCard
              icon={<MapPin size={22} />}
              title="क्षेत्र एवं बूथ जानकारी"
              titleEn="Constituency & Booth Info"
              description="विधानसभा क्षेत्र, वार्ड, बूथ और स्थानीय क्षेत्र संबंधी बुनियादी जानकारी।"
              href="/contact"
              iconClass="bg-rose-100 text-rose-700"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          ROLE BASED SERVICES
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              भूमिका आधारित सुविधा
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              अलग भूमिका, अलग पहुँच
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              प्लेटफॉर्म पर प्रत्येक उपयोगकर्ता को उसकी भूमिका और अधिकृत जिम्मेदारी के अनुसार सुरक्षित सुविधाएँ उपलब्ध कराई जाती हैं।
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <RoleCard
              icon={<Users size={22} />}
              title="नागरिक (Citizen)"
              description="नागरिक सेवाएँ, प्रोफाइल प्रबंधन, सूचनाएँ और उपलब्ध कल्याणकारी योजनाएं।"
              iconClass="bg-blue-100 text-blue-900"
            />

            <RoleCard
              icon={<Building2 size={22} />}
              title="जनप्रतिनिधि (Politician)"
              description="अधिकृत क्षेत्रीय जनसंपर्क, कार्यालय स्टाफ नियंत्रण और महत्वपूर्ण जनसूचनाएं।"
              iconClass="bg-orange-100 text-orange-700"
            />

            <RoleCard
              icon={<ShieldCheck size={22} />}
              title="PA / स्टाफ (Staff)"
              description="अधिकृत कार्यालय कार्यों, संपर्क अनुरोधों की समीक्षा और दैनिक समन्वय।"
              iconClass="bg-emerald-100 text-emerald-800"
            />

            <RoleCard
              icon={<MapPin size={22} />}
              title="बूथ कार्यकर्ता (Booth Worker)"
              description="निर्धारित बूथ एवं स्थानीय क्षेत्र से संबंधित अधिकृत सूचनाएं और समन्वय।"
              iconClass="bg-purple-100 text-purple-700"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW TO USE
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              उपयोग करने का तरीका
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              सेवाओं का लाभ कैसे प्राप्त करें?
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <StepCard
              number="01"
              title="1. पंजीयन करें"
              description="अपनी आवश्यक नागरिक जानकारी और मोबाइल नंबर भरकर जन कनेक्ट पर पंजीकरण करें।"
            />

            <StepCard
              number="02"
              title="2. लॉगिन करें"
              description="अपने अधिकृत मोबाइल नंबर पर प्राप्त OTP के माध्यम से सुरक्षित लॉगिन करें।"
            />

            <StepCard
              number="03"
              title="3. सेवाओं का उपयोग करें"
              description="अपनी आवश्यकतानुसार योजनाओं की जानकारी देखें, सूचनाएं पढ़ें और संपर्क करें।"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HELP BOX
      ====================================================== */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
                  <HelpCircle size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    सहायता की आवश्यकता है?
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    किसी सेवा या ऑनलाइन प्रक्रिया से संबंधित जानकारी अथवा तकनीकी समस्या के लिए सहायता केंद्र से संपर्क करें।
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-900 px-5 py-2.5 text-sm font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
              >
                संपर्क केंद्र
                <ArrowRight size={16} />
              </Link>
            </div>
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
              जन कनेक्ट से आज ही जुड़ें
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-blue-100 sm:text-sm">
              अपना नागरिक प्रोफाइल बनाएं और उपलब्ध डिजिटल सुविधाओं तक आसान पहुँच प्राप्त करें।
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700 shadow-md"
          >
            नागरिक पंजीयन करें
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({
  icon,
  title,
  titleEn,
  description,
  href,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  titleEn: string;
  description: string;
  href: string;
  iconClass: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconClass}`}>
        {icon}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900">
            {title}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400">
            {titleEn}
          </p>
          <p className="mt-2.5 text-xs leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <ArrowRight
          size={16}
          className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-900"
        />
      </div>
    </Link>
  );
}

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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconClass}`}>
        {icon}
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="text-xs font-bold text-orange-600">
        चरण {number}
      </div>

      <h3 className="mt-3 text-base font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}