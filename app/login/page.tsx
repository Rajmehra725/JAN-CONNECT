"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  ShieldCheck,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Calculator,
  LogIn,
  HelpCircle,
  UserPlus
} from "lucide-react";
import { authApi, CaptchaChallenge } from "@/lib/api";
import { useAuth, getDashboardPath } from "@/lib/auth-context";

export default function SharedLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (user && user.role) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  const fetchCaptcha = async () => {
    setLoadingCaptcha(true);
    try {
      const res = await authApi.getCaptcha();
      if (res.success && res.data) {
        setCaptcha(res.data);
        setCaptchaAnswer("");
      } else {
        setCaptcha({
          challengeId: "local-challenge-" + Date.now(),
          question: "7 + 5 = ?",
          expiresInSeconds: 180,
        });
      }
    } catch {
      setCaptcha({
        challengeId: "local-challenge-" + Date.now(),
        question: "9 + 4 = ?",
        expiresInSeconds: 180,
      });
    } finally {
      setLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanMobile = mobile.trim();
    if (!cleanMobile || !/^\d{10}$/.test(cleanMobile)) {
      setErrorMessage("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।");
      return;
    }

    if (!password) {
      setErrorMessage("कृपया पासवर्ड दर्ज करें।");
      return;
    }

    if (!captchaAnswer.trim()) {
      setErrorMessage("कृपया सुरक्षा CAPTCHA का सही उत्तर दर्ज करें।");
      return;
    }

    setSubmitting(true);

    try {
      const result = await login(
        cleanMobile,
        password,
        captcha?.challengeId,
        captchaAnswer.trim()
      );

      if (result.success && result.role) {
        setSuccessMessage("लॉगिन सफल! आपके डैशबोर्ड पर ले जाया जा रहा है...");
        const targetPath = getDashboardPath(result.role);
        setTimeout(() => {
          router.push(targetPath);
        }, 500);
      } else {
        setErrorMessage(
          result.message ||
            "लॉगिन असफल: अमान्य मोबाइल नंबर, पासवर्ड या CAPTCHA उत्तर।"
        );
        fetchCaptcha();
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।"
      );
      fetchCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 sm:py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        {/* Branding & Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md shadow-blue-900/20">
            <LogIn size={28} className="text-orange-400" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
            जन कनेक्ट एकीकृत लॉगिन
          </h1>
          <p className="mt-1.5 text-xs text-slate-600 sm:text-sm">
            Jan Connect Unified Portal Login
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            सभी भूमिकाओं (नागरिक, जनप्रतिनिधि, स्टाफ, कार्यकर्ता, मुख्य प्रशासक)
            हेतु एकल सुरक्षित प्रवेश
          </p>
        </div>

        {/* Role Pill badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-blue-900">
            नागरिक
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-orange-700">
            जनप्रतिनिधि
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-emerald-700">
            PA/स्टाफ
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-purple-700">
            बूथ कार्यकर्ता
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-rose-700">
            मुख्य प्रशासक
          </span>
        </div>

        {/* Card Form */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <div>
                <p className="font-bold">लॉगिन विफल:</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold">सत्यापन संपन्न:</p>
                <p className="mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobile"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                पंजीकृत मोबाइल नंबर (Mobile Number){" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-slate-400">
                  <Phone size={15} />
                  <span className="border-r border-slate-200 pr-2 text-xs font-semibold text-slate-600">
                    +91
                  </span>
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="98XXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-18 pr-3 text-sm font-semibold tracking-wide text-slate-900 transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700"
                >
                  पासवर्ड (Password) <span className="text-rose-500">*</span>
                </label>
                <Link
                  href="/contact"
                  className="text-[11px] font-semibold text-orange-600 hover:underline"
                >
                  पासवर्ड सहायता?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={15} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="अपना सुरक्षित पासवर्ड दर्ज करें"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Math CAPTCHA */}
            <div>
              <label
                htmlFor="captcha"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                सुरक्षा सत्यापन (Security CAPTCHA){" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-200 bg-slate-100 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Calculator size={16} className="text-blue-900" />
                    <span className="font-mono text-sm font-extrabold text-blue-950">
                      {loadingCaptcha
                        ? "लोड हो रहा है..."
                        : captcha?.question || "7 + 5 = ?"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    disabled={loadingCaptcha}
                    title="नया CAPTCHA लोड करें"
                    className="rounded p-1 text-slate-500 transition hover:bg-slate-200 hover:text-blue-900"
                  >
                    <RefreshCw
                      size={14}
                      className={loadingCaptcha ? "animate-spin" : ""}
                    />
                  </button>
                </div>
                <input
                  id="captcha"
                  name="captcha"
                  type="text"
                  required
                  placeholder="उत्तर"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value.trim())}
                  className="w-24 rounded-xl border border-slate-300 bg-slate-50/50 py-2 px-3 text-center text-sm font-bold text-slate-900 transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 py-3 text-sm font-bold text-white shadow-md shadow-blue-950/10 transition hover:bg-blue-800 focus:outline-hidden focus:ring-3 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>प्रमाणीकरण हो रहा है...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} className="text-orange-400" />
                  <span>लॉगिन करें (Sign In)</span>
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center space-y-2">
            <p className="text-xs text-slate-600">
              खाता नहीं है?{" "}
              <Link
                href="/register"
                className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 hover:underline"
              >
                <UserPlus size={13} />
                <span>नया नागरिक पंजीकरण करें</span>
              </Link>
            </p>
            <p className="text-[11px] text-slate-400">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 hover:text-slate-600"
              >
                <HelpCircle size={12} />
                <span>सहायता या तकनीकी सहायता प्राप्त करें</span>
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <span>256-bit एन्क्रिप्शन एवं सुरक्षित भूमिका-आधारित पहुँच नियंत्रण</span>
        </div>
      </div>
    </main>
  );
}
