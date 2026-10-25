"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  Database,
  Server,
  RotateCcw,
  Download,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCheck,
  RefreshCw
} from "lucide-react";
import { usersApi, reportsApi, UserProfile } from "@/lib/api";

export default function SystemHealthTab() {
  const [healthData, setHealthData] = useState<{
    database: string;
    apiStatus: string;
    timestamp: string;
  } | null>(null);

  const [deactivatedUsers, setDeactivatedUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchHealth = useCallback(async () => {
    try {
      const res = await reportsApi.getSummary();
      if (res.success && res.data && res.data.systemHealth) {
        setHealthData(res.data.systemHealth);
      }
    } catch {
      // Ignored
    }
  }, []);

  const fetchDeactivatedUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await usersApi.getAll({ status: "DEACTIVATED", limit: "20" });
      if (res.success && res.data) {
        setDeactivatedUsers(res.data.users || []);
      }
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    fetchDeactivatedUsers();
  }, [fetchHealth, fetchDeactivatedUsers]);

  const handleRestore = async (id: string) => {
    if (!confirm("क्या आप इस उपयोगकर्ता खाते को पुनः सक्रिय (Restore) करना चाहते हैं?")) return;
    setRestoringId(id);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await usersApi.restore(id);
      if (res.success) {
        setSuccessMsg("खाता सफलतापूर्वक पुनः सक्रिय कर दिया गया है।");
        fetchDeactivatedUsers();
      } else {
        throw new Error(res.message || "पुनर्प्राप्ति विफल");
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "पुनर्प्राप्ति में त्रुटि हुई।");
    } finally {
      setRestoringId(null);
    }
  };

  const handleBackupExport = () => {
    const backupSnapshot = {
      exportDate: new Date().toISOString(),
      platform: "Jan Connect Civic Directory & Complaint Platform",
      systemStatus: healthData,
      disclaimer: "प्रशासनिक सुरक्षा बैकअप मेटाडेटा। इसमें कोई भी पासवर्ड या गोपनीय कुंजी शामिल नहीं है।"
    };

    const blob = new Blob([JSON.stringify(backupSnapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jan-connect-system-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-rose-600 hover:text-rose-800">✕</button>
        </div>
      )}

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">MongoDB Atlas क्लस्टर</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-base font-black text-slate-900">
                {healthData?.database === "CONNECTED" ? "कनेक्टेड (Live)" : "DISCONNECTED"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-900 rounded-xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">REST API स्वास्थ्य</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <p className="text-base font-black text-slate-900">
                {healthData?.apiStatus || "HEALTHY"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">सिस्टम बैकअप</p>
            <p className="text-xs text-slate-400 mt-0.5">मेटाडेटा एवं विन्यास बैकअप</p>
          </div>
          <button
            onClick={handleBackupExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>बैकअप लें</span>
          </button>
        </div>
      </div>

      {/* Recovery Center: Soft-deleted and Deactivated Accounts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">खाता पुनर्प्राप्ति केंद्र (Soft Delete Recovery)</h3>
            <p className="text-xs text-slate-500">
              प्रशासनिक रूप से निष्क्रिय अथवा सॉफ्ट-डिलीट किए गए खातों को यहाँ से तुरंत पुनः सक्रिय (Restore) किया जा सकता है।
            </p>
          </div>
          <button
            onClick={fetchDeactivatedUsers}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
            title="रीफ्रेश"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loadingUsers ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-600" />
            <p className="text-xs mt-2">निष्क्रिय खाते लोड हो रहे हैं...</p>
          </div>
        ) : deactivatedUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-sm font-bold text-slate-900">कोई निष्क्रिय अथवा डिलीटेड खाता नहीं है।</p>
            <p className="text-xs text-slate-400">सभी सदस्य खाते वर्तमान में सक्रिय स्थिति में हैं।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3">नाम / मोबाइल</th>
                  <th className="px-4 py-3">भूमिका</th>
                  <th className="px-4 py-3">पद</th>
                  <th className="px-4 py-3">वर्तमान स्थिति</th>
                  <th className="px-4 py-3 text-right">पुनर्प्राप्ति कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {deactivatedUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{u.fullName}</p>
                      <p className="text-[11px] font-mono text-slate-500">{u.mobileNumber}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{u.designation || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        DEACTIVATED
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleRestore(u._id)}
                        disabled={restoringId === u._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-xs"
                      >
                        {restoringId === u._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3.5 h-3.5" />
                        )}
                        <span>खाता पुनर्प्राप्त करें (Restore)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
