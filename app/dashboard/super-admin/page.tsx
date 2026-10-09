"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  CheckCircle2,
  Lock,
  RefreshCw,
  Download,
  AlertCircle,
  UserPlus,
  Shield,
  Activity,
  LogOut,
  X,
  Loader2,
  Building2,
  Phone,
  Power
} from "lucide-react";
import {
  reportsApi,
  usersApi,
  DashboardSummary,
  UserProfile
} from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth-context";

export default function SuperAdminDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth(["SUPER_ADMIN"]);
  const { logout } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER">("PA_STAFF");
  const [newDistrict, setNewDistrict] = useState("");
  const [newConstituency, setNewConstituency] = useState("");
  const [submittingUser, setSubmittingUser] = useState(false);

  // System Health
  const [healthStatus, setHealthStatus] = useState<{ status: string; database: string } | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const sumRes = await reportsApi.getSummary();
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
    } catch {
      setErrorMsg("सिस्टम सारांश लोड करने में त्रुटि हुई।");
    }
  }, []);

  const fetchUsers = useCallback(async (role?: string) => {
    setLoadingUsers(true);
    try {
      const params: Record<string, string> = { limit: "50" };
      if (role && role !== "ALL") {
        params.role = role;
      }
      const res = await usersApi.getAll(params);
      if (res.success && res.data?.users) {
        setUsersList(res.data.users);
      }
    } catch {
      setErrorMsg("उपयोगकर्ता सूची लोड करने में त्रुटि।");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiUrl}/health`, { credentials: "omit" });
      const data = await res.json().catch(() => null);
      if (data?.data) {
        setHealthStatus(data.data);
      }
    } catch {
      setHealthStatus({ status: "DEGRADED", database: "DISCONNECTED" });
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    setErrorMsg("");
    setSuccessMsg("");
    await Promise.all([fetchSummary(), fetchUsers(userRoleFilter), checkHealth()]);
    setRefreshing(false);
    setLoadingData(false);
  }, [fetchSummary, fetchUsers, checkHealth, userRoleFilter]);

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      refreshAll();
    }
  }, [user, refreshAll]);

  const handleRoleFilterChange = (role: string) => {
    setUserRoleFilter(role);
    fetchUsers(role);
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await usersApi.updateStatus(userId, nextStatus as "ACTIVE" | "SUSPENDED");
      if (res.success) {
        setSuccessMsg(`उपयोगकर्ता स्थिति सफलतापूर्वक ${nextStatus === "ACTIVE" ? "सक्रिय" : "निलंबित"} की गई।`);
        fetchUsers(userRoleFilter);
      } else {
        setErrorMsg(res.message || "स्थिति अद्यतन विफल रहा।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newFullName.trim() || !newMobile.trim() || !newPassword.trim()) {
      setErrorMsg("कृपया नाम, मोबाइल नंबर और पासवर्ड दर्ज करें।");
      return;
    }

    if (!/^\d{10}$/.test(newMobile.trim())) {
      setErrorMsg("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।");
      return;
    }

    setSubmittingUser(true);
    try {
      const res = await usersApi.createUser({
        fullName: newFullName.trim(),
        mobileNumber: newMobile.trim(),
        password: newPassword,
        role: newRole,
        district: newDistrict.trim() || undefined,
        assemblyConstituency: newConstituency.trim() || undefined,
      });

      if (res.success) {
        setSuccessMsg(`नया खाता (${newRole}) सफलतापूर्वक निर्मित किया गया।`);
        setShowCreateModal(false);
        setNewFullName("");
        setNewMobile("");
        setNewPassword("");
        setNewDistrict("");
        setNewConstituency("");
        fetchUsers(userRoleFilter);
        fetchSummary();
      } else {
        setErrorMsg(res.message || "खाता निर्माण विफल रहा।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setSubmittingUser(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-slate-100">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
          <span className="text-base font-bold">सुपर एडमिन कंसोल लोड हो रहा है...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Master Console Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-orange-500/30 bg-orange-950/60 px-3 py-0.5 text-xs font-bold text-orange-400">
                मुख्य सुपर एडमिन कंसोल (Super Admin Root)
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-800 bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                <Activity size={12} />
                डेटाबेस: {healthStatus?.database || "CONNECTED"}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              {user?.fullName || "सिस्टम प्रशासक"}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              संपूर्ण Jan Connect मंच नियंत्रण, 5-भूमिका सुरक्षा अनुमतियां, प्रशासनिक खाता निर्माण एवं सिस्टम ऑडिट।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              ताज़ा करें
            </button>
            <a
              href={reportsApi.getExportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-500"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              CSV निर्यात
            </a>
            <button
              onClick={() => logout()}
              className="inline-flex items-center rounded-xl border border-rose-800/60 bg-rose-950/40 px-3.5 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-900/60"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              लॉगआउट
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-800 bg-rose-950/80 p-4 text-xs text-rose-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <div>
              <p className="font-bold">त्रुटि सूचना:</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-800 bg-emerald-950/80 p-4 text-xs text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <p className="font-semibold">{successMsg}</p>
          </div>
        )}

        {/* Global Live Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              पंजीकृत नागरिक (Citizens)
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {summary?.users.citizens ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              सार्वजनिक पोर्टल उपयोगकर्ता
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              सक्रिय बूथ कार्यकर्ता (Workers)
            </p>
            <p className="mt-2 text-3xl font-black text-orange-400">
              {summary?.users.boothWorkers ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium">
              आज उपस्थित: {summary?.todayAttendance ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              कुल शिकायतें (Complaints)
            </p>
            <p className="mt-2 text-3xl font-black text-blue-400">
              {summary?.complaints.total ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {summary?.complaints.resolved ?? 0} निस्तारित | {summary?.complaints.urgent ?? 0} तत्काल
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              कार्यालयीन स्टाफ (Staff)
            </p>
            <p className="mt-2 text-3xl font-black text-purple-400">
              {summary?.users.staff ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              पीए एवं समन्वयक
            </p>
          </div>
        </div>

        {/* Administrative User Provisioning Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center text-lg font-bold text-white">
                <Users className="mr-2 h-5 w-5 text-orange-500" />
                प्रशासनिक उपयोगकर्ता प्रबंधन (Privileged User Directory)
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                जनप्रतिनिधि, कार्यालय स्टाफ एवं बूथ कार्यकर्ताओं के खातों का नियंत्रण ও स्थिति प्रबंधन
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              नया प्रशासनिक खाता बनाएं
            </button>
          </div>

          {/* Role Filters */}
          <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
            {["ALL", "POLITICIAN", "PA_STAFF", "BOOTH_WORKER", "CITIZEN", "SUPER_ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => handleRoleFilterChange(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  userRoleFilter === r
                    ? "bg-orange-600 text-white"
                    : "border border-slate-800 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {r === "ALL" && "सभी उपयोगकर्ता (All)"}
                {r === "POLITICIAN" && "जनप्रतिनिधि (Politicians)"}
                {r === "PA_STAFF" && "कार्यालय स्टाफ (Staff)"}
                {r === "BOOTH_WORKER" && "बूथ कार्यकर्ता (Workers)"}
                {r === "CITIZEN" && "नागरिक (Citizens)"}
                {r === "SUPER_ADMIN" && "सुपर एडमिन (Admins)"}
              </button>
            ))}
          </div>

          {/* Users Table */}
          <div className="mt-4 overflow-x-auto">
            {loadingUsers ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
                <p className="mt-2">उपयोगकर्ता सूची लोड हो रही है...</p>
              </div>
            ) : usersList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                इस श्रेणी में कोई उपयोगकर्ता दर्ज नहीं है।
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">नाम / मोबाइल</th>
                    <th className="py-3 px-3">भूमिका (Role)</th>
                    <th className="py-3 px-3">क्षेत्र / जिला</th>
                    <th className="py-3 px-3">स्थिति (Status)</th>
                    <th className="py-3 px-3 text-right">कार्यवाही (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u._id} className="transition hover:bg-slate-800/30">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-white">{u.fullName}</p>
                        <p className="font-mono text-[11px] text-slate-400">+91 {u.mobileNumber}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-rose-950 text-rose-300 border border-rose-800"
                              : u.role === "POLITICIAN"
                              ? "bg-orange-950 text-orange-300 border border-orange-800"
                              : u.role === "PA_STAFF"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : u.role === "BOOTH_WORKER"
                              ? "bg-blue-950 text-blue-300 border border-blue-800"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">
                        {u.assemblyConstituency || u.district || "—"}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            u.accountStatus === "ACTIVE"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-rose-950 text-rose-400 border border-rose-800"
                          }`}
                        >
                          {u.accountStatus || "ACTIVE"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {u.role !== "SUPER_ADMIN" ? (
                          <button
                            onClick={() => handleStatusToggle(u._id, u.accountStatus || "ACTIVE")}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                              u.accountStatus === "ACTIVE"
                                ? "bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900"
                                : "bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                            }`}
                          >
                            <Power size={11} />
                            <span>{u.accountStatus === "ACTIVE" ? "निलंबित करें" : "सक्रिय करें"}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-600">सुरक्षित रूट</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Security & System Guardrails */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="flex items-center text-sm font-bold text-white">
              <Shield className="mr-2 h-5 w-5 text-emerald-500" />
              सुरक्षा एवं अभिगम नियंत्रण (RBAC Guardrails)
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              प्रत्येक API अनुरोध पर सर्वर-साइड सत्र सत्यापन, JWT टोकन हस्ताक्षर एवं 5-भूमिका सुरक्षा नीतियां स्वचालित रूप से लागू की जाती हैं।
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-1 text-emerald-300">
                HttpOnly Sessions: सक्रिय
              </span>
              <span className="rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-1 text-emerald-300">
                Scope Filter Isolation: सक्रिय
              </span>
              <span className="rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-1 text-emerald-300">
                CSV Formula Sanitizer: सक्रिय
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="flex items-center text-sm font-bold text-white">
              <Lock className="mr-2 h-5 w-5 text-orange-500" />
              आंतरिक सुरक्षा दिशानिर्देश (Platform Privacy)
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              डेटाबेस में आंतरिक स्टाफ टिप्पणियां (Internal Notes) नागरिकों के पोर्टल से पूर्णतः छिपी रहती हैं। सार्वजनिक पंजीकरण केवल CITIZEN भूमिका तक सीमित है।
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-slate-200">
                Bcrypt Salt: 10 Rounds
              </span>
              <span className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-slate-200">
                CAPTCHA दर सीमा: सक्रिय
              </span>
              <span className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-slate-200">
                No Plaintext Passwords
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* CREATE PRIVILEGED USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  नया प्रशासनिक खाता बनाएं (Create Privileged User)
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  पूरा नाम (Full Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. श्री सुनील वर्मा"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  मोबाइल नंबर (Mobile Number) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-12 pr-3 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  पासवर्ड (Password) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="न्यूनतम 6 अक्षरों का पासवर्ड"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  भूमिका (Administrative Role) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER")}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                >
                  <option value="POLITICIAN">जनप्रतिनिधि (POLITICIAN)</option>
                  <option value="PA_STAFF">कार्यालय स्टाफ / PA (PA_STAFF)</option>
                  <option value="BOOTH_WORKER">बूथ कार्यकर्ता (BOOTH_WORKER)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">जिला (District)</label>
                  <input
                    type="text"
                    placeholder="उदा. भोपाल"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">विधानसभा (Constituency)</label>
                  <input
                    type="text"
                    placeholder="उदा. गोविंदपुरा"
                    value={newConstituency}
                    onChange={(e) => setNewConstituency(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 font-bold text-slate-300 hover:bg-slate-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-500 disabled:opacity-60"
                >
                  {submittingUser ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>खाता बन रहा है...</span>
                    </>
                  ) : (
                    <span>खाता सुरक्षित रूप से बनाएं</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
