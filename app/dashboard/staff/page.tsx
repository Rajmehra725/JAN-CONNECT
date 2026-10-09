"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Lock,
  LogOut,
  Loader2,
  Building2,
  FileText
} from "lucide-react";
import {
  complaintsApi,
  tasksApi,
  usersApi,
  ComplaintItem,
  UserProfile
} from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth-context";

export default function StaffDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth(["PA_STAFF", "SUPER_ADMIN", "POLITICIAN"]);
  const { logout } = useAuth();

  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [workers, setWorkers] = useState<UserProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Update Status Modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [updateText, setUpdateText] = useState("");
  const [newStatus, setNewStatus] = useState<string>("IN_PROGRESS");
  const [isInternal, setIsInternal] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  // New Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assignedWorkerId, setAssignedWorkerId] = useState("");
  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [submittingTask, setSubmittingTask] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setErrorMsg("");
      const [compRes, workersRes] = await Promise.all([
        complaintsApi.getAll({ limit: "50" }),
        usersApi.getAll({ role: "BOOTH_WORKER" })
      ]);

      if (compRes.success && compRes.data?.complaints) {
        setComplaints(compRes.data.complaints);
      }

      if (workersRes.success && workersRes.data?.users) {
        setWorkers(workersRes.data.users);
        if (workersRes.data.users.length > 0 && !assignedWorkerId) {
          setAssignedWorkerId(workersRes.data.users[0]._id);
        }
      }
    } catch {
      setErrorMsg("डेटा लोड करने में त्रुटि।");
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, [assignedWorkerId]);

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

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !updateText.trim()) return;

    setSubmittingUpdate(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await complaintsApi.addUpdate(selectedComplaint._id, {
        updateText: updateText.trim(),
        newStatus,
        isInternal
      });

      if (res.success) {
        setSuccessMsg(`शिकायत ${selectedComplaint.trackingId} पर अद्यतन सफलतापूर्वक दर्ज हुआ।`);
        setSelectedComplaint(null);
        setUpdateText("");
        loadData();
      } else {
        setErrorMsg(res.message || "अद्यतन जोड़ने में विफल।");
      }
    } catch {
      setErrorMsg("नेटवर्क त्रुटि हुई।");
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDesc.trim() || !assignedWorkerId) {
      setErrorMsg("कृपया कार्य का शीर्षक, विवरण एवं कार्यकर्ता का चयन करें।");
      return;
    }

    setSubmittingTask(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await tasksApi.create({
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        assignedWorkerId,
        priority: taskPriority
      });

      if (res.success) {
        setSuccessMsg("कार्यकर्ता हेतु कार्य सफलतापूर्वक आवंटित किया गया!");
        setShowTaskModal(false);
        setTaskTitle("");
        setTaskDesc("");
        loadData();
      } else {
        setErrorMsg(res.message || "कार्य निर्माण विफल।");
      }
    } catch {
      setErrorMsg("कार्य आवंटन में नेटवर्क त्रुटि।");
    } finally {
      setSubmittingTask(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
          <span className="font-medium text-lg">स्टाफ कार्यक्षेत्र लोड हो रहा है...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Staff Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                कार्यालय पीए / स्टाफ कार्यक्षेत्र (Office & Operations)
              </span>
              <span className="text-xs text-slate-500">
                {user?.assemblyConstituency || "विधानसभा क्षेत्र"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {user?.fullName || "स्टाफ सदस्य"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              नागरिक समस्याओं का निवारण, बूथ कार्यकर्ताओं को कार्य आवंटन एवं कार्यालयीन समन्वय।
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
              onClick={() => setShowTaskModal(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              नया कार्य आवंटित करें
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

        {/* Complaints Operational Queue */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">नागरिक शिकायत निवारण कतार (Action Queue)</h2>
              <p className="text-xs text-slate-500">कार्रवाई, प्रगति नोट अथवा स्थिति बदलने हेतु शिकायत चुनें</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
              {complaints.length} सक्रिय मामले
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">ट्रैकिंग ID</th>
                  <th className="px-5 py-3">नागरिक</th>
                  <th className="px-5 py-3">विषय एवं श्रेणी</th>
                  <th className="px-5 py-3">प्राथमिकता</th>
                  <th className="px-5 py-3">वर्तमान स्थिति</th>
                  <th className="px-5 py-3 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                      कोई लंबित शिकायत नहीं है।
                    </td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-700 text-xs">
                        {c.trackingId}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-900 text-xs">{c.citizenId?.fullName || "नागरिक"}</p>
                        <p className="text-[11px] text-slate-500">+91 {c.citizenId?.mobileNumber || "N/A"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-900 text-xs truncate max-w-xs">{c.subject}</p>
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
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setNewStatus(c.status);
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                        >
                          अद्यतन करें →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Complaint Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    शिकायत कार्रवाई: {selectedComplaint.trackingId}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedComplaint.subject}</p>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    नई स्थिति (New Status)
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="UNDER_REVIEW">समीक्षाधीन (Under Review)</option>
                    <option value="IN_PROGRESS">प्रगति पर (In Progress)</option>
                    <option value="WAITING_FOR_INFORMATION">अतिरिक्त जानकारी प्रतीक्षित</option>
                    <option value="RESOLVED">निस्तारित (Resolved)</option>
                    <option value="REJECTED">अस्वीकृत (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    प्रगति विवरण / टिप्पणी (Update Note) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="की गई कार्रवाई अथवा नागरिक को दी जाने वाली सूचना दर्ज करें..."
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isInternalCheck"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <label htmlFor="isInternalCheck" className="text-xs text-slate-700 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    गोपनीय स्टाफ टिप्पणी (Internal Note - नागरिक को नहीं दिखेगा)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={submittingUpdate}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {submittingUpdate ? "सहेज रहे हैं..." : "अद्यतन सहेजें"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  बूथ कार्यकर्ता हेतु नया कार्य (Assign Task)
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    कार्यकर्ता का चयन करें (Assign To Worker) *
                  </label>
                  {workers.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                      कोई बूथ कार्यकर्ता पंजीकृत नहीं है। कृपया पहले सुपर एडमिन से कार्यकर्ता खाता बनवाएं।
                    </div>
                  ) : (
                    <select
                      value={assignedWorkerId}
                      onChange={(e) => setAssignedWorkerId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {workers.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.fullName} (बूथ {w.boothNumber || "सामान्य"} - +91 {w.mobileNumber})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    कार्य शीर्षक (Task Title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. बूथ क्रमांक 42 पर मतदाता संपर्क अभियान"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    कार्य विवरण (Description) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="कार्यकर्ता को दिए जाने वाले स्पष्ट निर्देश लिखें..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    प्राथमिकता
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="LOW">सामान्य (Low)</option>
                    <option value="MEDIUM">मध्यम (Medium)</option>
                    <option value="HIGH">उच्च (High)</option>
                    <option value="URGENT">अति-आवश्यक (Urgent)</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTask || workers.length === 0}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {submittingTask ? "आवंटित हो रहा है..." : "कार्य आवंटित करें"}
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
