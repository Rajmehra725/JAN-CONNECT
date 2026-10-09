import Link from "next/link";
import { ShieldCheck, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* Top Banner Disclaimer */}
      <div className="border-b border-slate-900 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <ShieldCheck size={16} className="text-orange-400 shrink-0" />
          <p>
            <strong className="text-slate-300 font-semibold">अस्वीकरण (Disclaimer):</strong> जन कनेक्ट एक स्वतंत्र नागरिक संपर्क एवं जनसूचना मंच है। यह किसी आधिकारिक सरकारी विभाग या मंत्रालय का पोर्टल नहीं है।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-900 text-orange-400 font-bold">
                JC
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  JAN CONNECT
                </h3>
                <p className="text-[11px] text-slate-400">
                  नागरिक संपर्क एवं सूचना मंच
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              नागरिकों को सार्वजनिक सेवाओं, कल्याणकारी योजनाओं और स्थानीय सूचनाओं से सुगमतापूर्वक जोड़ने के लिए समर्पित डिजिटल मंच।
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>डिजिटल पारदर्शिता एवं सेवा सुलभता</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              त्वरित लिंक / Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/" className="transition hover:text-white hover:underline">
                  होम (Home)
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-white hover:underline">
                  हमारे बारे में (About Portal)
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-white hover:underline">
                  नागरिक सेवाएँ (Citizen Services)
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="transition hover:text-white hover:underline">
                  योजनाओं की जानकारी (Schemes)
                </Link>
              </li>
              <li>
                <Link href="/notices" className="transition hover:text-white hover:underline">
                  नवीनतम सूचनाएँ (Notices)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white hover:underline">
                  संपर्क एवं सहायता (Contact Us)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Citizen Portals */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              नागरिक एवं कार्यकर्ता / Access
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/register" className="text-orange-400 font-medium transition hover:text-orange-300 hover:underline">
                  + नया नागरिक पंजीकरण (Register)
                </Link>
              </li>
              <li>
                <Link href="/login/citizen" className="transition hover:text-white hover:underline">
                  नागरिक लॉगिन (Citizen OTP Login)
                </Link>
              </li>
              <li>
                <Link href="/login/politician" className="transition hover:text-white hover:underline">
                  जनप्रतिनिधि पोर्टल (Politician Login)
                </Link>
              </li>
              <li>
                <Link href="/login/staff" className="transition hover:text-white hover:underline">
                  PA / स्टाफ पोर्टल (Office Staff Login)
                </Link>
              </li>
              <li>
                <Link href="/login/booth-worker" className="transition hover:text-white hover:underline">
                  बूथ कार्यकर्ता पोर्टल (Booth Worker Login)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Help */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              नीति एवं सहायता / Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="transition hover:text-white hover:underline">
                  गोपनीयता नीति (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-white hover:underline">
                  नियम एवं शर्तें (Terms & Conditions)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white hover:underline">
                  तकनीकी सहायता (Technical Support)
                </Link>
              </li>
            </ul>

            <div className="mt-5 rounded-md border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <PhoneCall size={14} className="text-orange-400" />
                <span>नागरिक सहायता डेस्क</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                कार्य दिवसों में सुबह 10:00 से शाम 6:00 बजे तक
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-800/80 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>
              © 2026 Jan Connect. सर्वाधिकार सुरक्षित (All Rights Reserved).
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-slate-300">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-slate-300">
                Terms
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-slate-300">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
