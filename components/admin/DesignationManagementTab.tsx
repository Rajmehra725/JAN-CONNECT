"use client";

import { useState } from "react";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  Search,
  Loader2,
  X,
  Save,
  AlertCircle,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { DesignationItem, DepartmentItem, designationsApi } from "@/lib/api";

interface DesignationManagementTabProps {
  designations: DesignationItem[];
  departments: DepartmentItem[];
  onRefresh: () => void;
}

export default function DesignationManagementTab({
  designations,
  departments,
  onRefresh,
}: DesignationManagementTabProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"designations" | "departments">("designations");

  // Designation Modal State
  const [showDesModal, setShowDesModal] = useState(false);
  const [editingDes, setEditingDes] = useState<DesignationItem | null>(null);
  const [desTitle, setDesTitle] = useState("");
  const [desTitleHi, setDesTitleHi] = useState("");
  const [desCategory, setDesCategory] = useState<"POLITICAL" | "ORGANIZATIONAL" | "ADMINISTRATIVE">("POLITICAL");
  const [desLevel, setDesLevel] = useState<string>("STATE");
  const [desAreaType, setDesAreaType] = useState<"ALL" | "RURAL" | "URBAN">("ALL");
  const [desDeptId, setDesDeptId] = useState("");
  const [desSortOrder, setDesSortOrder] = useState<number>(10);
  const [desIsActive, setDesIsActive] = useState(true);
  const [savingDes, setSavingDes] = useState(false);
  const [desError, setDesError] = useState("");

  // Department Modal State
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptNameHi, setDeptNameHi] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [savingDept, setSavingDept] = useState(false);
  const [deptError, setDeptError] = useState("");

  // Deletion feedback
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const openCreateDes = () => {
    setEditingDes(null);
    setDesTitle("");
    setDesTitleHi("");
    setDesCategory("POLITICAL");
    setDesLevel("STATE");
    setDesAreaType("ALL");
    setDesDeptId("");
    setDesSortOrder(10);
    setDesIsActive(true);
    setDesError("");
    setShowDesModal(true);
  };

  const openEditDes = (des: DesignationItem) => {
    setEditingDes(des);
    setDesTitle(des.title || "");
    setDesTitleHi(des.titleHi || "");
    setDesCategory(des.category || "POLITICAL");
    setDesLevel(des.level || "STATE");
    setDesAreaType(des.applicableAreaType || "ALL");
    const deptId = typeof des.departmentId === "object" ? des.departmentId?._id : des.departmentId;
    setDesDeptId(deptId || "");
    setDesSortOrder(des.sortOrder ?? 10);
    setDesIsActive(des.isActive);
    setDesError("");
    setShowDesModal(true);
  };

  const handleSaveDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desTitle.trim()) {
      setDesError("पद का नाम (Title) अनिवार्य है।");
      return;
    }

    setSavingDes(true);
    setDesError("");
    try {
      const payload: Partial<DesignationItem> = {
        title: desTitle.trim(),
        titleHi: desTitleHi.trim() || undefined,
        category: desCategory,
        level: desLevel as DesignationItem["level"],
        applicableAreaType: desAreaType,
        departmentId: desDeptId || undefined,
        sortOrder: Number(desSortOrder) || 10,
        isActive: desIsActive,
      };

      if (editingDes) {
        const res = await designationsApi.update(editingDes._id, payload);
        if (res.success) {
          setShowDesModal(false);
          onRefresh();
          setActionNotice({ type: "success", message: `पद [${desTitle}] अद्यतित किया गया।` });
        } else {
          setDesError(res.message || "अपडेट विफल रहा।");
        }
      } else {
        const res = await designationsApi.create(payload);
        if (res.success) {
          setShowDesModal(false);
          onRefresh();
          setActionNotice({ type: "success", message: `नया पद [${desTitle}] सफलतापूर्वक जोड़ा गया।` });
        } else {
          setDesError(res.message || "निर्माण विफल रहा।");
        }
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setDesError(e.message || "अनपेक्षित त्रुटि हुई।");
    } finally {
      setSavingDes(false);
    }
  };

  const handleDeleteDesignation = async (des: DesignationItem) => {
    const confirmMsg =
      (des.assignedMembersCount || 0) > 0
        ? `इस पद से ${des.assignedMembersCount} सदस्य जुड़े हैं। हटाने पर यह पद केवल निष्क्रिय (Deactivate) किया जाएगा। क्या आप आगे बढ़ना चाहते हैं?`
        : `क्या आप पद [${des.title}] को हटाना चाहते हैं?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await designationsApi.delete(des._id);
      if (res.success) {
        onRefresh();
        setActionNotice({
          type: "success",
          message: res.data?.deactivated
            ? `पद [${des.title}] निष्क्रिय किया गया क्योंकि यह सदस्यों द्वारा प्रयुक्त है।`
            : `पद [${des.title}] सफलतापूर्वक हटाया गया।`,
        });
      }
    } catch {
      setActionNotice({ type: "error", message: "पद हटाने में त्रुटि हुई।" });
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      setDeptError("विभाग का नाम अनिवार्य है।");
      return;
    }

    setSavingDept(true);
    setDeptError("");
    try {
      const res = await designationsApi.createDepartment({
        name: deptName.trim(),
        nameHi: deptNameHi.trim() || undefined,
        code: deptCode.trim().toUpperCase() || undefined,
        description: deptDesc.trim() || undefined,
      });

      if (res.success) {
        setShowDeptModal(false);
        setDeptName("");
        setDeptNameHi("");
        setDeptCode("");
        setDeptDesc("");
        onRefresh();
        setActionNotice({ type: "success", message: `विभाग [${deptName}] सफलतापूर्वक जोड़ा गया।` });
      } else {
        setDeptError(res.message || "विभाग निर्माण विफल।");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setDeptError(e.message || "अनपेक्षित त्रुटि हुई।");
    } finally {
      setSavingDept(false);
    }
  };

  const filteredList = designations.filter((d) => {
    if (categoryFilter !== "ALL" && d.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchHi = d.titleHi?.toLowerCase().includes(q);
      const matchLevel = d.level?.toLowerCase().includes(q);
      return matchTitle || matchHi || matchLevel;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Action Notification */}
      {actionNotice && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between text-xs font-medium border ${
            actionNotice.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice.message}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Sub-Tabs */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">पदनाम एवं विभाग प्रबंधन (Master Data)</h2>
            <p className="text-xs text-slate-500">
              भूमिका (Role) से स्वतंत्र पद एवं विभागों का प्रबंधन | कुल पद: {designations.length} | कुल विभाग: {departments.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab("designations")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === "designations"
                  ? "bg-white text-orange-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              पदनाम ({designations.length})
            </button>
            <button
              onClick={() => setActiveSubTab("departments")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === "departments"
                  ? "bg-white text-orange-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              विभाग ({departments.length})
            </button>
          </div>

          {activeSubTab === "designations" ? (
            <button
              onClick={openCreateDes}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>नया पद जोड़ें</span>
            </button>
          ) : (
            <button
              onClick={() => setShowDeptModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>नया विभाग जोड़ें</span>
            </button>
          )}
        </div>
      </div>

      {/* SUBTAB 1: DESIGNATIONS LIST */}
      {activeSubTab === "designations" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="पदनाम या स्तर खोजें..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">श्रेणी:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-800"
              >
                <option value="ALL">सभी श्रेणियां (All Categories)</option>
                <option value="POLITICAL">राजनीतिक (Political)</option>
                <option value="ORGANIZATIONAL">संगठनात्मक (Organizational)</option>
                <option value="ADMINISTRATIVE">प्रशासनिक (Administrative)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">पदनाम (Title)</th>
                    <th className="py-3 px-4">श्रेणी (Category)</th>
                    <th className="py-3 px-4">स्तर (Level)</th>
                    <th className="py-3 px-4">क्षेत्र प्रकार</th>
                    <th className="py-3 px-4">संबद्ध विभाग</th>
                    <th className="py-3 px-4 text-center">आवंटित सदस्य</th>
                    <th className="py-3 px-4 text-center">स्थिति</th>
                    <th className="py-3 px-4 text-right">क्रियाएं</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        कोई पदनाम नहीं मिला।
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((d) => (
                      <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{d.title}</div>
                          {d.titleHi && <div className="text-[11px] text-slate-500">{d.titleHi}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              d.category === "POLITICAL"
                                ? "bg-orange-100 text-orange-800 border border-orange-200"
                                : d.category === "ORGANIZATIONAL"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-purple-100 text-purple-800 border border-purple-200"
                            }`}
                          >
                            {d.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">{d.level || "—"}</td>
                        <td className="py-3 px-4 text-slate-600">
                          {d.applicableAreaType === "ALL"
                            ? "समस्त"
                            : d.applicableAreaType === "RURAL"
                            ? "केवल ग्रामीण"
                            : "केवल शहरी"}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{d.departmentName || "सामान्य / कोई नहीं"}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-800 px-2 py-0.5 rounded bg-slate-100">
                            <Users className="w-3 h-3 text-slate-500" />
                            {d.assignedMembersCount || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {d.isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              सक्रिय
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                              <XCircle className="w-3 h-3" />
                              निष्क्रिय
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditDes(d)}
                              className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="संपादित करें"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDesignation(d)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="हटाएं / निष्क्रिय करें"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DEPARTMENTS LIST */}
      {activeSubTab === "departments" && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">विभाग का नाम (Department Name)</th>
                  <th className="py-3 px-4">हिंदी नाम</th>
                  <th className="py-3 px-4">कोड (Code)</th>
                  <th className="py-3 px-4">विवरण (Description)</th>
                  <th className="py-3 px-4 text-center">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">{dept.name}</td>
                    <td className="py-3 px-4 text-slate-600">{dept.nameHi || "—"}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{dept.code || "—"}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{dept.description || "—"}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        सक्रिय
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT DESIGNATION MODAL */}
      {showDesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-linear-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base">
                {editingDes ? `पदनाम संपादन: ${editingDes.title}` : "नया पदनाम जोड़ें"}
              </h3>
              <button
                onClick={() => setShowDesModal(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDesignation} className="p-5 space-y-3.5">
              {desError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {desError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    पदनाम (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={desTitle}
                    onChange={(e) => setDesTitle(e.target.value)}
                    placeholder="उदा. Member of Legislative Assembly"
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">पदनाम (हिंदी)</label>
                  <input
                    type="text"
                    value={desTitleHi}
                    onChange={(e) => setDesTitleHi(e.target.value)}
                    placeholder="उदा. विधायक"
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={desCategory}
                    onChange={(e) => setDesCategory(e.target.value as "POLITICAL" | "ORGANIZATIONAL" | "ADMINISTRATIVE")}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="POLITICAL">राजनीतिक (POLITICAL)</option>
                    <option value="ORGANIZATIONAL">संगठनात्मक (ORGANIZATIONAL)</option>
                    <option value="ADMINISTRATIVE">प्रशासनिक (ADMINISTRATIVE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">स्तर (Hierarchy Level)</label>
                  <select
                    value={desLevel}
                    onChange={(e) => setDesLevel(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="NATIONAL">राष्ट्रीय (National)</option>
                    <option value="STATE">राज्य स्तर (State)</option>
                    <option value="DIVISION">संभाग स्तर (Division)</option>
                    <option value="DISTRICT">ज़िला स्तर (District)</option>
                    <option value="SUB_DIVISION">अनुविभाग / तहसील (Sub-Division)</option>
                    <option value="BLOCK">विकासखंड स्तर (Block)</option>
                    <option value="MUNICIPAL">शहरी निकाय (Municipal)</option>
                    <option value="PANCHAYAT">पंचायत स्तर (Panchayat)</option>
                    <option value="BOOTH">बूथ स्तर (Booth)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">संबद्ध क्षेत्र प्रकार</label>
                  <select
                    value={desAreaType}
                    onChange={(e) => setDesAreaType(e.target.value as "ALL" | "RURAL" | "URBAN")}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ALL">समस्त क्षेत्र (ग्रामीण एवं शहरी)</option>
                    <option value="RURAL">केवल ग्रामीण क्षेत्र</option>
                    <option value="URBAN">केवल शहरी क्षेत्र</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">संबद्ध विभाग (Department)</label>
                  <select
                    value={desDeptId}
                    onChange={(e) => setDesDeptId(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">-- सामान्य / कोई विभाग नहीं --</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="desActiveToggle"
                    checked={desIsActive}
                    onChange={(e) => setDesIsActive(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="desActiveToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                    सक्रिय पद (Active)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDesModal(false)}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={savingDes}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm disabled:opacity-50"
                  >
                    {savingDes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>सहेजें</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DEPARTMENT MODAL */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-blue-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base">नया विभाग जोड़ें</h3>
              <button
                onClick={() => setShowDeptModal(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="p-5 space-y-3.5">
              {deptError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {deptError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  विभाग का नाम (Department Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="उदा. गृह विभाग / Police & Home"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">हिंदी नाम (Hindi Name)</label>
                <input
                  type="text"
                  value={deptNameHi}
                  onChange={(e) => setDeptNameHi(e.target.value)}
                  placeholder="उदा. गृह विभाग"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">विभाग कोड (Code)</label>
                <input
                  type="text"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
                  placeholder="उदा. POLICE"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">विवरण (Description)</label>
                <textarea
                  rows={2}
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  placeholder="विभाग का संक्षिप्त विवरण..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={savingDept}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50"
                >
                  {savingDept ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>विभाग सहेजें</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
