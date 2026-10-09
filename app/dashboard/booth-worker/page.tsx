"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  UserCheck,
  LogOut,
  LogIn,
  ListTodo,
  Loader2
} from "lucide-react";
import { attendanceApi, tasksApi, AttendanceRecord, TaskItem } from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth-context";

export default function BoothWorkerDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth(["BOOTH_WORKER", "SUPER_ADMIN"]);
  const { logout } = useAuth();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Attendance Form
  const [fieldActivity, setFieldActivity] = useState("");
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  // Complete Task Modal
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [updatingTask, setUpdatingTask] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setErrorMsg("");
      const [tasksRes, attRes] = await Promise.all([
        tasksApi.getAll(),
        attendanceApi.getMy()
      ]);

      if (tasksRes.success && tasksRes.data?.tasks) {
        setTasks(tasksRes.data.tasks);
      }

      if (attRes.success && Array.isArray(attRes.data)) {
        setAttendance(attRes.data);
        const todayStr = new Date().toISOString().split("T")[0];
        const match = attRes.data.find(a => a.attendanceDate === todayStr);
        if (match) {
          setTodayCheckedIn(true);
          setTodayRecord(match);
        } else {
          setTodayCheckedIn(false);
          setTodayRecord(null);
        }
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

  const handleCheckIn = async () => {
    setSubmittingAttendance(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await attendanceApi.checkIn({
        location: user?.assemblyConstituency || "बूथ क्षेत्र",
        fieldActivity: fieldActivity.trim() || "दैनिक बूथ जनसंपर्क एवं उपस्थिति"
      });

      if (res.success) {
        setSuccessMsg("आज की उपस्थिति (Check-in) सफलतापूर्वक दर्ज की गई!");
        setTodayCheckedIn(true);
        loadData();
      } else {
        setErrorMsg(res.message || "चेक-इन विफल।");
      }
    } catch {
      setErrorMsg("चेक-इन में नेटवर्क त्रुटि।");
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const handleCheckOut = async () => {
    setSubmittingAttendance(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await attendanceApi.checkOut({
        fieldActivity: fieldActivity.trim() || "दिन का कार्य संपन्न"
      });

      if (res.success) {
        setSuccessMsg("आज का चेक-आउट सफलतापूर्वक दर्ज हुआ!");
        loadData();
      } else {
        setErrorMsg(res.message || "चेक-आउट विफल।");
      }
    } catch {
      setErrorMsg("चेक-आउट में नेटवर्क त्रुटि।");
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const handleCompleteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    setUpdatingTask(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await tasksApi.update(activeTask._id, {
        status: "COMPLETED",
        completionNotes: completionNotes.trim()
      });

      if (res.success) {
        setSuccessMsg(`कार्य [${activeTask.title}] पूर्ण चिह्नित किया गया!`);
        setActiveTask(null);
        setCompletionNotes("");
        loadData();
      } else {
        setErrorMsg(res.message || "कार्य अद्यतन विफल।");
      }
    } catch {
      setErrorMsg("कार्य अद्यतन में नेटवर्क त्रुटि।");
    } finally {
      setUpdatingTask(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
          <span className="font-medium text-lg">कार्यकर्ता डैशबोर्ड लोड हो रहा है...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Worker Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                बूथ कार्यकर्ता कार्यक्षेत्र (Booth Field Portal)
              </span>
              <span className="text-xs text-slate-500">
                बूथ नं: {user?.boothNumber || "सामान्य"} | वार्ड नं: {user?.wardNumber || "सामान्य"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {user?.fullName || "बूथ कार्यकर्ता"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              क्षेत्र: {user?.assemblyConstituency || "विधानसभा"} | मोबाइल: +91 {user?.mobileNumber}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              ताज़ा करें
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

        {/* Daily Attendance Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-emerald-600" />
                दैनिक उपस्थिति एवं फील्ड रिपोर्ट (Daily Check-in)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                आज का दिनांक: {new Date().toLocaleDateString("hi-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div>
              {todayCheckedIn ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  आज उपस्थित (Checked In at {todayRecord?.checkInTime ? new Date(todayRecord.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "N/A"})
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  चेक-इन लंबित है
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                आज की गतिविधि / कार्यक्षेत्र विवरण (Field Activity)
              </label>
              <input
                type="text"
                placeholder="उदा. वार्ड में घर-घर जनसंपर्क, 15 परिवारों से भेंट..."
                value={fieldActivity}
                onChange={(e) => setFieldActivity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex space-x-2">
              {!todayCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={submittingAttendance}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {submittingAttendance ? "दर्ज हो रहा है..." : "उपस्थिति दर्ज करें (Check-in)"}
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  disabled={submittingAttendance || Boolean(todayRecord?.checkOutTime)}
                  className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  {todayRecord?.checkOutTime ? "चेक-आउट पूर्ण" : "चेक-आउट करें (Check-out)"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Tasks Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <ListTodo className="w-4 h-4 mr-2 text-blue-600" />
                आवंटित संगठनात्मक कार्य (Assigned Tasks)
              </h2>
              <p className="text-xs text-slate-500">कार्यालय द्वारा आपके बूथ के लिए सौंपे गए कार्य</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
              {tasks.length} कार्य
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                वर्तमान में कोई लंबित कार्य नहीं है।
              </div>
            ) : (
              tasks.map((t) => (
                <div key={t._id} className="p-5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === "URGENT" ? "bg-red-100 text-red-800" :
                        t.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {t.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm">{t.title}</h3>
                    <p className="text-xs text-slate-600 max-w-2xl">{t.description}</p>
                    {t.completionNotes && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                        पूर्णता टिप्पणी: {t.completionNotes}
                      </p>
                    )}
                  </div>

                  <div>
                    {t.status !== "COMPLETED" && (
                      <button
                        onClick={() => setActiveTask(t)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                      >
                        पूर्ण चिह्नित करें ✓
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Complete Task Modal */}
        {activeTask && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  कार्य पूर्ण विवरण दर्ज करें
                </h3>
                <button
                  onClick={() => setActiveTask(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCompleteTask} className="space-y-4">
                <p className="text-xs font-semibold text-slate-700">{activeTask.title}</p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    कार्य पूर्णता टिप्पणी (Completion Notes) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="कार्य के संबंध में क्या प्रगति हुई, कितने लोगों से संपर्क हुआ..."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTask(null)}
                    className="px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={updatingTask}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {updatingTask ? "सहेज रहे हैं..." : "पूर्ण चिह्नित करें"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
