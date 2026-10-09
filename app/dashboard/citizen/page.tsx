"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  RefreshCw,
  LogOut,
  Loader2
} from "lucide-react";
import { complaintsApi, ComplaintItem } from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth-context";

const CATEGORIES = [
  "सड़क एवं गड्ढे (Roads & Potholes)",
  "पेयजल एवं जल निकासी (Water Supply & Drainage)",
  "बिजली एवं स्ट्रीट लाइट (Electricity & Streetlights)",
  "सफाई एवं कचरा प्रबंधन (Sanitation & Waste)",
  "स्वास्थ्य एवं अस्पताल (Healthcare & Clinics)",
  "शिक्षा एवं स्कूल (Education & Schools)",
  "सरकारी योजना सहायता (Public Scheme Assistance)",
  "अन्य नागरिक शिकायत (Other Citizen Requests)"
];

export default function CitizenDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth(["CITIZEN", "SUPER_ADMIN"]);
  const { logout } = useAuth();

  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // New Complaint Form State
  const [showNewForm, setShowNewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [location, setLocation] = useState("");

  // Tracking modal
  const [trackingSearch, setTrackingSearch] = useState("");
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);
  const [activeTimeline, setActiveTimeline] = useState<Array<{ updateText: string; statusAfter?: string; createdAt: string }>>([]);

  const loadData = useCallback(async () => {
    try {
      setErrorMsg("");
      const compRes = await complaintsApi.getAll();
      if (compRes.success && compRes.data?.complaints) {
        setComplaints(compRes.data.complaints);
      }
    } catch {
      setErrorMsg("डेटा लोड करने में त्रुटि हुई।");
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    setErrorMsg("");
    setSuccessMsg("");
    loadData();
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setErrorMsg("कृपया विषय और विस्तृत विवरण दर्ज करें।");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await complaintsApi.create({
        category,
        subject: subject.trim(),
        description: description.trim(),
        priority,
        location: location.trim()
      });

      if (res.success && res.data) {
        setSuccessMsg(`आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है! ट्रैकिंग संख्या: ${res.data.trackingId}`);
        setSubject("");
        setDescription("");
        setLocation("");
        setShowNewForm(false);
        loadData();
      } else {
        setErrorMsg(res.message || "शिकायत दर्ज करने में विफल।");
      }
    } catch {
      setErrorMsg("शिकायत दर्ज करने में नेटवर्क त्रुटि।");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackComplaint = async (tId: string) => {
    try {
      setActiveTrackingId(tId);
      const res = await complaintsApi.track(tId);
      if (res.success && res.data) {
        setActiveTimeline(res.data.timeline || []);
      }
    } catch {
      setErrorMsg("ट्रैकिंग विवरण लोड करने में त्रुटि।");
    }
  };

  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => ["SUBMITTED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS"].includes(c.status)).length;
  const resolvedCount = complaints.filter(c => c.status === "RESOLVED").length;

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
          <span className="font-medium text-lg">डैशबोर्ड लोड हो रहा है...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                नागरिक पोर्टल (Citizen Portal)
              </span>
              <span className="text-xs text-slate-500 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                सत्यापित खाता
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              नमस्ते, {user?.fullName || "नागरिक"}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              मोबाइल: +91 {user?.mobileNumber} | क्षेत्र: {user?.assemblyConstituency || "विधानसभा क्षेत्र"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              ताज़ा करें
            </button>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              नई शिकायत दर्ज करें
            </button>
            <button
              onClick={() => logout()}
              className="inline-flex items-center px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              लॉगआउट
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600" />
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">कुल शिकायतें</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">प्रक्रियाधीन (In Progress)</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">निस्तारित (Resolved)</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* New Complaint Form Drawer */}
        {showNewForm && (
          <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 text-orange-600" />
                नई नागरिक शिकायत / सेवा अनुरोध पत्र
              </h2>
              <button
                onClick={() => setShowNewForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                रद्द करें ✕
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    शिकायत श्रेणी (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    प्राथमिकता (Priority)
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="LOW">सामान्य (Low)</option>
                    <option value="MEDIUM">मध्यम (Medium)</option>
                    <option value="HIGH">उच्च (High)</option>
                    <option value="URGENT">अति-आवश्यक (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  शिकायत का संक्षिप्त विषय (Subject) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. वार्ड 12 में मुख्य मार्ग पर स्ट्रीट लाइट खराब है"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  स्थान / पता विवरण (Location Landmark)
                </label>
                <input
                  type="text"
                  placeholder="उदा. पुराना शिव मंदिर के पास, खंभा नंबर 4"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  विस्तृत विवरण (Description) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="समस्या का पूरा विवरण लिखें, यह कब से है और इससे नागरिकों को क्या असुविधा हो रही है..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "दर्ज हो रहा है..." : "शिकायत प्रेषित करें"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints Table & Tracking */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">मेरी दर्ज शिकायतें (My Complaints)</h2>
              <p className="text-xs text-slate-500">आपके द्वारा जन कनेक्ट पर दर्ज की गई सभी शिकायतों की स्थिति</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ट्रैकिंग ID खोजें..."
                  value={trackingSearch}
                  onChange={(e) => setTrackingSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium text-xs">अभी कोई शिकायत दर्ज नहीं है।</p>
              <p className="text-xs text-slate-400 mt-1">अपने क्षेत्र की समस्या या सेवा हेतु ऊपर बटन दबाकर शिकायत दर्ज करें।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">ट्रैकिंग ID</th>
                    <th className="px-5 py-3">श्रेणी / विषय</th>
                    <th className="px-5 py-3">प्राथमिकता</th>
                    <th className="px-5 py-3">स्थिति</th>
                    <th className="px-5 py-3">दिनांक</th>
                    <th className="px-5 py-3 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints
                    .filter((c) => !trackingSearch || c.trackingId.includes(trackingSearch.toUpperCase()))
                    .map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-4 font-mono font-bold text-blue-700 text-xs">
                          {item.trackingId}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900 text-xs">{item.subject}</p>
                          <p className="text-[11px] text-slate-500">{item.category}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.priority === "URGENT" ? "bg-red-100 text-red-800" :
                            item.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800" :
                            item.status === "REJECTED" ? "bg-red-100 text-red-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleTrackComplaint(item.trackingId)}
                            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-900"
                          >
                            समयरेखा देखें <ExternalLink className="w-3 h-3 ml-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline Modal */}
        {activeTrackingId && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    शिकायत समयरेखा: {activeTrackingId}
                  </h3>
                  <p className="text-xs text-slate-500">आधिकारिक प्रगति एवं अद्यतन विवरण</p>
                </div>
                <button
                  onClick={() => setActiveTrackingId(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {activeTimeline.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">अभी कोई अद्यतन उपलब्ध नहीं है।</p>
              ) : (
                <div className="relative pl-6 space-y-4 border-l-2 border-orange-200">
                  {activeTimeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-sm" />
                      <div>
                        <span className="text-xs font-bold text-slate-700">
                          {step.statusAfter ? `[${step.statusAfter}]` : "अद्यतन"}
                        </span>
                        <p className="text-xs text-slate-800 mt-0.5">{step.updateText}</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {new Date(step.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveTrackingId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links Footer */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold">नागरिक सूचना एवं योजनाएं खोजें</h3>
            <p className="text-xs text-blue-200 mt-1">
              अपने क्षेत्र के लिए जारी नवीनतम सूचनाएं और सरकारी योजनाओं की पात्रता जानकारी देखें।
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/schemes"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition"
            >
              योजनाएं देखें
            </Link>
            <Link
              href="/notices"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition"
            >
              सूचना पट्ट देखें
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
