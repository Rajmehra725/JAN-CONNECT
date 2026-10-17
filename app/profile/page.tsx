"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Save,
  Building,
  CreditCard,
  Briefcase
} from "lucide-react";
import { useAuth, getDashboardPath } from "@/lib/auth-context";
import { authApi, uploadsApi } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [occupation, setOccupation] = useState("");
  const [designation, setDesignation] = useState("");
  const [voterId, setVoterId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("hi");
  const [address, setAddress] = useState("");
  const [villageMohalla, setVillageMohalla] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [boothNumber, setBoothNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [assemblyConstituency, setAssemblyConstituency] = useState("");
  const [pincode, setPincode] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback States
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setAlternateMobile(user.alternateMobile || "");
      if (user.gender) setGender(user.gender);
      setOccupation(user.occupation || "");
      setDesignation(user.designation || "");
      setVoterId(user.voterId || "");
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "");
      setPreferredLanguage(user.preferredLanguage || "hi");
      setAddress(user.address || "");
      setVillageMohalla(user.villageMohalla || "");
      setWardNumber(user.wardNumber || "");
      setBoothNumber(user.boothNumber || "");
      setDistrict(user.district || "");
      setAssemblyConstituency(user.assemblyConstituency || "");
      setPincode(user.pincode || "");
      setEmergencyContact(user.emergencyContact || "");
      setProfilePhoto(user.profilePhoto || "");
    }
  }, [user]);

  const handleProfilePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setProfileError("");
    setProfileSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await uploadsApi.uploadFile(formData);
      if (uploadRes.success && uploadRes.data?.url) {
        const newPhotoUrl = uploadRes.data.url;
        setProfilePhoto(newPhotoUrl);
        // Save immediately to profile
        await authApi.updateProfile({ profilePhoto: newPhotoUrl });
        await refreshUser();
        setProfileSuccess("प्रोफाइल फोटो सफलतापूर्वक अद्यतित की गई।");
      } else {
        setProfileError(uploadRes.message || "फोटो अपलोड करने में त्रुटि हुई।");
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "फोटो अपलोड विफल रहा।");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    if (!fullName.trim()) {
      setProfileError("पूरा नाम अनिवार्य है।");
      setSavingProfile(false);
      return;
    }

    try {
      const res = await authApi.updateProfile({
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        alternateMobile: alternateMobile.trim() || undefined,
        gender,
        occupation: occupation.trim() || undefined,
        designation: designation.trim() || undefined,
        voterId: voterId.trim().toUpperCase() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        preferredLanguage,
        address: address.trim() || undefined,
        villageMohalla: villageMohalla.trim() || undefined,
        wardNumber: wardNumber.trim() || undefined,
        boothNumber: boothNumber.trim() || undefined,
        district: district.trim() || undefined,
        assemblyConstituency: assemblyConstituency.trim() || undefined,
        pincode: pincode.trim() || undefined,
        emergencyContact: emergencyContact.trim() || undefined,
      });

      if (res.success) {
        await refreshUser();
        setProfileSuccess("प्रोफाइल विवरण सफलतापूर्वक सहेजा गया।");
      } else {
        setProfileError(res.message || "प्रोफाइल अद्यतन विफल रहा।");
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("वर्तमान पासवर्ड अनिवार्य है।");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await authApi.changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordSuccess("पासवर्ड सफलतापूर्वक बदल दिया गया है।");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(res.message || "पासवर्ड परिवर्तन विफल रहा।");
      }
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
          <span className="text-base font-bold">प्रोफाइल लोड हो रही है...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-slate-100">
        <p className="text-sm font-bold text-slate-400">प्रोफाइल देखने के लिए कृपया लॉगिन करें।</p>
        <Link
          href="/login/citizen"
          className="mt-4 rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-500"
        >
          लॉगिन पृष्ठ पर जाएं
        </Link>
      </div>
    );
  }

  const dashboardHref = getDashboardPath(user.role);

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={dashboardHref}
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            डैशबोर्ड पर वापस जाएं
          </Link>
          <span className="rounded-full border border-orange-500/30 bg-orange-950/60 px-3 py-1 text-xs font-bold text-orange-400">
            भूमिका: {user.role}
          </span>
        </div>

        {/* User Profile Card Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="relative group shrink-0">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
              {profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profilePhoto}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={40} className="text-slate-500" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-2 -right-2 rounded-xl bg-orange-600 p-2 text-white shadow-md hover:bg-orange-500 transition disabled:opacity-50"
              title="फोटो बदलें"
            >
              {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoSelect}
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-black text-white">{user.fullName}</h1>
            <p className="text-xs text-orange-400 font-bold mt-0.5">
              {user.designation || "पद: अनिर्दिष्ट"}
            </p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Phone size={12} className="text-slate-500" />
                +91 {user.mobileNumber}
              </span>
              {user.email && (
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-slate-500" />
                  {user.email}
                </span>
              )}
              {user.voterId && (
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <CreditCard size={12} className="text-slate-500" />
                  EPIC: {user.voterId}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center rounded-full border border-emerald-800 bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                खाता स्थिति: {user.accountStatus || "ACTIVE"}
              </span>
              {user.createdAt && (
                <span className="text-[11px] text-slate-500">
                  पंजीकरण: {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Alerts */}
        {profileSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/80 p-4 text-xs text-emerald-200">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <p className="font-semibold">{profileSuccess}</p>
          </div>
        )}

        {profileError && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-800 bg-rose-950/80 p-4 text-xs text-rose-200">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <p className="font-semibold">{profileError}</p>
          </div>
        )}

        {/* Profile Edit Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User size={18} className="text-orange-400" />
              व्यक्तिगत एवं संगठनात्मक विवरण (Profile Information)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              कृपया अपना सही व अद्यतित विवरण दर्ज करें। भूमिका परिवर्तन हेतु केवल सुपर एडमिन अधिकृत हैं।
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  पूरा नाम (Full Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  पंजीकृत मोबाइल (Mobile Number)
                </label>
                <input
                  type="text"
                  disabled
                  value={`+91 ${user.mobileNumber}`}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 font-mono text-slate-500 outline-none cursor-not-allowed"
                  title="मोबाइल नंबर प्राथमिक पहचान है और इसे बदला नहीं जा सकता"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">ईमेल (Email Address)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">वैकल्पिक मोबाइल (Alternate Mobile)</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98XXXXXXXX"
                  value={alternateMobile}
                  onChange={(e) => setAlternateMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">पद / दायित्व (Designation)</label>
                <input
                  type="text"
                  placeholder="उदा. मंडल प्रभारी, बूथ संयोजक"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">मतदाता पहचान पत्र (Voter ID / EPIC)</label>
                <input
                  type="text"
                  placeholder="उदा. MP/01/123/456789"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">लिंग (Gender)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE" | "OTHER")}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                >
                  <option value="MALE">पुरुष (Male)</option>
                  <option value="FEMALE">महिला (Female)</option>
                  <option value="OTHER">अन्य (Other)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">जन्म तिथि (Date of Birth)</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">व्यवसाय (Occupation)</label>
                <input
                  type="text"
                  placeholder="उदा. व्यापार, सेवा, कृषक"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">आपातकालीन संपर्क (Emergency Contact)</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="आपातकालीन संपर्क नंबर"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Geographical & Address Section */}
            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <MapPin size={14} className="text-orange-400" />
                क्षेत्रीय व मतदान विवरण (Location & Booth Assignment)
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">वार्ड नंबर (Ward Number)</label>
                  <input
                    type="text"
                    placeholder="उदा. 42"
                    value={wardNumber}
                    onChange={(e) => setWardNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-slate-300">बूथ नंबर (Booth Number)</label>
                  <input
                    type="text"
                    placeholder="उदा. 108"
                    value={boothNumber}
                    onChange={(e) => setBoothNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-slate-300">पिनकोड (Pincode)</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="उदा. 462001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-slate-300">विधानसभा क्षेत्र (Assembly Constituency)</label>
                  <input
                    type="text"
                    placeholder="उदा. गोविंदपुरा"
                    value={assemblyConstituency}
                    onChange={(e) => setAssemblyConstituency(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-slate-300">जिला (District)</label>
                  <input
                    type="text"
                    placeholder="उदा. भोपाल"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-slate-300">गांव / मोहल्ला (Village / Mohalla)</label>
                  <input
                    type="text"
                    placeholder="उदा. कस्तूरबा नगर"
                    value={villageMohalla}
                    onChange={(e) => setVillageMohalla(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="mb-1 block font-bold text-slate-300">स्थाई पता (Full Address)</label>
                  <input
                    type="text"
                    placeholder="मकान नंबर, गली, क्षेत्र..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-500 disabled:opacity-60 transition"
              >
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                प्रोफाइल सुरक्षित करें (Save Profile)
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-rose-400" />
              पासवर्ड बदलें (Change Password)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              अकाउंट सुरक्षा के लिए नियमित रूप से पासवर्ड अपडेट करें।
            </p>
          </div>

          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/80 p-3 text-xs text-emerald-200">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <p className="font-semibold">{passwordSuccess}</p>
            </div>
          )}

          {passwordError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-800 bg-rose-950/80 p-3 text-xs text-rose-200">
              <AlertCircle size={15} className="text-rose-400 shrink-0" />
              <p className="font-semibold">{passwordError}</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  वर्तमान पासवर्ड (Current Password) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  नया पासवर्ड (New Password) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  नया पासवर्ड पुष्टि करें (Confirm) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-60 transition"
              >
                {changingPassword ? <Loader2 size={14} className="animate-spin" /> : null}
                पासवर्ड अपडेट करें
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
