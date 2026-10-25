"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { noticesApi, NoticeItem } from "@/lib/api";

export default function AnnouncementsTab() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "सामान्य सूचना",
    noticeType: "सार्वजनिक",
    isImportant: false,
  });

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await noticesApi.getAll();
      if (res.success && res.data) {
        setNotices(res.data.notices || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      content: "",
      category: "सामान्य सूचना",
      noticeType: "सार्वजनिक",
      isImportant: false,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (n: NoticeItem) => {
    setEditingNotice(n);
    setFormData({
      title: n.title,
      content: n.content,
      category: n.category || "सामान्य सूचना",
      noticeType: n.noticeType || "सार्वजनिक",
      isImportant: Boolean(n.isImportant),
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingNotice) {
        const res = await noticesApi.update(editingNotice._id, formData);
        if (!res.success) throw new Error(res.message || "अपडेट विफल");
      } else {
        const res = await noticesApi.create(formData);
        if (!res.success) throw new Error(res.message || "बनाना विफल");
      }
      setModalOpen(false);
      fetchNotices();
    } catch (err: unknown) {
      setFormError((err as Error).message || "सहेजने में त्रुटि हुई।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप वाकई इस सूचना को हटाना चाहते हैं?")) return;
    try {
      await noticesApi.delete(id);
      fetchNotices();
    } catch {
      alert("हटाने में त्रुटि हुई।");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">सूचनाएं एवं घोषणाएं (Announcements)</h3>
          <p className="text-xs text-slate-500">पोर्टल पर नागरिकों और पदाधिकारियों के लिए सार्वजनिक सूचनाएं प्रकाशित करें।</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नई सूचना प्रकाशित करें</span>
        </button>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-600" />
          <p className="text-xs mt-2">सूचनाएं लोड हो रही हैं...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          कोई सूचना प्रकाशित नहीं है।
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notices.map((n) => (
            <div key={n._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
                    {n.category}
                  </span>
                  {n.isImportant && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      महत्वपूर्ण
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{n.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 whitespace-pre-line">{n.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString("hi-IN") : ""}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(n)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">
                {editingNotice ? "सूचना संशोधित करें" : "नई सूचना प्रकाशित करें"}
              </h3>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
              {formError && <p className="text-rose-600 text-xs">{formError}</p>}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">शीर्षक *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विवरण *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="isImportant" className="text-xs font-bold text-slate-700">
                    महत्वपूर्ण सूचना
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl font-bold"
                >
                  {saving ? "सहेज रहे हैं..." : "प्रकाशित करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
