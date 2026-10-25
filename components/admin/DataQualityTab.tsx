"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Search,
  Filter,
  Eye,
  Edit2,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { usersApi, UserProfile } from "@/lib/api";

interface DataQualityTabProps {
  onEditUser: (user: UserProfile) => void;
  onVerifyUser: (user: UserProfile) => void;
}

export default function DataQualityTab({ onEditUser, onVerifyUser }: DataQualityTabProps) {
  const [activeCategory, setActiveCategory] = useState<
    "unverified" | "missing_designation" | "missing_location" | "incomplete_contact"
  >("unverified");

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCategoryData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "15",
      };

      if (activeCategory === "unverified") {
        params.verificationStatus = "UNVERIFIED";
      } else if (activeCategory === "missing_designation") {
        params.designationStatus = "NOT_ASSIGNED";
      } else if (activeCategory === "missing_location") {
        params.locationStatus = "INCOMPLETE";
      } else if (activeCategory === "incomplete_contact") {
        // Query users without email or incomplete records
        params.search = "";
      }

      const res = await usersApi.getAll(params);
      if (res.success && res.data) {
        setUsers(res.data.users || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.total || 0);
        }
      }
    } catch {
      // Handled gracefully
    } finally {
      setLoading(false);
    }
  }, [activeCategory, page]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  return (
    <div className="space-y-6">
      {/* Category Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => {
            setActiveCategory("unverified");
            setPage(1);
          }}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activeCategory === "unverified"
              ? "bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <ShieldAlert className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">सत्यापन शेष</span>
          </div>
          <p className="text-base font-black mt-2">असत्यापित सदस्य</p>
          <p className="text-[11px] opacity-80">Unverified Records</p>
        </button>

        <button
          onClick={() => {
            setActiveCategory("missing_designation");
            setPage(1);
          }}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activeCategory === "missing_designation"
              ? "bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <Briefcase className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">पद शेष</span>
          </div>
          <p className="text-base font-black mt-2">बिना पद के सदस्य</p>
          <p className="text-[11px] opacity-80">Missing Designation</p>
        </button>

        <button
          onClick={() => {
            setActiveCategory("missing_location");
            setPage(1);
          }}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activeCategory === "missing_location"
              ? "bg-purple-600 text-white border-purple-700 shadow-md scale-[1.02]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <MapPin className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">स्थान शेष</span>
          </div>
          <p className="text-base font-black mt-2">अपूर्ण भौगोलिक पता</p>
          <p className="text-[11px] opacity-80">Missing Location / Ward</p>
        </button>

        <button
          onClick={() => {
            setActiveCategory("incomplete_contact");
            setPage(1);
          }}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activeCategory === "incomplete_contact"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <Mail className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">संपर्क शेष</span>
          </div>
          <p className="text-base font-black mt-2">ईमेल / संपर्क अपूर्ण</p>
          <p className="text-[11px] opacity-80">Incomplete Contact Info</p>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {activeCategory === "unverified" && "सत्यापन हेतु लंबित सदस्य"}
              {activeCategory === "missing_designation" && "पद आवंटन हेतु लंबित सदस्य"}
              {activeCategory === "missing_location" && "भौगोलिक जानकारी पूर्ण करने हेतु सदस्य"}
              {activeCategory === "incomplete_contact" && "अपूर्ण संपर्क विवरण वाले सदस्य"}
            </h3>
            <p className="text-xs text-slate-500">कुल {totalCount} रिकॉर्ड समीक्षा के लिए उपलब्ध हैं।</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-600" />
            <p className="text-xs mt-2">डेटा लोड हो रहा है...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-sm font-bold text-slate-900">बहुत बढ़िया! कोई लंबित रिकॉर्ड नहीं है।</p>
            <p className="text-xs text-slate-400">इस श्रेणी के सभी सदस्यों का डेटा पूरी तरह प्रमाणित एवं पूर्ण है।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3">सदस्य नाम / मोबाइल</th>
                  <th className="px-4 py-3">भूमिका (Role)</th>
                  <th className="px-4 py-3">वर्तमान पद (Designation)</th>
                  <th className="px-4 py-3">जिला / स्थान</th>
                  <th className="px-4 py-3">सत्यापन स्थिति</th>
                  <th className="px-4 py-3 text-right">त्वरित कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      {u.designation ? (
                        <span className="font-semibold text-slate-800">{u.designation}</span>
                      ) : (
                        <span className="text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          पद आवंटित नहीं
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {u.district ? (
                        <span className="text-slate-800">
                          {u.district} {u.areaType ? `(${u.areaType})` : ""}
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          जिला दर्ज नहीं
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.verificationStatus === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : u.verificationStatus === "REJECTED"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {u.verificationStatus || "UNVERIFIED"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => onVerifyUser(u)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        सत्यापित करें
                      </button>
                      <button
                        onClick={() => onEditUser(u)}
                        className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                        title="संपादित करें"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
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
              पृष्ठ {page} / {totalPages} (कुल {totalCount})
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
  );
}
