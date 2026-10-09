import Link from "next/link";
import {
  Building2,
  FileText,
  MapPin,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  LogIn,
} from "lucide-react";

export default function LoginPage() {
  const ROLES = [
    {
      title: "नागरिक लॉगिन",
      titleEn: "Citizen Login",
      desc: "पंजीकृत मोबाइल नंबर और सुरक्षित OTP के माध्यम से प्रवेश करें।",
      href: "/login/citizen",
      icon: UserPlus,
      color: "bg-blue-100 text-blue-900 border-blue-200",
      cta: "नागरिक पोर्टल में जाएँ",
    },
    {
      title: "जनप्रतिनिधि लॉगिन",
      titleEn: "Politician / Representative Login",
      desc: "अधिकृत जनप्रतिनिधि खाता — क्षेत्रीय जनसंपर्क व सूचना प्रबंधन।",
      href: "/login/politician",
      icon: Building2,
      color: "bg-orange-100 text-orange-700 border-orange-200",
      cta: "जनप्रतिनिधि पोर्टल",
    },
    {
      title: "PA / कार्यालय स्टाफ लॉगिन",
      titleEn: "PA & Office Staff Login",
      desc: "संबद्ध कार्यालय स्टाफ खाता — दैनिक समन्वय एवं जनसंपर्क समीक्षा।",
      href: "/login/staff",
      icon: FileText,
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cta: "कार्यालय पोर्टल",
    },
    {
      title: "बूथ कार्यकर्ता लॉगिन",
      titleEn: "Booth Worker Login",
      desc: "स्थानीय बूथ स्तर कार्यकर्ता खाता — निर्धारित क्षेत्र समन्वय।",
      href: "/login/booth-worker",
      icon: MapPin,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      cta: "बूथ कार्यकर्ता पोर्टल",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white shadow-xs">
            <LogIn size={24} className="text-orange-400" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-blue-950">
            जन कनेक्ट पोर्टल लॉगिन
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            कृपया जारी रखने के लिए अपना उपयोगकर्ता खाता प्रकार (Role) चुनें।
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.href}
                href={role.href}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg border ${role.color}`}
                    >
                      <Icon size={22} />
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-900"
                    />
                  </div>

                  <h2 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-900">
                    {role.title}
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {role.titleEn}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-600">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900 group-hover:text-orange-600">
                  <span>{role.cta}</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 text-center text-xs text-slate-500 shadow-xs">
          <div className="flex items-center justify-center gap-2 font-semibold text-slate-700">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>सुरक्षित द्विस्तरीय प्रमाणीकरण एवं भूमिका-आधारित पहुँच नियंत्रण</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            नया खाता बनाने के लिए कृपया{" "}
            <Link href="/register" className="font-bold text-orange-600 underline">
              नागरिक पंजीकरण
            </Link>{" "}
            करें।
          </p>
        </div>
      </div>
    </main>
  );
}
