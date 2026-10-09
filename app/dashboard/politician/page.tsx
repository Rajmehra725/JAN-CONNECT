"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  UserCheck,
  MapPin,
  TrendingUp,
  LogOut,
  Loader2,
  AlertCircle
} from "lucide-react";
import { complaintsApi, reportsApi, DashboardSummary, ComplaintItem } from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth-context";

export default function PoliticianDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth(["POLITICIAN", "SUPER_ADMIN"]);
  const { logout } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<ComplaintItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const loadData = useCallback(async () => {
    try {
      setErrorMsg("");
      const [sumRes, compRes] = await Promise.all([
        reportsApi.getSummary(),
        complaintsApi.getAll({ limit: "25" })
      ]);

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }

      if (compRes.success && compRes.data?.complaints) {
        setRecentComplaints(compRes.data.complaints);
      }
    } catch {
      setErrorMsg("डेटा लोड करने में त्रुटि।");
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
    loadData();
  };

  const filteredComplaints = recentComplaints.filter(c => {
    if (filterStatus === "ALL") return true;
    return c.status === filterStatus;
  });

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
          <span className="font-medium text-lg">जनप्रतिनिधि डैशबोर्ड लोड हो रहा है...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-800 text-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-orange-500">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                जनप्रतिनिधि डैशबोर्ड (Constituency Oversight)
              </span>
              <span className="text-xs text-slate-300 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-orange-400" />
                {user?.assemblyConstituency || "विधानसभा क्षेत्र"} ({user?.district || "मध्य प्रदेश"})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
              {user?.fullName || "माननीय जन प्रतिनिधि"}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              विधानसभा क्षेत्र में नागरिक सेवाओं, शिकायतों के निवारण, बूथ कार्यकर्ताओं की उपस्थिति एवं संगठनात्मक कार्यों की केंद्रीय निगरानी प्रणाली।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              ताज़ा करें
            </button>
            <a
              href={reportsApi.getExportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              CSV रिपोर्ट डाउनलोड
            </a>
            <button
              onClick={() => logout()}
              className="inline-flex items-center px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded-xl text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              लॉगआउट
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600" />
            {errorMsg}
          </div>
        )}

        {/* Core KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">कुल शिकायतें</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{summary?.complaints.total || 0}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              {summary?.complaints.resolved || 0} निस्तारित ({summary?.complaints.total ? Math.round(((summary.complaints.resolved) / (summary.complaints.total)) * 100) : 0}%)
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">प्रक्रियाधीन (Active)</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600">{summary?.complaints.inProgress || 0}</p>
            <p className="text-xs text-slate-500 mt-1">
              अति-आवश्यक: <span className="font-semibold text-red-600">{summary?.complaints.urgent || 0}</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">बूथ कार्यकर्ता</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{summary?.users.boothWorkers || 0}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              आज उपस्थित: <span className="font-semibold text-emerald-700 ml-1">{summary?.todayAttendance || 0}</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">फील्ड कार्य (Tasks)</span>
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{summary?.tasks.total || 0}</p>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.tasks.completed || 0} पूर्ण | {summary?.tasks.pending || 0} लंबित
            </p>
          </div>
        </div>

        {/* Complaints Monitoring Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-700" />
                नवीनतम नागरिक समस्याएं एवं निवारण स्थिति
              </h2>
              <p className="text-xs text-slate-500">विधानसभा क्षेत्र से प्राप्त प्राथमिक जन शिकायतें</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-500">स्थिति फ़िल्टर:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
              >
                <option value="ALL">सभी (All)</option>
                <option value="SUBMITTED">प्राप्त (Submitted)</option>
                <option value="IN_PROGRESS">प्रगति पर (In Progress)</option>
                <option value="RESOLVED">निस्तारित (Resolved)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">ट्रैकिंग ID</th>
                  <th className="px-5 py-3">नागरिक / मोबाइल</th>
                  <th className="px-5 py-3">श्रेणी एवं विषय</th>
                  <th className="px-5 py-3">प्राथमिकता</th>
                  <th className="px-5 py-3">स्थिति</th>
                  <th className="px-5 py-3">दिनांक</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400">
                      कोई शिकायत उपलब्ध नहीं है।
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-700 text-xs">
                        {c.trackingId}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-900 text-xs">{c.citizenId?.fullName || "नागरिक"}</p>
                        <p className="text-[11px] text-slate-500">+91 {c.citizenId?.mobileNumber || "N/A"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800 text-xs truncate max-w-xs">{c.subject}</p>
                        <p className="text-[11px] text-slate-500">{c.category}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                          c.priority === "URGENT" ? "bg-red-100 text-red-800" :
                          c.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800" :
                          c.status === "SUBMITTED" ? "bg-blue-100 text-blue-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">कार्यालय एवं पीए स्टाफ</h3>
              <p className="text-xs text-slate-500 mt-0.5">{summary?.users.staff || 0} सक्रिय स्टाफ सदस्य</p>
            </div>
            <Link
              href="/staff/dashboard"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              स्टाफ देखें →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">बूथ कार्यकर्ता नेटवर्क</h3>
              <p className="text-xs text-slate-500 mt-0.5">{summary?.users.boothWorkers || 0} पंजीकृत कार्यकर्ता</p>
            </div>
            <Link
              href="/worker/dashboard"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              कार्यकर्ता देखें →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">सूचनाएं एवं जनसंपर्क</h3>
              <p className="text-xs text-slate-500 mt-0.5">सार्वजनिक घोषणाएं एवं प्रेस विज्ञप्ति</p>
            </div>
            <Link
              href="/notices"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              सूचनाएं देखें →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
