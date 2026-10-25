"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, XCircle, Clock, Loader2, Save, Eye } from "lucide-react";
import { UserProfile, usersApi } from "@/lib/api";

interface VerifyUserModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
}

export default function VerifyUserModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: VerifyUserModalProps) {
  const [verificationStatus, setVerificationStatus] = useState<"UNVERIFIED" | "VERIFIED" | "REJECTED" | "FLAGGED">("VERIFIED");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [isPublicDirectoryVisible, setIsPublicDirectoryVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setVerificationStatus(user.verificationStatus || "VERIFIED");
      setVerificationNotes(user.verificationNotes || "");
      setIsPublicDirectoryVisible(user.isPublicDirectoryVisible ?? true);
      setErrorMsg("");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await usersApi.verify(user._id, {
        verificationStatus,
        verificationNotes: verificationNotes.trim() || undefined,
        isPublicDirectoryVisible,
      });

      if (res.success && res.data) {
        onSuccess(res.data.user);
        onClose();
      } else {
        setErrorMsg(res.message || "सत्यापन स्थिति अद्यतन करने में त्रुटि।");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || "अनपेक्षित त्रुटि हुई।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">सदस्य / प्रतिनिधि सत्यापन</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-sm font-bold text-slate-800">{user.fullName}</div>
            <div className="text-xs text-slate-500 flex flex-wrap gap-x-3">
              <span>मोबाइल: {user.mobileNumber}</span>
              <span>पद: {user.designation || "नागरिक"}</span>
              <span>ज़िला: {user.district || "—"}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              सत्यापन स्थिति (Verification Decision)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setVerificationStatus("VERIFIED")}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border font-semibold transition-all ${
                  verificationStatus === "VERIFIED"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>सत्यापित (Verified)</span>
              </button>

              <button
                type="button"
                onClick={() => setVerificationStatus("UNVERIFIED")}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border font-semibold transition-all ${
                  verificationStatus === "UNVERIFIED"
                    ? "bg-slate-100 border-slate-400 text-slate-800 ring-2 ring-slate-400/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>असत्यापित (Unverified)</span>
              </button>

              <button
                type="button"
                onClick={() => setVerificationStatus("FLAGGED")}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border font-semibold transition-all ${
                  verificationStatus === "FLAGGED"
                    ? "bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>जांच लंबित (Flagged)</span>
              </button>

              <button
                type="button"
                onClick={() => setVerificationStatus("REJECTED")}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border font-semibold transition-all ${
                  verificationStatus === "REJECTED"
                    ? "bg-red-50 border-red-500 text-red-800 ring-2 ring-red-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>अस्वीकृत (Rejected)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              सार्वजनिक निर्देशिका में प्रदर्शन
            </label>
            <div className="flex items-center gap-2.5 p-2.5 border border-slate-200 rounded-lg bg-slate-50">
              <input
                type="checkbox"
                id="dirVisToggle"
                checked={isPublicDirectoryVisible}
                onChange={(e) => setIsPublicDirectoryVisible(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="dirVisToggle" className="text-xs text-slate-700 cursor-pointer font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>सार्वजनिक निर्देशिका (Public Civic Directory) में दिखाएं</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              प्रशासनिक सत्यापन टिप्पणी (Verification Notes)
            </label>
            <textarea
              rows={2}
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="सत्यापन दस्तावेज, फोन कॉल सत्यापन या संदर्भ दर्ज करें..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              रद्द करें
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>सत्यापन सहेजें</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
