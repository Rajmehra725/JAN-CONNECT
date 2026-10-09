"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  UserCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function PoliticianLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim() || !password) {
      setErrorMessage("कृपया उपयोगकर्ता पहचान एवं पासवर्ड दर्ज करें।");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/politician/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        router.push("/dashboard/politician");
      } else {
        setErrorMessage(data?.message || "अमान्य क्रेडेंशियल्स अथवा अनधिकृत खाता।");
      }
    } catch {
      setErrorMessage("सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700 shadow-xs">
              <Building2 size={26} />
            </div>
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              जनप्रतिनिधि लॉगिन (Representative Login)
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              अधिकृत जनप्रतिनिधि खाता एवं क्षेत्रीय डैशबोर्ड प्रवेश
            </p>
          </div>

          {/* Security Advisory */}
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-700" />
            <p>
              यह केवल अधिकृत जनप्रतिनिधियों हेतु सुरक्षित पोर्टल है। अनाधिकृत प्रवेश का प्रयास साइबर सुरक्षा नियमों के अंतर्गत प्रतिबंधित है।
            </p>
          </div>

          {errorMessage && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">प्रवेश त्रुटि:</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="identifier" className="mb-1.5 block text-xs font-bold text-slate-700">
                उपयोगकर्ता आईडी / अधिकृत ईमेल <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Official ID / Registered Email"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-slate-700">
                सुरक्षित पासवर्ड (Password) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>प्रमाणीकरण हो रहा है...</span>
                </>
              ) : (
                <>
                  <span>सुरक्षित लॉगिन करें (Authorized Login)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
            <Link href="/login" className="font-semibold text-blue-900 hover:underline">
              ← अन्य लॉगिन विकल्प देखें
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
