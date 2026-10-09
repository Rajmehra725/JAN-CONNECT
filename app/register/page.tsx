"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  CalendarDays,
  MapPin,
  Mail,
  BriefcaseBusiness,
  Users,
  Languages,
  Camera,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Calculator,
  RefreshCw,
  LogIn
} from "lucide-react";
import { authApi, uploadsApi, CaptchaChallenge } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [photoName, setPhotoName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [gpsLocation, setGpsLocation] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);

  // Passwords & Visibility
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Math CAPTCHA
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);

  const fetchCaptcha = async () => {
    setLoadingCaptcha(true);
    try {
      const res = await authApi.getCaptcha();
      if (res.success && res.data) {
        setCaptcha(res.data);
        setCaptchaAnswer("");
      } else {
        setCaptcha({
          challengeId: "local-" + Date.now(),
          question: "7 + 5 = ?",
          expiresInSeconds: 180,
        });
      }
    } catch {
      setCaptcha({
        challengeId: "local-" + Date.now(),
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

  const getLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("आपके ब्राउज़र में GPS स्थान सेवा समर्थित नहीं है।");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setGpsLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setGettingLocation(false);
      },
      (error) => {
        let msg = "GPS स्थान प्राप्त नहीं हो सका। कृपया लोकेशन अनुमति (Permission) दें।";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "लोकेशन अनुमति अस्वीकृत की गई। आप इसे छोड़ सकते हैं (यह ऐच्छिक है)।";
        }
        alert(msg);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsDuplicateUser(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const fullName = formData.get("fullName")?.toString().trim();
    const mobile = formData.get("mobile")?.toString().trim();
    const pincode = formData.get("pincode")?.toString().trim();
    const emergencyContact = formData.get("emergencyContact")?.toString().trim();
    const consent = formData.get("consent");

    if (!fullName) {
      setErrorMessage("कृपया अपना पूरा नाम दर्ज करें।");
      return;
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setErrorMessage("कृपया 10 अंकों का वैध मुख्य मोबाइल नंबर दर्ज करें।");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage("पासवर्ड न्यूनतम 6 अक्षरों का होना चाहिए।");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।");
      return;
    }
    if (!captchaAnswer.trim()) {
      setErrorMessage("कृपया सुरक्षा CAPTCHA का उत्तर दर्ज करें।");
      return;
    }
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      setErrorMessage("कृपया 6 अंकों का वैध पिनकोड दर्ज करें।");
      return;
    }
    if (!emergencyContact || !/^\d{10}$/.test(emergencyContact)) {
      setErrorMessage("कृपया 10 अंकों का वैध आपातकालीन संपर्क नंबर दर्ज करें।");
      return;
    }
    if (!consent) {
      setErrorMessage("कृपया नियम एवं शर्तों की सहमति स्वीकार करें।");
      return;
    }

    setLoading(true);

    try {
      // Optional profile photo upload
      let profilePhotoUrl: string | undefined = undefined;
      if (photoFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", photoFile);
          uploadFormData.append("mediaType", "IMAGE");
          const uploadRes = await uploadsApi.uploadFile(uploadFormData);
          if (uploadRes.success && uploadRes.data?.url) {
            profilePhotoUrl = uploadRes.data.url;
          }
        } catch {
          // If upload fails, proceed without photo rather than aborting registration
        }
      }

      const payload = {
        fullName,
        mobileNumber: mobile,
        password,
        confirmPassword,
        captchaId: captcha?.challengeId,
        captchaAnswer: captchaAnswer.trim(),
        alternateMobile: formData.get("alternateMobile")?.toString().trim() || undefined,
        dateOfBirth: formData.get("dateOfBirth")?.toString() || undefined,
        gender: formData.get("gender")?.toString() || undefined,
        occupation: formData.get("occupation")?.toString().trim() || undefined,
        email: formData.get("email")?.toString().trim() || undefined,
        preferredLanguage: formData.get("preferredLanguage")?.toString() || "HINDI",
        address: formData.get("address")?.toString().trim(),
        villageMohalla: formData.get("villageMohalla")?.toString().trim(),
        wardNumber: formData.get("wardNumber")?.toString().trim() || undefined,
        boothNumber: formData.get("boothNumber")?.toString().trim() || undefined,
        district: formData.get("district")?.toString().trim(),
        assemblyConstituency: formData.get("assemblyConstituency")?.toString().trim(),
        pincode,
        gpsLocation: gpsLocation || undefined,
        familyId: formData.get("familyId")?.toString().trim() || undefined,
        emergencyContact,
        profilePhoto: profilePhotoUrl,
      };

      const res = await authApi.registerCitizen(payload);

      if (res.success) {
        setSubmitted(true);
      } else {
        const msg = res.message || "पंजीकरण विफल रहा।";
        setErrorMessage(msg);
        if (msg.includes("पहले से पंजीकृत") || res.code === "DUPLICATE_USER") {
          setIsDuplicateUser(true);
        }
        fetchCaptcha();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "सर्वर से संपर्क नहीं हो सका।";
      setErrorMessage(msg);
      if (msg.includes("पहले से पंजीकृत")) {
        setIsDuplicateUser(true);
      }
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Page Heading */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                CITIZEN REGISTRATION / नागरिक पंजीकरण
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                नया नागरिक पंजीयन
              </h1>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-orange-600"
            >
              <ArrowLeft size={16} />
              <span>मुख्य पृष्ठ</span>
            </Link>
          </div>

          <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-600 sm:text-sm">
            Jan Connect से जुड़ने के लिए अपना नागरिक प्रोफाइल बनाएं। कृपया नीचे दी गई व्यक्तिगत, सुरक्षा एवं क्षेत्रीय जानकारी सही एवं पूर्ण रूप से दर्ज करें।
          </p>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                नागरिक पंजीकरण सफलतापूर्वक दर्ज हुआ!
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-600 sm:text-sm">
                आपका नागरिक खाता Jan Connect में सुरक्षित रूप से दर्ज कर लिया गया है। सुरक्षा नियमों के अनुसार, अब आप अपने पंजीकृत मोबाइल नंबर व पासवर्ड से लॉगिन कर सकते हैं।
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-900/10 hover:bg-blue-800"
                >
                  <LogIn size={16} className="text-orange-400" />
                  <span>पोर्टल लॉगिन करें (Go to Login)</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setPassword("");
                    setConfirmPassword("");
                    fetchCaptcha();
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  नया फॉर्म भरें
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-start gap-3 border-b border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
                  <div className="flex-1">
                    <p className="font-bold">कृपया त्रुटि सुधारें:</p>
                    <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                    {isDuplicateUser && (
                      <div className="mt-3">
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-800"
                        >
                          <LogIn size={14} className="text-orange-400" />
                          <span>लॉगिन पृष्ठ पर जाएँ (Go to Login)</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
              <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      व्यक्तिगत जानकारी (Personal Information)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      बुनियादी पहचान व संपर्क विवरण
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2 lg:p-8">
                {/* Full Name */}
                <FormField label="Full Name" hindi="पूरा नाम" required icon={<User size={15} />}>
                  <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="उदा. राजेश कुमार शर्मा"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Mobile */}
                <FormField label="Mobile Number" hindi="मुख्य मोबाइल नंबर" required icon={<Phone size={15} />}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 border-r border-slate-200 pr-2 text-xs font-semibold text-slate-500">
                      +91
                    </span>
                    <input
                      name="mobile"
                      type="tel"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="98XXXXXXXX"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-14 pr-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    />
                  </div>
                </FormField>

                {/* Alternate Mobile */}
                <FormField label="Alternate Mobile" hindi="वैकल्पिक मोबाइल नंबर" icon={<Phone size={15} />}>
                  <input
                    name="alternateMobile"
                    type="tel"
                    maxLength={10}
                    placeholder="वैकल्पिक मोबाइल नंबर (ऐच्छिक)"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* DOB */}
                <FormField label="Date of Birth" hindi="जन्म तिथि" required icon={<CalendarDays size={15} />}>
                  <input
                    name="dateOfBirth"
                    type="date"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Gender */}
                <FormField label="Gender" hindi="लिंग" required>
                  <select
                    name="gender"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-700 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="" disabled>लिंग चुनें / Select Gender</option>
                    <option value="MALE">पुरुष (Male)</option>
                    <option value="FEMALE">महिला (Female)</option>
                    <option value="OTHER">अन्य (Other)</option>
                  </select>
                </FormField>

                {/* Occupation */}
                <FormField label="Occupation" hindi="व्यवसाय" icon={<BriefcaseBusiness size={15} />}>
                  <input
                    name="occupation"
                    type="text"
                    placeholder="उदा. कृषक / स्वरोजगार / छात्र"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Email */}
                <FormField label="Email Address" hindi="ईमेल (ऐच्छिक)" icon={<Mail size={15} />}>
                  <input
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Preferred Language */}
                <FormField label="Preferred Language" hindi="पसंदीदा भाषा" required icon={<Languages size={15} />}>
                  <select
                    name="preferredLanguage"
                    required
                    defaultValue="HINDI"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-700 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="HINDI">हिंदी (Hindi)</option>
                    <option value="ENGLISH">English</option>
                  </select>
                </FormField>
              </div>

              {/* SECTION 2: ACCOUNT SECURITY (PASSWORD & CAPTCHA) */}
              <div className="border-y border-slate-100 bg-slate-50/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      खाता सुरक्षा एवं पासवर्ड (Account Security)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      लॉगिन हेतु सुरक्षित पासवर्ड एवं CAPTCHA सत्यापन
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2 lg:p-8">
                {/* Password */}
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>
                      पासवर्ड (Password) <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      न्यूनतम 6 अक्षर
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="न्यूनतम 6 अक्षरों का मजबूत पासवर्ड"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3.5 pr-10 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
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

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    पासवर्ड पुष्टि (Confirm Password) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="पासवर्ड पुनः दर्ज करें"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3.5 pr-10 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Math CAPTCHA */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    सुरक्षा सत्यापन (Security CAPTCHA) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex max-w-sm gap-2">
                    <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-200 bg-slate-100 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Calculator size={16} className="text-blue-900" />
                        <span className="font-mono text-xs font-extrabold text-blue-950 sm:text-sm">
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
                        className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-blue-900"
                      >
                        <RefreshCw
                          size={14}
                          className={loadingCaptcha ? "animate-spin" : ""}
                        />
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="उत्तर"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value.trim())}
                      className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-xs font-bold text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PROFILE PHOTO */}
              <div className="border-y border-slate-100 bg-slate-50/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      प्रोफाइल फोटो (Profile Photo - ऐच्छिक)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      पासपोर्ट साइज फोटो अपलोड करें
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <div className="max-w-md">
                  <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
                    <Camera size={24} className="text-blue-900" />
                    <span className="mt-2 text-xs font-bold text-slate-700">
                      {photoName || "फोटो चुनें (Choose File)"}
                    </span>
                    <span className="mt-0.5 text-[10px] text-slate-400">
                      JPG, JPEG अथवा PNG (अधिकतम 2MB)
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotoFile(file);
                          setPhotoName(file.name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* SECTION 4: ADDRESS & LOCAL AREA */}
              <div className="border-y border-slate-100 bg-slate-50/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      पता एवं क्षेत्र जानकारी (Address & Area)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      स्थानीय विधानसभा, वार्ड व बूथ विवरण
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2 lg:p-8">
                {/* Complete Address */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    पूरा पता (Complete Address) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="मकान नंबर, गली, मोहल्ला / क्षेत्र का विवरण"
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                {/* Village / Mohalla */}
                <FormField label="Village / Mohalla" hindi="गांव / मोहल्ला" required>
                  <input
                    name="villageMohalla"
                    type="text"
                    required
                    placeholder="गांव अथवा मोहल्ले का नाम"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Ward */}
                <FormField label="Ward Number" hindi="वार्ड नंबर">
                  <input
                    name="wardNumber"
                    type="text"
                    placeholder="वार्ड क्रमांक (यदि लागू हो)"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Booth */}
                <FormField label="Booth Number" hindi="बूथ नंबर">
                  <input
                    name="boothNumber"
                    type="text"
                    placeholder="बूथ क्रमांक (यदि ज्ञात हो)"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* District */}
                <FormField label="District" hindi="जिला" required>
                  <input
                    name="district"
                    type="text"
                    required
                    placeholder="जिले का नाम"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Assembly */}
                <FormField label="Assembly Constituency" hindi="विधानसभा क्षेत्र" required>
                  <input
                    name="assemblyConstituency"
                    type="text"
                    required
                    placeholder="विधानसभा क्षेत्र का नाम"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Pincode */}
                <FormField label="Pincode" hindi="पिनकोड" required>
                  <input
                    name="pincode"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="6 अंकों का पिनकोड"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* GPS */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    GPS Location (ऐच्छिक - केवल आपकी स्पष्ट सहमति से)
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Navigation size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="gpsLocation"
                        type="text"
                        readOnly
                        value={gpsLocation}
                        placeholder="GPS निर्देशांक बटन दबाने पर प्राप्त होंगे"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={getLocation}
                      disabled={gettingLocation}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
                    >
                      <Navigation size={14} />
                      <span>{gettingLocation ? "स्थान प्राप्त किया जा रहा है..." : "स्थान प्राप्त करें (Get Location)"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 5: FAMILY & EMERGENCY */}
              <div className="border-y border-slate-100 bg-slate-50/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      परिवार एवं आपातकालीन संपर्क (Family & Emergency)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      परिवार आईडी एवं आपातकालीन सहायता नंबर
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2 lg:p-8">
                {/* Family ID */}
                <FormField label="Family ID / समग्र परिवार आईडी" hindi="ऐच्छिक" icon={<Users size={15} />}>
                  <input
                    name="familyId"
                    type="text"
                    placeholder="परिवार आईडी दर्ज करें (ऐच्छिक)"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>

                {/* Emergency Contact */}
                <FormField label="Emergency Contact" hindi="आपातकालीन संपर्क नंबर" required icon={<Phone size={15} />}>
                  <input
                    name="emergencyContact"
                    type="tel"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10 अंकों का आपातकालीन मोबाइल नंबर"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  />
                </FormField>
              </div>

              {/* SECTION 6: CONSENT & SUBMISSION */}
              <div className="border-t border-slate-200 bg-slate-50/90 p-6 lg:p-8">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-xs leading-5 text-slate-600">
                    मैं प्रमाणित करता/करती हूँ कि मेरे द्वारा दी गई जानकारी सही एवं सत्य है। मैं Jan Connect के{" "}
                    <Link href="/terms" target="_blank" className="font-bold text-blue-900 underline">
                      नियम एवं शर्तें (Terms)
                    </Link>{" "}
                    और{" "}
                    <Link href="/privacy" target="_blank" className="font-bold text-blue-900 underline">
                      गोपनीयता नीति (Privacy Policy)
                    </Link>{" "}
                    से सहमत हूँ।
                  </span>
                </label>

                <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row">
                  <p className="text-[11px] text-slate-500">
                    <span className="text-rose-500">*</span> आवश्यक फ़ील्ड्स
                  </p>

                  <div className="flex w-full gap-3 sm:w-auto">
                    <Link
                      href="/"
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none"
                    >
                      रद्द करें (Cancel)
                    </Link>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/10 transition hover:bg-blue-800 disabled:opacity-60 sm:flex-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>पंजीकरण दर्ज हो रहा है...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>पंजीकरण पूरा करें (Submit Registration)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function FormField({
  label,
  hindi,
  required = false,
  icon,
  children,
}: {
  label: string;
  hindi?: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
        {icon && <span className="text-blue-900">{icon}</span>}
        <span>
          {label}
          {hindi && <span className="ml-1 font-normal text-slate-500">({hindi})</span>}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}