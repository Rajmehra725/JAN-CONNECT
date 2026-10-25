"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save, UserCheck, Shield, MapPin, Briefcase, User as UserIcon, AlertCircle } from "lucide-react";
import { UserProfile, GeographyHierarchy, DesignationItem, DepartmentItem, usersApi } from "@/lib/api";

interface UserFormModalProps {
  isOpen: boolean;
  mode: "CREATE" | "EDIT";
  initialUser?: UserProfile | null;
  hierarchy: GeographyHierarchy | null;
  designations: DesignationItem[];
  departments: DepartmentItem[];
  onClose: () => void;
  onSuccess: (savedUser: UserProfile) => void;
}

export default function UserFormModal({
  isOpen,
  mode,
  initialUser,
  hierarchy,
  designations,
  departments,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const [activeSection, setActiveSection] = useState<"basic" | "professional" | "geography" | "account">("basic");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Basic Info
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [occupation, setOccupation] = useState("");
  const [voterId, setVoterId] = useState("");
  const [familyId, setFamilyId] = useState("");

  // 2. Professional / Designation
  const [designationCategory, setDesignationCategory] = useState<"POLITICAL" | "ORGANIZATIONAL" | "ADMINISTRATIVE">("POLITICAL");
  const [selectedDesignationId, setSelectedDesignationId] = useState("");
  const [customDesignation, setCustomDesignation] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officeContact, setOfficeContact] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  // 3. Geographical
  const [state, setState] = useState("Madhya Pradesh");
  const [district, setDistrict] = useState("सतना");
  const [areaType, setAreaType] = useState<"RURAL" | "URBAN">("RURAL");
  const [tehsil, setTehsil] = useState("");
  const [developmentBlock, setDevelopmentBlock] = useState("");
  const [gramPanchayat, setGramPanchayat] = useState("");
  const [village, setVillage] = useState("");
  const [localBody, setLocalBody] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [assemblyConstituency, setAssemblyConstituency] = useState("");
  const [parliamentaryConstituency, setParliamentaryConstituency] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // 4. Account & Verification
  const [role, setRole] = useState<"SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN">("CITIZEN");
  const [accountStatus, setAccountStatus] = useState<"ACTIVE" | "SUSPENDED" | "DEACTIVATED">("ACTIVE");
  const [verificationStatus, setVerificationStatus] = useState<"UNVERIFIED" | "VERIFIED" | "REJECTED" | "FLAGGED">("UNVERIFIED");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [isPublicDirectoryVisible, setIsPublicDirectoryVisible] = useState(false);

  // Initialize or reset form on open / initialUser change
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "EDIT" && initialUser) {
      setFullName(initialUser.fullName || "");
      setMobileNumber(initialUser.mobileNumber || "");
      setPassword("");
      setAlternateMobile(initialUser.alternateMobile || "");
      setEmail(initialUser.email || "");
      setGender(initialUser.gender || "MALE");
      setOccupation(initialUser.occupation || "");
      setVoterId(initialUser.voterId || "");
      setFamilyId(initialUser.familyId || "");

      // Professional
      setDesignationCategory(initialUser.designationCategory || "POLITICAL");
      const dId = typeof initialUser.designationId === "object" ? initialUser.designationId?._id : initialUser.designationId;
      setSelectedDesignationId(dId || "");
      setCustomDesignation(initialUser.designation || "");
      const deptId = typeof initialUser.departmentId === "object" ? initialUser.departmentId?._id : initialUser.departmentId;
      setSelectedDepartmentId(deptId || "");
      setCustomDepartment(initialUser.department || "");
      setOfficialEmail(initialUser.officialEmail || "");
      setOfficeContact(initialUser.officeContact || "");
      setOfficeAddress(initialUser.officeAddress || "");

      // Geography
      setState(initialUser.state || "Madhya Pradesh");
      setDistrict(initialUser.district || "सतना");
      setAreaType(initialUser.areaType || "RURAL");
      setTehsil(initialUser.tehsil || "");
      setDevelopmentBlock(initialUser.developmentBlock || "");
      setGramPanchayat(initialUser.gramPanchayat || "");
      setVillage(initialUser.village || "");
      setLocalBody(initialUser.localBody || "");
      setWardNumber(initialUser.wardNumber || "");
      setAssemblyConstituency(initialUser.assemblyConstituency || "");
      setParliamentaryConstituency(initialUser.parliamentaryConstituency || "");
      setAddress(initialUser.address || "");
      setPincode(initialUser.pincode || "");

      // Account
      setRole(initialUser.role || "CITIZEN");
      setAccountStatus(initialUser.accountStatus || "ACTIVE");
      setVerificationStatus(initialUser.verificationStatus || "UNVERIFIED");
      setVerificationNotes(initialUser.verificationNotes || "");
      setIsPublicDirectoryVisible(Boolean(initialUser.isPublicDirectoryVisible));
    } else {
      // Default creation state
      setFullName("");
      setMobileNumber("");
      setPassword("Pass@2026#");
      setAlternateMobile("");
      setEmail("");
      setGender("MALE");
      setOccupation("");
      setVoterId("");
      setFamilyId("");

      setDesignationCategory("POLITICAL");
      setSelectedDesignationId("");
      setCustomDesignation("");
      setSelectedDepartmentId("");
      setCustomDepartment("");
      setOfficialEmail("");
      setOfficeContact("");
      setOfficeAddress("");

      setState("Madhya Pradesh");
      setDistrict("सतना");
      setAreaType("RURAL");
      setTehsil("");
      setDevelopmentBlock("");
      setGramPanchayat("");
      setVillage("");
      setLocalBody("");
      setWardNumber("");
      setAssemblyConstituency("सतना");
      setParliamentaryConstituency("सतना");
      setAddress("");
      setPincode("");

      setRole("CITIZEN");
      setAccountStatus("ACTIVE");
      setVerificationStatus("UNVERIFIED");
      setVerificationNotes("");
      setIsPublicDirectoryVisible(false);
    }

    setActiveSection("basic");
    setErrorMsg("");
  }, [isOpen, mode, initialUser]);

  if (!isOpen) return null;

  // Sync designation title if designationId changes
  const handleDesignationSelect = (id: string) => {
    setSelectedDesignationId(id);
    if (!id) return;
    const match = designations.find((d) => d._id === id);
    if (match) {
      setCustomDesignation(match.title);
      setDesignationCategory(match.category);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("सदस्य का पूरा नाम अनिवार्य है।");
      setActiveSection("basic");
      return;
    }

    if (!mobileNumber.trim()) {
      setErrorMsg("मोबाइल नंबर अनिवार्य है।");
      setActiveSection("basic");
      return;
    }

    if (mode === "CREATE" && !password) {
      setErrorMsg("पासवर्ड अनिवार्य है।");
      setActiveSection("basic");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        alternateMobile: alternateMobile.trim() || undefined,
        email: email.trim() || undefined,
        gender,
        occupation: occupation.trim() || undefined,
        voterId: voterId.trim() || undefined,
        familyId: familyId.trim() || undefined,
        // Professional
        designationCategory,
        designationId: selectedDesignationId || undefined,
        designation: customDesignation.trim() || undefined,
        departmentId: selectedDepartmentId || undefined,
        department: customDepartment.trim() || undefined,
        officialEmail: officialEmail.trim() || undefined,
        officeContact: officeContact.trim() || undefined,
        officeAddress: officeAddress.trim() || undefined,
        // Geography
        state: state.trim() || "Madhya Pradesh",
        district: district.trim(),
        areaType,
        tehsil: tehsil.trim() || undefined,
        developmentBlock: areaType === "RURAL" ? developmentBlock.trim() : undefined,
        gramPanchayat: areaType === "RURAL" ? gramPanchayat.trim() : undefined,
        village: areaType === "RURAL" ? village.trim() : undefined,
        localBody: areaType === "URBAN" ? localBody.trim() : undefined,
        wardNumber: areaType === "URBAN" ? wardNumber.trim() : undefined,
        assemblyConstituency: assemblyConstituency.trim() || undefined,
        parliamentaryConstituency: parliamentaryConstituency.trim() || undefined,
        address: address.trim() || undefined,
        pincode: pincode.trim() || undefined,
        // Account
        role,
        accountStatus,
        verificationStatus,
        verificationNotes: verificationNotes.trim() || undefined,
        isPublicDirectoryVisible,
      };

      if (mode === "CREATE") {
        payload.password = password;
        const res = await usersApi.createUser(payload);
        if (res.success && res.data) {
          onSuccess(res.data.user);
          onClose();
        } else {
          setErrorMsg(res.message || "सदस्य जोड़ने में त्रुटि हुई।");
        }
      } else if (initialUser?._id) {
        const res = await usersApi.update(initialUser._id, payload);
        if (res.success && res.data) {
          onSuccess(res.data.user);
          onClose();
        } else {
          setErrorMsg(res.message || "प्रोफ़ाइल अपडेट करने में त्रुटि हुई।");
        }
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || "अनपेक्षित त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDesignations = designations.filter((d) => d.category === designationCategory && d.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-linear-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-lg">
              {mode === "CREATE" ? <UserIcon className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {mode === "CREATE" ? "नया सदस्य / जनप्रतिनिधि जोड़ें" : `सदस्य प्रोफ़ाइल संपादन: ${initialUser?.fullName}`}
              </h3>
              <p className="text-xs text-orange-100">
                {mode === "CREATE"
                  ? "सभी श्रेणियां एवं पदानुक्रम मास्टर डेटा से जुड़े हैं"
                  : `ID: ${initialUser?.mobileNumber} | वर्तमान भूमिका: ${initialUser?.role}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveSection("basic")}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeSection === "basic"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>1. बुनियादी विवरण</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("professional")}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeSection === "professional"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. पद एवं विभाग</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("geography")}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeSection === "geography"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>3. भौगोलिक पदानुक्रम</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("account")}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeSection === "account"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>4. खाता एवं सत्यापन</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[62vh] overflow-y-auto space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: Basic Information */}
            {activeSection === "basic" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      पूरा नाम (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="उदा. रमेश कुमार शर्मा"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      मोबाइल नंबर (Mobile Number) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      disabled={mode === "EDIT"}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                    {mode === "EDIT" && (
                      <p className="text-[11px] text-slate-400 mt-0.5">मोबाइल नंबर प्राथमिक खाता आईडी है और बदला नहीं जा सकता</p>
                    )}
                  </div>
                </div>

                {mode === "CREATE" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      पासवर्ड (Password) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="न्यूनतम 6 अक्षर"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">वैकल्पिक मोबाइल (Alternate Mobile)</label>
                    <input
                      type="tel"
                      value={alternateMobile}
                      onChange={(e) => setAlternateMobile(e.target.value)}
                      placeholder="अन्य संपर्क नंबर"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ईमेल (Email Address)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">लिंग (Gender)</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE" | "OTHER")}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="MALE">पुरुष (Male)</option>
                      <option value="FEMALE">महिला (Female)</option>
                      <option value="OTHER">अन्य (Other)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">व्यवसाय (Occupation)</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="उदा. व्यापार / कृषि / सेवा"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">मतदाता परिचय पत्र (Voter ID / EPIC)</label>
                    <input
                      type="text"
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value.toUpperCase())}
                      placeholder="उदा. MP/12/345/678901"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">समग्र परिवार आईडी (Family ID)</label>
                    <input
                      type="text"
                      value={familyId}
                      onChange={(e) => setFamilyId(e.target.value)}
                      placeholder="8 अंकों की समग्र आईडी"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Professional & Designation */}
            {activeSection === "professional" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                  <strong>महत्वपूर्ण:</strong> खाता भूमिका (Role e.g. CITIZEN) और पदनाम (Designation e.g. विधायक / पार्षद)
                  पूरी तरह अलग हैं। नागरिक भी पद धारण कर सकते हैं।
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">पद श्रेणी (Designation Category)</label>
                    <select
                      value={designationCategory}
                      onChange={(e) => {
                        const cat = e.target.value as "POLITICAL" | "ORGANIZATIONAL" | "ADMINISTRATIVE";
                        setDesignationCategory(cat);
                        setSelectedDesignationId("");
                      }}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="POLITICAL">राजनीतिक (Political - सांसद, विधायक, पार्षद, सरपंच)</option>
                      <option value="ORGANIZATIONAL">संगठनात्मक (Organizational - जिलाध्यक्ष, मंडल अध्यक्ष)</option>
                      <option value="ADMINISTRATIVE">प्रशासनिक (Administrative - कलेक्टर, एसपी, सीईओ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">मानक पदनाम सूची (Predefined Designation)</label>
                    <select
                      value={selectedDesignationId}
                      onChange={(e) => handleDesignationSelect(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- पदनाम चुनें या नीचे कस्टम लिखें --</option>
                      {filteredDesignations.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.title} {d.titleHi ? `(${d.titleHi})` : ""} - {d.level || ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">पदनाम (Display Designation)</label>
                    <input
                      type="text"
                      value={customDesignation}
                      onChange={(e) => setCustomDesignation(e.target.value)}
                      placeholder="उदा. विधायक, जिला पंचायत अध्यक्ष, सक्रिय कार्यकर्ता"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">विभाग (Department)</label>
                    <select
                      value={selectedDepartmentId}
                      onChange={(e) => {
                        setSelectedDepartmentId(e.target.value);
                        const match = departments.find((d) => d._id === e.target.value);
                        if (match) setCustomDepartment(match.name);
                      }}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- कोई विभाग नहीं / सामान्य --</option>
                      {departments.map((dep) => (
                        <option key={dep._id} value={dep._id}>
                          {dep.name} {dep.nameHi ? `(${dep.nameHi})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">कार्यालयीन ईमेल (Official Email)</label>
                    <input
                      type="email"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="office@gov.in"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">कार्यालयीन संपर्क (Office Contact)</label>
                    <input
                      type="tel"
                      value={officeContact}
                      onChange={(e) => setOfficeContact(e.target.value)}
                      placeholder="07672-XXXXXX"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">कार्यालयीन पता (Office Address)</label>
                    <input
                      type="text"
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      placeholder="कार्यालय का पता"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Geographical Information */}
            {activeSection === "geography" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">राज्य (State)</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ज़िला (District)</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      {hierarchy?.districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">क्षेत्र प्रकार (Area Type)</label>
                    <select
                      value={areaType}
                      onChange={(e) => setAreaType(e.target.value as "RURAL" | "URBAN")}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white font-medium"
                    >
                      <option value="RURAL">ग्रामीण (Rural - ब्लॉक/पंचायत/गांव)</option>
                      <option value="URBAN">शहरी (Urban - नगर निगम/पालिका/वार्ड)</option>
                    </select>
                  </div>
                </div>

                {/* Rural fields */}
                {areaType === "RURAL" && (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-3">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      ग्रामीण भौगोलिक इकाई (Rural Administrative Units)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">विकासखंड / ब्लॉक (Block)</label>
                        <select
                          value={developmentBlock}
                          onChange={(e) => setDevelopmentBlock(e.target.value)}
                          className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="">-- ब्लॉक चुनें --</option>
                          {hierarchy?.rural.developmentBlocks.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">ग्राम पंचायत (Gram Panchayat)</label>
                        <input
                          type="text"
                          value={gramPanchayat}
                          onChange={(e) => setGramPanchayat(e.target.value)}
                          placeholder="ग्राम पंचायत का नाम"
                          className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">गांव (Village)</label>
                        <input
                          type="text"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          placeholder="गांव का नाम"
                          className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Urban fields */}
                {areaType === "URBAN" && (
                  <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-lg space-y-3">
                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">
                      शहरी निकाय इकाई (Urban Administrative Units)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">शहरी स्थानीय निकाय (Local Body)</label>
                        <select
                          value={localBody}
                          onChange={(e) => setLocalBody(e.target.value)}
                          className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="">-- निकाय चुनें --</option>
                          {hierarchy?.urban.localBodies.map((lb) => (
                            <option key={lb} value={lb}>
                              {lb}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">वार्ड नंबर (Ward Number)</label>
                        <input
                          type="text"
                          value={wardNumber}
                          onChange={(e) => setWardNumber(e.target.value)}
                          placeholder="उदा. 12"
                          className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">विधानसभा क्षेत्र (Assembly Constituency)</label>
                    <select
                      value={assemblyConstituency}
                      onChange={(e) => setAssemblyConstituency(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- विधानसभा चुनें --</option>
                      {hierarchy?.assemblyConstituencies.map((ac) => (
                        <option key={ac} value={ac}>
                          {ac}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">लोकसभा क्षेत्र (Parliamentary Constituency)</label>
                    <select
                      value={parliamentaryConstituency}
                      onChange={(e) => setParliamentaryConstituency(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- लोकसभा चुनें --</option>
                      {hierarchy?.parliamentaryConstituencies.map((pc) => (
                        <option key={pc} value={pc}>
                          {pc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">पूरा पता (Full Address)</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="मकान नंबर, मोहल्ला / सड़क"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">पिनकोड (Pincode)</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6 अंकों का पिनकोड"
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Account & Verification */}
            {activeSection === "account" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      खाता भूमिका (Application Role) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN")}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                    >
                      <option value="CITIZEN">नागरिक (CITIZEN - डिफ़ॉल्ट)</option>
                      <option value="BOOTH_WORKER">बूथ कार्यकर्ता (BOOTH_WORKER)</option>
                      <option value="PA_STAFF">पीए स्टाफ (PA_STAFF)</option>
                      <option value="POLITICIAN">जनप्रतिनिधि (POLITICIAN)</option>
                      <option value="SUPER_ADMIN">सुपर एडमिन (SUPER_ADMIN)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">खाता स्थिति (Account Status)</label>
                    <select
                      value={accountStatus}
                      onChange={(e) => setAccountStatus(e.target.value as "ACTIVE" | "SUSPENDED" | "DEACTIVATED")}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="ACTIVE">सक्रिय (Active)</option>
                      <option value="SUSPENDED">निलंबित (Suspended)</option>
                      <option value="DEACTIVATED">निष्क्रिय (Deactivated)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">सत्यापन स्थिति (Verification Status)</label>
                    <select
                      value={verificationStatus}
                      onChange={(e) => setVerificationStatus(e.target.value as "UNVERIFIED" | "VERIFIED" | "REJECTED" | "FLAGGED")}
                      className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="UNVERIFIED">असत्यापित (UNVERIFIED)</option>
                      <option value="VERIFIED">सत्यापित (VERIFIED)</option>
                      <option value="FLAGGED">जांच लंबित (FLAGGED)</option>
                      <option value="REJECTED">अस्वीकृत (REJECTED)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">सार्वजनिक निर्देशिका में दृश्यता</label>
                    <div className="flex items-center h-10 px-3 border border-slate-300 rounded-lg bg-slate-50 gap-2">
                      <input
                        type="checkbox"
                        id="pubDirToggle"
                        checked={isPublicDirectoryVisible}
                        onChange={(e) => setIsPublicDirectoryVisible(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="pubDirToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                        सार्वजनिक निर्देशिका (Public Directory) में प्रदर्शित करें
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">सत्यापन / प्रशासनिक टिप्पणी (Verification Notes)</label>
                  <textarea
                    rows={2}
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="सत्यापन संबंधी टिप्पणी या संदर्भ"
                    className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>खंड: {activeSection === "basic" ? "1/4 बुनियादी" : activeSection === "professional" ? "2/4 पद" : activeSection === "geography" ? "3/4 भूगोल" : "4/4 खाता"}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg"
              >
                रद्द करें
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{mode === "CREATE" ? "सुरक्षित रूप से बनाएं" : "परिवर्तन सहेजें"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
