"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Activity
} from "lucide-react";
import { auditApi, AuditLogItem } from "@/lib/api";

export default function AuditLogsTab() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "20",
      };
      if (actionFilter !== "ALL") params.action = actionFilter;

      const res = await auditApi.getLogs(params);
      if (res.success && res.data) {
        setLogs(res.data.logs || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.total || 0);
        }
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action: string) => {
    if (action.includes("CREATE")) {
      return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">{action}</span>;
    }
    if (action.includes("DELETE") || action.includes("DEACTIVATE")) {
      return <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">{action}</span>;
    }
    if (action.includes("RESTORE")) {
      return <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">{action}</span>;
    }
    return <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold">{action}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">प्रशासनिक ऑडिट लॉग (Audit Logs)</h3>
          <p className="text-xs text-slate-500">
            पोर्टल पर किए गए सभी प्रशासनिक कार्यों, सदस्य परिवर्तन, आयात/निर्यात एवं सुरक्षा गतिविधियों का अपरिवर्तनीय इतिहास।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">सभी कार्य (All Actions)</option>
            <option value="USER_CREATE">USER_CREATE (सदस्य निर्माण)</option>
            <option value="USER_UPDATE">USER_UPDATE (सदस्य संपादन)</option>
            <option value="USER_DEACTIVATE">USER_DEACTIVATE (निष्क्रिय)</option>
            <option value="USER_RESTORE">USER_RESTORE (पुनर्प्राप्त)</option>
            <option value="USER_DELETE">USER_DELETE (हटाया)</option>
            <option value="USER_VERIFY">USER_VERIFY (सत्यापन)</option>
            <option value="MEMBER_BULK_IMPORT">MEMBER_BULK_IMPORT (एक्सेल आयात)</option>
            <option value="MEMBER_EXPORT">MEMBER_EXPORT (डेटा निर्यात)</option>
          </select>

          <button
            onClick={fetchLogs}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
            title="रीफ्रेश"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-600" />
            <p className="text-xs mt-2">ऑडिट लॉग लोड हो रहे हैं...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">कोई ऑडिट लॉग रिकॉर्ड नहीं मिला।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3">समय (Timestamp)</th>
                  <th className="px-4 py-3">प्रशासक (Actor)</th>
                  <th className="px-4 py-3">कार्य (Action)</th>
                  <th className="px-4 py-3">संसाधन (Target)</th>
                  <th className="px-4 py-3">विवरण (Details)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString("hi-IN")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-slate-900">
                        {log.actorId?.fullName || log.userId?.fullName || "सिस्टम"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {log.actorRole || log.userId?.role || "SYSTEM"}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getActionBadge(log.action)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{log.resourceType}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-[11px] text-slate-600 font-mono">
                      {log.details ? JSON.stringify(log.details) : "-"}
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
              पृष्ठ {page} / {totalPages} (कुल {totalCount} ऑडिट रिकॉर्ड)
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
