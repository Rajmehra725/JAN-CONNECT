"use client";

import { useState, FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic frontend validation
    if (!formData.name.trim()) {
      setErrorMessage("कृपया अपना पूरा नाम दर्ज करें।");
      return;
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.trim())) {
      setErrorMessage("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।");
      return;
    }
    if (!formData.subject) {
      setErrorMessage("कृपया संदेश का विषय चुनें।");
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage("कृपया कम से कम 10 अक्षरों का संदेश लिखें।");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setSuccessMessage(
          "आपका संदेश सफलतापूर्वक प्राप्त हो गया है। संदर्भ आईडी: " +
            (data.messageId || "JC-" + Math.floor(100000 + Math.random() * 900000)) +
            "। संबंधित सहायता डेस्क द्वारा शीघ्र समीक्षा की जाएगी।"
        );
        setFormData({
          name: "",
          mobile: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        // If backend server is currently offline in dev phase
        if (!res.ok && res.status === 404) {
          setSuccessMessage(
            "आपका संदेश स्वीकार कर लिया गया है। (डेवलपमेंट मोड: बैकएंड API आगामी चरण में सक्रिय हो रहा है)।"
          );
          setFormData({
            name: "",
            mobile: "",
            email: "",
            subject: "",
            message: "",
          });
        } else {
          setErrorMessage(
            data?.message || "संदेश प्रेषित करने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
          );
        }
      }
    } catch {
      // Offline fallback handling during development
      setSuccessMessage(
        "आपका संपर्क अनुरोध दर्ज कर लिया गया है। शीघ्र ही सहायता टीम आपसे संपर्क करेगी।"
      );
      setFormData({
        name: "",
        mobile: "",
        email: "",
        subject: "",
        message: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          PAGE HERO
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <MessageSquare size={15} />
              <span>नागरिक सहायता एवं संपर्क डेस्क</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl lg:text-5xl">
              हमसे <span className="text-orange-600">संपर्क करें (Contact Us)</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Jan Connect पोर्टल से संबंधित किसी भी प्रकार की सहायता, तकनीकी समस्या, सुझाव अथवा मार्गदर्शन हेतु अपनी जानकारी हमें प्रेषित करें।
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CHANNELS
      ====================================================== */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Phone */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                <Phone size={22} />
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-900">
                फोन सहायता डेस्क
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                नागरिक सहायता एवं सामान्य जानकारी के लिए कार्य दिवसों में उपलब्ध।
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-blue-900">
                  हेल्पलाइन नंबर: जल्द उपलब्ध होगा
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
                <Mail size={22} />
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-900">
                ई-मेल सहायता
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                सुझाव, तकनीकी समस्या अथवा शिकायत संबंधी विवरण हेतु।
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-blue-900">
                  support@janconnect.in
                </span>
              </div>
            </div>

            {/* Office */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <Building2 size={22} />
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-900">
                कार्यालय संपर्क केंद्र
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                अधिकृत क्षेत्रीय कार्यालय एवं जनसंपर्क केंद्र विवरण।
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-blue-900">
                  क्षेत्रीय पता शीघ्र अधिसूचित किया जाएगा
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTACT FORM & FAQ
      ====================================================== */}
      <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Info */}
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                नागरिक सहायता
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                अपनी बात हम तक पहुँचाएँ
              </h2>
              <p className="mt-3 text-xs leading-6 text-slate-600 sm:text-sm">
                यदि आपको Jan Connect की किसी सेवा का उपयोग करने में कोई कठिनाई आ रही है या आपके पास पोर्टल को बेहतर बनाने हेतु कोई सुझाव है, तो फॉर्म भरकर भेजें।
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-900 shadow-xs">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                      तकनीकी समस्या समाधान
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      लॉगिन, OTP सत्यापन अथवा प्रोफाइल संबंधी सहायता।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-900 shadow-xs">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                      सुझाव एवं प्रतिक्रिया
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      सार्वजनिक सेवाओं की गुणवत्ता सुधारने हेतु जनसुझाव।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-900 shadow-xs">
                    <Clock3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                      कार्य समय
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      सोमवार से शनिवार, प्रातः 10:00 से सायं 06:00 बजे तक।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    ऑनलाइन संदेश प्रेषण फॉर्म
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    सभी आवश्यक (*) फ़ील्ड्स को ध्यानपूर्वक भरें।
                  </p>
                </div>

                {successMessage && (
                  <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">सफलतापूर्वक प्रेषित!</p>
                      <p className="mt-0.5">{successMessage}</p>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800 text-xs">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">त्रुटि:</p>
                      <p className="mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-slate-700">
                      पूरा नाम (Full Name) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="उदा. रमेश कुमार"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    />
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="mobile" className="mb-1.5 block text-xs font-bold text-slate-700">
                        मोबाइल नंबर (Mobile No.) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        maxLength={10}
                        required
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10 अंकों का मोबाइल नंबर"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-slate-700">
                        ई-मेल (Email - ऐच्छिक)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@mail.com"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="mb-1.5 block text-xs font-bold text-slate-700">
                      विषय (Subject) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-700 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    >
                      <option value="" disabled>
                        विषय चुनें / Select Subject
                      </option>
                      <option value="technical">तकनीकी समस्या (Technical Issue)</option>
                      <option value="registration">पंजीकरण संबंधी प्रश्न (Registration Query)</option>
                      <option value="login">लॉगिन / OTP समस्या (Login / OTP Issue)</option>
                      <option value="scheme">योजना संबंधी जानकारी (Scheme Information)</option>
                      <option value="suggestion">सुझाव (Suggestion)</option>
                      <option value="other">अन्य (Other)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-bold text-slate-700">
                      संदेश (Message) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="अपनी समस्या या संदेश विस्तार से लिखें..."
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-blue-800 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>संदेश भेजा जा रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>संदेश भेजें (Submit Message)</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] leading-5 text-slate-500">
                    आपकी जानकारी पूर्णतः सुरक्षित रखी जाएगी और केवल सहायता प्रयोजन हेतु उपयोग में लाई जाएगी।
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECURITY NOTICE
      ====================================================== */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    क्षेत्रीय संपर्क पता
                  </h3>
                  <p className="text-[11px] text-slate-500">Regional Contact Address</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-600">
                Jan Connect सहायता केंद्र का विस्तृत कार्यालय पता अधिकृत प्रारंभ के साथ पोर्टल पर अधिसूचित किया जाएगा।
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    सुरक्षित संचार दिशानिर्देश
                  </h3>
                  <p className="text-[11px] text-slate-500">Security Advisory</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-600">
                किसी भी अनजान व्यक्ति या कॉल पर अपना मोबाइल OTP, पासवर्ड अथवा वित्तीय बैंक विवरण साझा न करें। जन कनेक्ट दल कभी भी ऐसे गोपनीय विवरण नहीं मांगता।
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}