"use client";

import { useEffect, useState, useCallback } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Play,
  TrendingUp,
  AlertTriangle,
  Bot,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { faqsApi, FaqItem, BotAnalytics } from "@/lib/api";

const FAQ_CATEGORIES = [
  { value: "ALL", label: "सभी श्रेणियाँ (All Categories)" },
  { value: "ACCOUNT_LOGIN", label: "खाता एवं लॉगिन (Account & Login)" },
  { value: "MEMBER_REGISTRATION", label: "सदस्य पंजीकरण (Registration)" },
  { value: "COMPLAINT_MANAGEMENT", label: "शिकायत निवारण (Complaint Filing)" },
  { value: "COMPLAINT_STATUS", label: "शिकायत स्थिति (Complaint Status)" },
  { value: "DIRECTORY_DESIGNATION", label: "निर्देशिका एवं पद (Directory)" },
  { value: "PROFILE_UPDATE", label: "प्रोफाइल अपडेट (Profile Update)" },
  { value: "TECHNICAL_SUPPORT", label: "तकनीकी सहायता (Technical Support)" },
  { value: "GENERAL", label: "सामान्य (General)" },
];

export default function FaqManagementTab() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Sub-tabs: 'faqs' | 'test' | 'unanswered' | 'analytics'
  const [subTab, setSubTab] = useState<"faqs" | "test" | "unanswered" | "analytics">("faqs");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    faqId: "",
    questionHi: "",
    questionEn: "",
    answerHi: "",
    answerEn: "",
    keywords: "",
    alternativePhrases: "",
    category: "GENERAL",
    sortOrder: 0,
    isActive: true,
  });

  // Test Matcher State
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState<{
    status: string;
    confidence: number;
    matchedFaq: FaqItem | null;
    clarificationOptions: Array<{ faqId: string; question: string; score?: number }>;
    language: string;
  } | null>(null);
  const [testing, setTesting] = useState(false);

  // Unanswered Queries State
  const [unansweredList, setUnansweredList] = useState<
    Array<{ _id: string; query: string; detectedLanguage: string; status: string; confidence: number; createdAt: string }>
  >([]);
  const [loadingUnanswered, setLoadingUnanswered] = useState(false);

  // Analytics State
  const [analytics, setAnalytics] = useState<BotAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "15",
      };
      if (search.trim()) params.search = search.trim();
      if (category !== "ALL") params.category = category;

      const res = await faqsApi.getAdminFaqs(params);
      if (res.success && res.data) {
        setFaqs(res.data.faqs || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.total || 0);
        }
      }
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    if (subTab === "faqs") {
      fetchFaqs();
    } else if (subTab === "unanswered") {
      fetchUnanswered();
    } else if (subTab === "analytics") {
      fetchAnalytics();
    }
  }, [subTab, fetchFaqs]);

  const fetchUnanswered = async () => {
    setLoadingUnanswered(true);
    try {
      const res = await faqsApi.getUnanswered();
      if (res.success && res.data) {
        setUnansweredList(res.data.unanswered || []);
      }
    } finally {
      setLoadingUnanswered(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await faqsApi.getAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleOpenCreate = (initialQuestion = "") => {
    setEditingFaq(null);
    setFormData({
      faqId: `FAQ-${Date.now().toString(36).toUpperCase()}`,
      questionHi: initialQuestion,
      questionEn: "",
      answerHi: "",
      answerEn: "",
      keywords: "",
      alternativePhrases: "",
      category: "GENERAL",
      sortOrder: 0,
      isActive: true,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: FaqItem) => {
    setEditingFaq(item);
    setFormData({
      faqId: item.faqId,
      questionHi: item.questionHi,
      questionEn: item.questionEn,
      answerHi: item.answerHi,
      answerEn: item.answerEn,
      keywords: Array.isArray(item.keywords) ? item.keywords.join(", ") : "",
      alternativePhrases: Array.isArray(item.alternativePhrases) ? item.alternativePhrases.join("\n") : "",
      category: item.category || "GENERAL",
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const payload: Partial<FaqItem> = {
        faqId: formData.faqId.trim(),
        questionHi: formData.questionHi.trim(),
        questionEn: formData.questionEn.trim(),
        answerHi: formData.answerHi.trim(),
        answerEn: formData.answerEn.trim(),
        keywords: formData.keywords
          ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
        alternativePhrases: formData.alternativePhrases
          ? formData.alternativePhrases.split("\n").map((p) => p.trim()).filter(Boolean)
          : [],
        category: formData.category,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive,
      };

      if (editingFaq) {
        const res = await faqsApi.update(editingFaq._id, payload);
        if (!res.success) throw new Error(res.message || "अपडेट विफल");
      } else {
        const res = await faqsApi.create(payload);
        if (!res.success) throw new Error(res.message || "बनाना विफल");
      }

      setModalOpen(false);
      fetchFaqs();
    } catch (err: unknown) {
      setFormError((err as Error).message || "सहेजने में त्रुटि हुई।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप वाकई इस FAQ को हटाना चाहते हैं?")) return;
    try {
      await faqsApi.delete(id);
      fetchFaqs();
    } catch {
      alert("हटाने में त्रुटि हुई।");
    }
  };

  const handleTestQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setTesting(true);
    try {
      const res = await faqsApi.testMatcher(testQuery.trim());
      if (res.success && res.data) {
        setTestResult(res.data);
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubTab("faqs")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              subTab === "faqs"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            FAQ सूची ({totalCount})
          </button>
          <button
            onClick={() => setSubTab("test")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              subTab === "test"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>बॉ़ट मिलान परीक्षण (Test)</span>
          </button>
          <button
            onClick={() => setSubTab("unanswered")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              subTab === "unanswered"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>अनुत्तरित प्रश्न (Unanswered)</span>
          </button>
          <button
            onClick={() => setSubTab("analytics")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              subTab === "analytics"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>बॉट एनालिटिक्स</span>
          </button>
        </div>

        {subTab === "faqs" && (
          <button
            onClick={() => handleOpenCreate()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>नया FAQ जोड़ें</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. FAQS LIST SUB-TAB */}
      {/* ======================================================== */}
      {subTab === "faqs" && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="प्रश्न, उत्तर या कीवर्ड खोजें..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="sm:col-span-4">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-600" />
                <p className="text-xs">FAQ सूची लोड हो रही है...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">कोई FAQ नहीं मिला।</p>
                <p className="text-xs text-slate-400">नया FAQ जोड़ने के लिए ऊपर दिए बटन पर क्लिक करें।</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="px-4 py-3">ID / श्रेणी</th>
                      <th className="px-4 py-3">हिंदी प्रश्न / उत्तर</th>
                      <th className="px-4 py-3">English Question / Answer</th>
                      <th className="px-4 py-3 text-center">उपयोग</th>
                      <th className="px-4 py-3 text-center">स्थिति</th>
                      <th className="px-4 py-3 text-right">कार्य</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {faqs.map((f) => (
                      <tr key={f._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {f.faqId}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">{f.category}</p>
                        </td>
                        <td className="px-4 py-3 align-top max-w-xs sm:max-w-sm">
                          <p className="font-bold text-slate-900 line-clamp-2">{f.questionHi}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{f.answerHi}</p>
                        </td>
                        <td className="px-4 py-3 align-top max-w-xs sm:max-w-sm">
                          <p className="font-semibold text-slate-800 line-clamp-2">{f.questionEn}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{f.answerEn}</p>
                        </td>
                        <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                            {f.usageCount || 0} बार
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                          {f.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>सक्रिय</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>निष्क्रिय</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="संपादित करें"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(f._id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="हटाएँ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs">
                <span className="text-slate-500">
                  पृष्ठ {page} / {totalPages} (कुल {totalCount} FAQ)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TEST MATCHER SUB-TAB */}
      {/* ======================================================== */}
      {subTab === "test" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">बॉट प्रश्न मिलान परीक्षक (FAQ Matcher Tester)</h3>
            <p className="text-xs text-slate-500 mt-1">
              यहाँ कोई भी प्रश्न लिखकर देखें कि बॉट उसका क्या उत्तर देगा और उसका विश्वास स्कोर (Confidence Score) क्या होगा।
            </p>
          </div>

          <form onSubmit={handleTestQuery} className="flex gap-2">
            <input
              type="text"
              placeholder="परीक्षण प्रश्न लिखें (जैसे: लॉगिन कैसे होगा? या How to file complaint?)"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={testing || !testQuery.trim()}
              className="px-5 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>परीक्षण करें</span>
            </button>
          </form>

          {testResult && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">पहचानी गई भाषा:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-bold">
                    {testResult.language === "HI" ? "हिंदी (Hindi)" : "English"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">स्थिति:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      testResult.status === "ANSWERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : testResult.status === "CLARIFYING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {testResult.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    स्कोर: {Math.round(testResult.confidence * 100)}%
                  </span>
                </div>
              </div>

              {testResult.matchedFaq ? (
                <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase">मिलान हुआ FAQ:</p>
                  <p className="text-sm font-bold text-slate-900">{testResult.matchedFaq.questionHi}</p>
                  <p className="text-xs text-slate-600 mt-1 whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {testResult.language === "HI" ? testResult.matchedFaq.answerHi : testResult.matchedFaq.answerEn}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  इस प्रश्न का कोई सीधा उत्तर नहीं मिला। बॉट फॉलबैक संदेश व लाइव सहायता दिखाएगा।
                </div>
              )}

              {testResult.clarificationOptions && testResult.clarificationOptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700">सुझाए जाने वाले संबंधित प्रश्न (Clarifications):</p>
                  <div className="space-y-1">
                    {testResult.clarificationOptions.map((opt, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex justify-between"
                      >
                        <span>{opt.question}</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          स्कोर: {Math.round((opt.score || 0) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. UNANSWERED QUERIES SUB-TAB */}
      {/* ======================================================== */}
      {subTab === "unanswered" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">नागरिकों द्वारा पूछे गए अनुत्तरित प्रश्न</h3>
              <p className="text-xs text-slate-500">
                जिन प्रश्नों का बॉट सटीक उत्तर नहीं दे सका, उन्हें देखकर सीधे नया FAQ बना सकते हैं।
              </p>
            </div>
            <button
              onClick={fetchUnanswered}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
              title="रीफ्रेश"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loadingUnanswered ? (
              <div className="p-8 text-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-600" />
              </div>
            ) : unansweredList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                कोई अनुत्तरित प्रश्न लॉग नहीं है। बॉट सभी प्रश्नों के सही उत्तर दे रहा है!
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                    <th className="px-4 py-3">पूछा गया प्रश्न</th>
                    <th className="px-4 py-3">पहचानी भाषा</th>
                    <th className="px-4 py-3">स्थिति</th>
                    <th className="px-4 py-3">समय</th>
                    <th className="px-4 py-3 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {unansweredList.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{log.query}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                          {log.detectedLanguage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[11px]">
                        {new Date(log.createdAt).toLocaleString("hi-IN")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenCreate(log.query)}
                          className="px-3 py-1 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors shadow-xs"
                        >
                          FAQ बनाएं
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ANALYTICS SUB-TAB */}
      {/* ======================================================== */}
      {subTab === "analytics" && (
        <div className="space-y-6">
          {loadingAnalytics ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-600" />
            </div>
          ) : analytics ? (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-semibold">कुल बॉट प्रश्न</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{analytics.totalQueries}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-semibold">सटीक उत्तरित</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{analytics.answeredQueries}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-semibold">अनुत्तरित</p>
                  <p className="text-2xl font-black text-rose-600 mt-1">{analytics.unansweredQueries}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-semibold">सटीकता दर (Accuracy)</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">{analytics.accuracyRate}%</p>
                </div>
              </div>

              {/* Top Asked FAQs */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900">सबसे ज्यादा पूछे जाने वाले प्रश्न (Top FAQs)</h4>
                <div className="space-y-2">
                  {analytics.topFaqs.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-bold">
                          {f.faqId}
                        </span>
                        <p className="font-bold text-slate-800">{f.questionHi}</p>
                      </div>
                      <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                        {f.usageCount} बार
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE / EDIT FAQ MODAL */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingFaq ? "FAQ संपादित करें" : "नया FAQ जोड़ें"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">FAQ ID</label>
                  <input
                    type="text"
                    required
                    value={formData.faqId}
                    onChange={(e) => setFormData({ ...formData, faqId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                  >
                    {FAQ_CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">हिंदी प्रश्न (Hindi Question) *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: जन कनेक्ट पर शिकायत कैसे दर्ज करें?"
                  value={formData.questionHi}
                  onChange={(e) => setFormData({ ...formData, questionHi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">हिंदी उत्तर (Hindi Answer) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="नागरिक को दिया जाने वाला विस्तृत हिंदी समाधान..."
                  value={formData.answerHi}
                  onChange={(e) => setFormData({ ...formData, answerHi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">English Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to lodge a complaint on Jan Connect?"
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">English Answer *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed English response for citizens..."
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कीवर्ड (Keywords - कॉमा से अलग करें)
                </label>
                <input
                  type="text"
                  placeholder="शिकायत, complaint, समस्या, निवारण, tracking"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वैकल्पिक वाक्यांश (Alternative Phrases - प्रति पंक्ति एक वाक्यांश)
                </label>
                <textarea
                  rows={2}
                  placeholder="शिकायत कैसे होगी&#10;समस्या दर्ज करने का तरीका"
                  value={formData.alternativePhrases}
                  onChange={(e) => setFormData({ ...formData, alternativePhrases: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  सक्रिय (Active - बॉट तुरंत इस FAQ का उपयोग करेगा)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>सहेजें (Save FAQ)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
