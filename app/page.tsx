import Head from "next/head";
import {
  ArrowRight,
  FileText,
  LogIn,
  UserPlus,
  Building2,
  MapPin,
  ShieldCheck,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Jan Connect | Citizen Connectivity Portal</title>

        <meta
          name="description"
          content="Jan Connect - Citizen connectivity and public service portal"
        />
      </Head>

      <main className="min-h-screen bg-white text-slate-800">

        {/* =====================================================
            TOP BAR
        ====================================================== */}
        <div className="border-b bg-slate-900 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">

            <p>
              जन कनेक्ट — नागरिक सेवा एवं संपर्क पोर्टल
            </p>

            <div className="flex items-center gap-4">
              <button className="transition hover:text-orange-400">
                हिंदी
              </button>

              <span className="text-slate-500">|</span>

              <button className="transition hover:text-orange-400">
                English
              </button>
            </div>

          </div>
        </div>


        {/* =====================================================
            HEADER / NAVBAR
        ====================================================== */}
        <header className="sticky top-0 z-40 border-b bg-white">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

            {/* Logo */}
            <a href="/" className="group">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-900 text-white">
                  <Building2 size={23} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-blue-900">
                    JAN CONNECT
                  </h1>

                  <p className="text-xs text-slate-500">
                    Citizen Connectivity Portal
                  </p>
                </div>

              </div>

            </a>


            {/* Navigation */}
            <nav className="hidden items-center gap-7 lg:flex">

              <a
                href="/"
                className="font-semibold text-blue-900"
              >
                Home
              </a>

              <a
                href="/about"
                className="font-medium text-slate-600 transition hover:text-blue-900"
              >
                About
              </a>

              <a
                href="/services"
                className="font-medium text-slate-600 transition hover:text-blue-900"
              >
                Services
              </a>

              <a
                href="/schemes"
                className="font-medium text-slate-600 transition hover:text-blue-900"
              >
                Schemes
              </a>

              <a
                href="/notices"
                className="font-medium text-slate-600 transition hover:text-blue-900"
              >
                Notices
              </a>

              <a
                href="/contact"
                className="font-medium text-slate-600 transition hover:text-blue-900"
              >
                Contact
              </a>

            </nav>


            {/* =================================================
                LOGIN DROPDOWN
            ================================================== */}
            <div className="group relative hidden md:block">

              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-blue-900 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800"
              >
                <LogIn size={18} />

                Login

                <ChevronDown
                  size={16}
                  className="transition-transform duration-200 group-hover:rotate-180"
                />
              </button>


              {/* Dropdown */}
              <div
                className="
                  invisible absolute right-0 top-full z-50 mt-2
                  w-80 translate-y-2
                  border border-slate-200
                  bg-white
                  opacity-0
                  shadow-2xl
                  transition-all duration-200
                  group-hover:visible
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >

                {/* Dropdown Header */}
                <div className="border-b bg-slate-50 px-5 py-4">

                  <p className="text-sm font-bold text-blue-900">
                    Login to Jan Connect
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Select your account type to continue
                  </p>

                </div>


                {/* Citizen */}
                <a
                  href="/login/citizen"
                  className="flex items-center gap-4 border-b px-5 py-4 transition hover:bg-blue-50"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-900">
                    <UserPlus size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      Citizen Login
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Login using your mobile number
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto shrink-0 text-slate-400"
                  />

                </a>


                {/* Politician */}
                <a
                  href="/login/politician"
                  className="flex items-center gap-4 border-b px-5 py-4 transition hover:bg-orange-50"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-700">
                    <Building2 size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      Politician Login
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Official representative account
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto shrink-0 text-slate-400"
                  />

                </a>


                {/* PA / Office Staff */}
                <a
                  href="/login/staff"
                  className="flex items-center gap-4 border-b px-5 py-4 transition hover:bg-green-50"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-100 text-green-700">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      PA / Office Staff
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Office staff account
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto shrink-0 text-slate-400"
                  />

                </a>


                {/* Booth Worker */}
                <a
                  href="/login/booth-worker"
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-purple-50"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-purple-100 text-purple-700">
                    <MapPin size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      Booth Worker
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Assigned booth account
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto shrink-0 text-slate-400"
                  />

                </a>

              </div>
            </div>

          </div>
        </header>


        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="border-b bg-slate-50">

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">

            {/* Hero Content */}
            <div>

              <p className="mb-4 font-semibold uppercase tracking-wide text-orange-600">
                नागरिकों से सीधा संपर्क
              </p>

              <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">

                आपकी आवाज़,

                <br />

                <span className="text-blue-900">
                  आपका कनेक्शन
                </span>

              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Jan Connect एक डिजिटल नागरिक संपर्क मंच है, जहाँ नागरिक
                पंजीकरण, सेवाओं, सूचनाओं और सार्वजनिक गतिविधियों से जुड़ी
                जानकारी एक ही स्थान पर प्राप्त कर सकते हैं।
              </p>


              {/* Hero Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">

                <a
                  href="/register"
                  className="flex items-center gap-2 rounded-md bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
                >
                  <UserPlus size={19} />

                  Citizen Registration
                </a>


                <a
                  href="/login"
                  className="flex items-center gap-2 rounded-md border border-blue-900 bg-white px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
                >
                  <LogIn size={19} />

                  Login
                </a>

              </div>

            </div>


            {/* Hero Information Card */}
            <div className="flex justify-center">

              <div className="w-full max-w-md border bg-white shadow-sm">

                {/* Card Header */}
                <div className="border-b px-7 py-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-900">
                      <ShieldCheck size={25} />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-orange-600">
                        JAN CONNECT
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-blue-900">
                        नागरिक सेवा केंद्र
                      </h3>

                    </div>

                  </div>

                </div>


                {/* Services */}
                <div className="space-y-3 p-6">

                  <div className="flex items-center gap-4 border-l-4 border-blue-900 bg-slate-50 p-4">

                    <UserPlus
                      size={21}
                      className="text-blue-900"
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        Citizen Registration
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        अपना नागरिक प्रोफाइल बनाएं
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-4 border-l-4 border-orange-500 bg-slate-50 p-4">

                    <FileText
                      size={21}
                      className="text-orange-600"
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        Public Services
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        उपलब्ध सेवाओं की जानकारी प्राप्त करें
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-4 border-l-4 border-green-600 bg-slate-50 p-4">

                    <Bell
                      size={21}
                      className="text-green-600"
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        Latest Notices
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        महत्वपूर्ण सूचनाएं देखें
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            QUICK SERVICES
        ====================================================== */}
        <section className="py-16">

          <div className="mx-auto max-w-7xl px-4">

            <div className="mb-10">

              <p className="font-semibold text-orange-600">
                QUICK SERVICES
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-900">
                नागरिक सेवाएं
              </h2>

              <p className="mt-3 max-w-2xl text-slate-500">
                नागरिकों के लिए उपलब्ध प्रमुख सेवाओं और सुविधाओं तक
                आसान पहुंच।
              </p>

            </div>


            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {/* Registration */}
              <a
                href="/register"
                className="group border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-900 transition group-hover:bg-blue-900 group-hover:text-white">
                  <UserPlus size={24} />
                </div>

                <h3 className="font-bold text-slate-900">
                  Citizen Registration
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  अपना नागरिक पंजीकरण पूरा करें।
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  View Details
                  <ArrowRight size={16} />
                </div>

              </a>


              {/* Services */}
              <a
                href="/services"
                className="group border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                  <FileText size={24} />
                </div>

                <h3 className="font-bold text-slate-900">
                  Public Services
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  सार्वजनिक सेवाओं की जानकारी प्राप्त करें।
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  View Details
                  <ArrowRight size={16} />
                </div>

              </a>


              {/* Schemes */}
              <a
                href="/schemes"
                className="group border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
                  <ShieldCheck size={24} />
                </div>

                <h3 className="font-bold text-slate-900">
                  Schemes
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  योजनाओं और सुविधाओं की जानकारी देखें।
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  View Details
                  <ArrowRight size={16} />
                </div>

              </a>


              {/* Notices */}
              <a
                href="/notices"
                className="group border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-700 transition group-hover:bg-purple-600 group-hover:text-white">
                  <Bell size={24} />
                </div>

                <h3 className="font-bold text-slate-900">
                  Notices
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  महत्वपूर्ण सूचनाएं और अपडेट देखें।
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  View Details
                  <ArrowRight size={16} />
                </div>

              </a>

            </div>

          </div>

        </section>


        {/* =====================================================
            LATEST NOTICES
        ====================================================== */}
        <section className="border-y bg-slate-50 py-16">

          <div className="mx-auto max-w-7xl px-4">

            <div className="flex items-end justify-between">

              <div>

                <p className="font-semibold text-orange-600">
                  UPDATES
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-900">
                  Latest Notices
                </h2>

              </div>

              <a
                href="/notices"
                className="hidden font-semibold text-blue-900 transition hover:text-orange-600 md:block"
              >
                View All →
              </a>

            </div>


            <div className="mt-8 divide-y border bg-white">

              {[
                "Citizen registration services are now available.",
                "Important public service information will be updated here.",
                "Check this section regularly for latest notices.",
                "New citizen services will be added periodically.",
              ].map((notice, index) => (

                <a
                  href="/notices"
                  key={index}
                  className="flex items-center justify-between p-5 transition hover:bg-slate-50"
                >

                  <div className="flex items-center gap-4">

                    <span className="font-bold text-orange-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-sm font-medium text-slate-700 md:text-base">
                      {notice}
                    </p>

                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-400"
                  />

                </a>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}
        <section className="py-16">

          <div className="mx-auto max-w-7xl px-4 text-center">

            <p className="font-semibold text-orange-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-900">
              Jan Connect का उपयोग कैसे करें?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              कुछ आसान चरणों में Jan Connect से जुड़ें और उपलब्ध
              सुविधाओं का उपयोग करें।
            </p>


            <div className="mt-12 grid gap-10 md:grid-cols-3">

              {/* Step 1 */}
              <div>

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 font-bold text-white">
                  01
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Register
                </h3>

                <p className="mt-2 text-slate-500">
                  अपना नागरिक प्रोफाइल बनाएं और आवश्यक जानकारी दर्ज करें।
                </p>

              </div>


              {/* Step 2 */}
              <div>

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 font-bold text-white">
                  02
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Connect
                </h3>

                <p className="mt-2 text-slate-500">
                  उपलब्ध सेवाओं और सार्वजनिक जानकारी से जुड़ें।
                </p>

              </div>


              {/* Step 3 */}
              <div>

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 font-bold text-white">
                  03
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Stay Updated
                </h3>

                <p className="mt-2 text-slate-500">
                  महत्वपूर्ण सूचनाएं और नए अपडेट प्राप्त करते रहें।
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="bg-blue-900 py-14 text-white">

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                JAN CONNECT
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Jan Connect से जुड़ें
              </h2>

              <p className="mt-2 text-blue-100">
                अपना नागरिक प्रोफाइल आज ही बनाएं।
              </p>

            </div>


            <a
              href="/register"
              className="flex items-center gap-2 bg-orange-600 px-7 py-3 font-semibold transition hover:bg-orange-700"
            >
              Register Now
              <ArrowRight size={18} />
            </a>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="bg-slate-950 text-slate-300">

          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">

            {/* About */}
            <div>

              <h3 className="text-xl font-bold text-white">
                JAN CONNECT
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                नागरिकों को डिजिटल रूप से जोड़ने और सार्वजनिक सेवाओं
                तक बेहतर पहुंच प्रदान करने वाला प्लेटफॉर्म।
              </p>

            </div>


            {/* Quick Links */}
            <div>

              <h4 className="font-semibold text-white">
                Quick Links
              </h4>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/about"
                  className="block transition hover:text-white"
                >
                  About
                </a>

                <a
                  href="/services"
                  className="block transition hover:text-white"
                >
                  Services
                </a>

                <a
                  href="/schemes"
                  className="block transition hover:text-white"
                >
                  Schemes
                </a>

                <a
                  href="/notices"
                  className="block transition hover:text-white"
                >
                  Notices
                </a>

              </div>

            </div>


            {/* Citizen */}
            <div>

              <h4 className="font-semibold text-white">
                Citizen
              </h4>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/register"
                  className="block transition hover:text-white"
                >
                  Registration
                </a>

                <a
                  href="/login/citizen"
                  className="block transition hover:text-white"
                >
                  Citizen Login
                </a>

                <a
                  href="/services"
                  className="block transition hover:text-white"
                >
                  Services
                </a>

                <a
                  href="/contact"
                  className="block transition hover:text-white"
                >
                  Help & Support
                </a>

              </div>

            </div>


            {/* Important */}
            <div>

              <h4 className="font-semibold text-white">
                Important
              </h4>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/privacy"
                  className="block transition hover:text-white"
                >
                  Privacy Policy
                </a>

                <a
                  href="/terms"
                  className="block transition hover:text-white"
                >
                  Terms of Use
                </a>

                <a
                  href="/accessibility"
                  className="block transition hover:text-white"
                >
                  Accessibility
                </a>

                <a
                  href="/contact"
                  className="block transition hover:text-white"
                >
                  Contact Us
                </a>

              </div>

            </div>

          </div>


          {/* Copyright */}
          <div className="border-t border-slate-800">

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-500 md:flex-row">

              <p>
                © 2026 Jan Connect. All Rights Reserved.
              </p>

              <p>
                Citizen Connectivity Portal in Satna
              </p>

            </div>

          </div>

        </footer>

      </main>
    </>
  );
}