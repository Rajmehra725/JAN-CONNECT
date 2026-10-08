import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-600 sm:px-6 lg:px-8">
          <p>नागरिक संपर्क एवं सार्वजनिक सेवा पोर्टल</p>

          <div className="hidden items-center gap-4 sm:flex">
            <span>हिंदी</span>
            <span className="text-slate-300">|</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-blue-900 text-white">
              <ShieldCheck size={24} />
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-tight text-blue-950">
                JAN CONNECT
              </div>

              <div className="text-xs font-medium text-slate-500">
                नागरिक संपर्क पोर्टल
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              होम
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              हमारे बारे में
            </Link>

            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              सेवाएँ
            </Link>

            <Link
              href="/schemes"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              योजनाएँ
            </Link>

            <Link
              href="/notices"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              सूचनाएँ
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-blue-900"
            >
              संपर्क
            </Link>
          </nav>

          <Link
            href="/login/citizen"
            className="inline-flex items-center gap-2 bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            लॉगिन
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <MessageSquare size={15} />
              नागरिक सहायता एवं संपर्क
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl lg:text-5xl">
              हमसे
              <span className="text-orange-600"> संपर्क करें</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Jan Connect से संबंधित सहायता, सुझाव, तकनीकी समस्या या
              सामान्य जानकारी के लिए हमसे संपर्क करें।
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Phone */}
            <div className="border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center bg-blue-50 text-blue-900">
                <Phone size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                फोन सहायता
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                सहायता या सामान्य जानकारी के लिए संपर्क करें।
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-blue-900">
                  सहायता नंबर जल्द उपलब्ध होगा
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center bg-orange-50 text-orange-700">
                <Mail size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                ई-मेल सहायता
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                सुझाव, तकनीकी समस्या या सहायता संबंधी संदेश भेजें।
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-blue-900">
                  support@janconnect.in
                </span>
              </div>
            </div>

            {/* Office */}
            <div className="border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center bg-green-50 text-green-700">
                <Building2 size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                कार्यालय / संपर्क केंद्र
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Jan Connect के संपर्क एवं सहायता केंद्र से संबंधित जानकारी।
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-blue-900">
                  जानकारी जल्द उपलब्ध होगी
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                सहायता केंद्र
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                अपनी बात हम तक पहुँचाएँ
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                यदि आपको Jan Connect की किसी सेवा का उपयोग करने में समस्या
                आ रही है या आपके पास कोई सुझाव है, तो नीचे दिए गए संपर्क
                फॉर्म के माध्यम से अपनी जानकारी भेज सकते हैं।
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-blue-900 shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      तकनीकी सहायता
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Login, registration या portal से संबंधित तकनीकी समस्या
                      की जानकारी भेजें।
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-blue-900 shadow-sm">
                    <MessageSquare size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      सुझाव एवं प्रतिक्रिया
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      पोर्टल को बेहतर बनाने के लिए अपने सुझाव और feedback
                      साझा करें।
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-blue-900 shadow-sm">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      सहायता का समय
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      सहायता केंद्र के समय और उपलब्धता की जानकारी आगे
                      प्रकाशित की जाएगी।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  संपर्क फॉर्म
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  अपनी समस्या या संदेश की जानकारी दें।
                </p>
              </div>

              <form className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    पूरा नाम
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="अपना नाम दर्ज करें"
                    className="w-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  />
                </div>

                {/* Mobile + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      मोबाइल नंबर
                    </label>

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      maxLength={10}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      className="w-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      ई-मेल
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      className="w-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    विषय
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    defaultValue=""
                    className="w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  >
                    <option value="" disabled>
                      विषय चुनें
                    </option>
                    <option value="technical">
                      तकनीकी समस्या
                    </option>
                    <option value="registration">
                      पंजीयन संबंधी समस्या
                    </option>
                    <option value="login">
                      लॉगिन संबंधी समस्या
                    </option>
                    <option value="suggestion">
                      सुझाव
                    </option>
                    <option value="feedback">
                      प्रतिक्रिया
                    </option>
                    <option value="other">
                      अन्य
                    </option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    संदेश
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="अपना संदेश या समस्या विस्तार से लिखें..."
                    className="w-full resize-none border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 bg-blue-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  संदेश भेजें
                  <Send size={17} />
                </button>

                <p className="text-center text-xs leading-5 text-slate-500">
                  आपकी दी गई जानकारी का उपयोग केवल सहायता एवं संपर्क के
                  उद्देश्य से किया जाएगा।
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-blue-50 text-blue-900">
                  <MapPin size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    संपर्क पता
                  </h2>

                  <p className="text-xs text-slate-500">
                    Contact Address
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Jan Connect संपर्क केंद्र का विस्तृत पता जल्द उपलब्ध कराया
                जाएगा।
              </p>
            </div>

            <div className="border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-orange-50 text-orange-700">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    सुरक्षित संपर्क
                  </h2>

                  <p className="text-xs text-slate-500">
                    Secure Communication
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                किसी भी अनजान व्यक्ति के साथ अपना OTP, पासवर्ड या अन्य
                संवेदनशील जानकारी साझा न करें।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-950 py-14">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Jan Connect से जुड़ें
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100">
            नागरिक पंजीयन करके Jan Connect की उपलब्ध सेवाओं और सुविधाओं
            का उपयोग करें।
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              नागरिक पंजीयन करें
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-blue-700 bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              सेवाएँ देखें
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="font-extrabold text-blue-950">
                JAN CONNECT
              </div>

              <p className="mt-1 text-xs text-slate-500">
                नागरिक संपर्क एवं सार्वजनिक सेवा पोर्टल
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-blue-900">
                गोपनीयता नीति
              </Link>

              <Link href="/terms" className="hover:text-blue-900">
                नियम एवं शर्तें
              </Link>

              <Link href="/contact" className="font-semibold text-blue-900">
                संपर्क
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
            © 2026 Jan Connect. सर्वाधिकार सुरक्षित।
          </div>
        </div>
      </footer>
    </main>
  );
}