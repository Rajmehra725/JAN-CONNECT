"use client";

import { FormEvent, useState } from "react";
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
} from "lucide-react";

export default function RegisterPage() {
  const [photoName, setPhotoName] = useState("");
  const [gpsLocation, setGpsLocation] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("आपके browser में GPS location support नहीं है।");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setGpsLocation(
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        );

        setGettingLocation(false);
      },
      () => {
        alert(
          "GPS location प्राप्त नहीं हो सकी। कृपया location permission allow करें।"
        );

        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(true);

    // Backend API बाद में यहाँ connect करेंगे.
    console.log("Citizen registration submitted");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">

      {/* Top Bar */}
      <div className="border-b bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
          <p>जन कनेक्ट — नागरिक सेवा एवं संपर्क पोर्टल</p>

          <div className="flex gap-4">
            <button>हिंदी</button>
            <button>English</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-900 text-white">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                JAN CONNECT
              </h1>

              <p className="text-xs text-slate-500">
                Citizen Connectivity Portal
              </p>
            </div>
          </a>

          <a
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-orange-600"
          >
            <ArrowLeft size={17} />
            Back to Home
          </a>

        </div>
      </header>

      {/* Page Heading */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">

          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Citizen Registration
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-900 md:text-4xl">
            नागरिक पंजीकरण
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Jan Connect से जुड़ने के लिए अपना नागरिक प्रोफाइल बनाएं।
            कृपया नीचे दी गई जानकारी सही एवं पूर्ण रूप से दर्ज करें।
          </p>

        </div>
      </section>

      {/* Form */}
      <section className="py-10">

        <div className="mx-auto max-w-5xl px-4">

          {submitted && (
            <div className="mb-6 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle2 className="mt-0.5 shrink-0" size={20} />

              <div>
                <p className="font-semibold">
                  Registration form submitted successfully.
                </p>

                <p className="mt-1 text-sm">
                  अभी यह demo submission है। Backend connect होने के बाद
                  आपका data MongoDB में save किया जाएगा।
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="border border-slate-200 bg-white shadow-sm"
          >

            {/* =================================================
                PERSONAL INFORMATION
            ================================================== */}
            <div className="border-b px-6 py-5 md:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-900">
                  <User size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-blue-900">
                    Personal Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    व्यक्तिगत जानकारी
                  </p>
                </div>

              </div>

            </div>

            <div className="grid gap-6 px-6 py-7 md:grid-cols-2 md:px-8">

              {/* Full Name */}
              <FormField
                label="Full Name"
                hindi="पूरा नाम"
                required
                icon={<User size={17} />}
              >
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="input-field"
                />
              </FormField>

              {/* Mobile */}
              <FormField
                label="Mobile Number"
                hindi="मोबाइल नंबर"
                required
                icon={<Phone size={17} />}
              >
                <input
                  name="mobile"
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="10 digit mobile number"
                  className="input-field"
                />
              </FormField>

              {/* Alternate Mobile */}
              <FormField
                label="Alternate Mobile Number"
                hindi="वैकल्पिक मोबाइल नंबर"
                icon={<Phone size={17} />}
              >
                <input
                  name="alternateMobile"
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="Alternate mobile number"
                  className="input-field"
                />
              </FormField>

              {/* DOB */}
              <FormField
                label="Date of Birth"
                hindi="जन्म तिथि"
                required
                icon={<CalendarDays size={17} />}
              >
                <input
                  name="dateOfBirth"
                  type="date"
                  required
                  className="input-field"
                />
              </FormField>

              {/* Gender */}
              <FormField
                label="Gender"
                hindi="लिंग"
                required
              >
                <select
                  name="gender"
                  required
                  className="input-field"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="MALE">Male / पुरुष</option>
                  <option value="FEMALE">Female / महिला</option>
                  <option value="OTHER">Other / अन्य</option>
                </select>
              </FormField>

              {/* Occupation */}
              <FormField
                label="Occupation"
                hindi="व्यवसाय"
                icon={<BriefcaseBusiness size={17} />}
              >
                <input
                  name="occupation"
                  type="text"
                  placeholder="Enter occupation"
                  className="input-field"
                />
              </FormField>

              {/* Email */}
              <FormField
                label="Email Address"
                hindi="ईमेल"
                icon={<Mail size={17} />}
              >
                <input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  className="input-field"
                />
              </FormField>

              {/* Preferred Language */}
              <FormField
                label="Preferred Language"
                hindi="पसंदीदा भाषा"
                required
                icon={<Languages size={17} />}
              >
                <select
                  name="preferredLanguage"
                  required
                  defaultValue=""
                  className="input-field"
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  <option value="HINDI">Hindi / हिंदी</option>
                  <option value="ENGLISH">English</option>
                </select>
              </FormField>

            </div>


            {/* =================================================
                PROFILE PHOTO
            ================================================== */}
            <div className="border-y bg-slate-50 px-6 py-5 md:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-orange-700">
                  <Camera size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-blue-900">
                    Profile Photo
                  </h3>

                  <p className="text-sm text-slate-500">
                    प्रोफाइल फोटो
                  </p>
                </div>

              </div>

            </div>

            <div className="px-6 py-7 md:px-8">

              <div className="max-w-md">

                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-blue-400 hover:bg-blue-50">

                  <Camera
                    size={30}
                    className="text-blue-900"
                  />

                  <span className="mt-3 font-semibold text-slate-700">
                    {photoName || "Upload Profile Photo"}
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    JPG, JPEG or PNG
                  </span>

                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setPhotoName(file.name);
                      }
                    }}
                  />

                </label>

              </div>

            </div>


            {/* =================================================
                ADDRESS INFORMATION
            ================================================== */}
            <div className="border-y bg-slate-50 px-6 py-5 md:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 text-green-700">
                  <MapPin size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-blue-900">
                    Address & Location
                  </h3>

                  <p className="text-sm text-slate-500">
                    पता एवं क्षेत्र की जानकारी
                  </p>
                </div>

              </div>

            </div>

            <div className="grid gap-6 px-6 py-7 md:grid-cols-2 md:px-8">

              {/* Address */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="address"
                  required
                  rows={3}
                  placeholder="Enter complete address"
                  className="input-field resize-none"
                />

              </div>

              {/* Village */}
              <FormField
                label="Village / Mohalla"
                hindi="गांव / मोहल्ला"
                required
              >
                <input
                  name="villageMohalla"
                  type="text"
                  required
                  placeholder="Village / Mohalla"
                  className="input-field"
                />
              </FormField>

              {/* Ward */}
              <FormField
                label="Ward Number"
                hindi="वार्ड नंबर"
              >
                <input
                  name="wardNumber"
                  type="text"
                  placeholder="Ward number"
                  className="input-field"
                />
              </FormField>

              {/* Booth */}
              <FormField
                label="Booth Number"
                hindi="बूथ नंबर"
              >
                <input
                  name="boothNumber"
                  type="text"
                  placeholder="Booth number"
                  className="input-field"
                />
              </FormField>

              {/* District */}
              <FormField
                label="District"
                hindi="जिला"
                required
              >
                <input
                  name="district"
                  type="text"
                  required
                  placeholder="District"
                  className="input-field"
                />
              </FormField>

              {/* Assembly */}
              <FormField
                label="Assembly Constituency"
                hindi="विधानसभा क्षेत्र"
                required
              >
                <input
                  name="assemblyConstituency"
                  type="text"
                  required
                  placeholder="Assembly Constituency"
                  className="input-field"
                />
              </FormField>

              {/* Pincode */}
              <FormField
                label="Pincode"
                hindi="पिनकोड"
                required
              >
                <input
                  name="pincode"
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="6 digit pincode"
                  className="input-field"
                />
              </FormField>

              {/* GPS */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  GPS Location
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="relative flex-1">

                    <Navigation
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="gpsLocation"
                      type="text"
                      readOnly
                      value={gpsLocation}
                      placeholder="GPS coordinates will appear here"
                      className="input-field pl-10"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    className="flex items-center justify-center gap-2 rounded-md bg-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Navigation size={17} />

                    {gettingLocation
                      ? "Getting Location..."
                      : "Get My Location"}
                  </button>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  GPS location आपके browser की permission के आधार पर
                  प्राप्त की जाएगी।
                </p>

              </div>

            </div>


            {/* =================================================
                FAMILY & EMERGENCY
            ================================================== */}
            <div className="border-y bg-slate-50 px-6 py-5 md:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 text-purple-700">
                  <Users size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-blue-900">
                    Family & Emergency Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    परिवार एवं आपातकालीन संपर्क
                  </p>
                </div>

              </div>

            </div>

            <div className="grid gap-6 px-6 py-7 md:grid-cols-2 md:px-8">

              {/* Family ID */}
              <FormField
                label="Family ID"
                hindi="परिवार आईडी"
                icon={<Users size={17} />}
              >
                <input
                  name="familyId"
                  type="text"
                  placeholder="Enter Family ID"
                  className="input-field"
                />
              </FormField>

              {/* Emergency */}
              <FormField
                label="Emergency Contact"
                hindi="आपातकालीन संपर्क नंबर"
                required
                icon={<Phone size={17} />}
              >
                <input
                  name="emergencyContact"
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="Emergency contact number"
                  className="input-field"
                />
              </FormField>

            </div>


            {/* =================================================
                CONSENT
            ================================================== */}
            <div className="border-y bg-slate-50 px-6 py-6 md:px-8">

              <label className="flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-1 h-4 w-4 accent-blue-900"
                />

                <span className="text-sm leading-6 text-slate-600">
                  मैं प्रमाणित करता/करती हूँ कि मेरे द्वारा दी गई
                  जानकारी मेरी जानकारी के अनुसार सही है। मैं Jan Connect
                  के{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="font-semibold text-blue-900 underline"
                  >
                    Terms & Conditions
                  </a>{" "}
                  और{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="font-semibold text-blue-900 underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  से सहमत हूँ।
                </span>

              </label>

            </div>


            {/* =================================================
                SUBMIT
            ================================================== */}
            <div className="flex flex-col items-center justify-between gap-4 px-6 py-7 sm:flex-row md:px-8">

              <p className="text-xs text-slate-500">
                <span className="text-red-500">*</span> Required fields
              </p>

              <div className="flex w-full gap-3 sm:w-auto">

                <a
                  href="/"
                  className="flex flex-1 items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-800 sm:flex-none"
                >
                  <CheckCircle2 size={18} />
                  Submit Registration
                </button>

              </div>

            </div>

          </form>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t bg-slate-950 text-slate-400">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm md:flex-row">

          <p>
            © 2026 Jan Connect. All Rights Reserved.
          </p>

          <p>
            Citizen Connectivity Portal
          </p>

        </div>

      </footer>

    </main>
  );
}


/* =============================================================
   FORM FIELD COMPONENT
============================================================= */

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
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

        {icon && (
          <span className="text-blue-900">
            {icon}
          </span>
        )}

        <span>
          {label}

          {hindi && (
            <span className="ml-1 font-normal text-slate-400">
              ({hindi})
            </span>
          )}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </span>

      </label>

      {children}
    </div>
  );
}