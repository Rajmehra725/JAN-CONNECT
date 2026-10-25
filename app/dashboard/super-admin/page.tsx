"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Lock,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  UserPlus,
  Shield,
  Activity,
  LogOut,
  X,
  Loader2,
  Phone,
  Power,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertTriangle,
  Calendar,
  MapPin,
  FileText,
  UserCheck,
  Briefcase,
  ChevronDown,
  Building2,
  Bot,
  ShieldCheck,
  Mail,
} from "lucide-react";
import {
  reportsApi,
  usersApi,
  complaintsApi,
  designationsApi,
  geographyApi,
  DashboardSummary,
  UserProfile,
  ComplaintItem,
  ComplaintUpdateItem,
  DesignationItem,
  DepartmentItem,
  GeographyHierarchy,
} from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import HierarchicalFilters, { FilterState, initialFilterState } from "@/components/admin/HierarchicalFilters";
import UserFormModal from "@/components/admin/UserFormModal";
import VerifyUserModal from "@/components/admin/VerifyUserModal";
import FlexibleImportModal from "@/components/admin/FlexibleImportModal";
import DesignationManagementTab from "@/components/admin/DesignationManagementTab";
import FaqManagementTab from "@/components/admin/FaqManagementTab";
import DataQualityTab from "@/components/admin/DataQualityTab";
import AuditLogsTab from "@/components/admin/AuditLogsTab";
import SystemHealthTab from "@/components/admin/SystemHealthTab";
import AnnouncementsTab from "@/components/admin/AnnouncementsTab";
import { Database, Bell } from "lucide-react";

export type SuperAdminTab =
  | "overview"
  | "members"
  | "quality"
  | "designations"
  | "complaints"
  | "bot"
  | "announcements"
  | "audit"
  | "system";

export default function SuperAdminDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth(["SUPER_ADMIN"]);
  const { logout } = useAuth();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<SuperAdminTab>("overview");

  // Page size & Sorting in Member Management
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Overview Filters
  const [overviewStartDate, setOverviewStartDate] = useState("");
  const [overviewEndDate, setOverviewEndDate] = useState("");
  const [overviewDistrict, setOverviewDistrict] = useState("ALL");
  const [overviewDesignation, setOverviewDesignation] = useState("ALL");
  const [applyingOverviewFilter, setApplyingOverviewFilter] = useState(false);

  // Summary & Stats
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ========================================================
  // MASTER DATA STATE
  // ========================================================
  const [hierarchy, setHierarchy] = useState<GeographyHierarchy | null>(null);
  const [designations, setDesignations] = useState<DesignationItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);

  // ========================================================
  // MEMBER MANAGEMENT STATE
  // ========================================================
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotalPages, setMemberTotalPages] = useState(1);
  const [memberTotalCount, setMemberTotalCount] = useState(0);

  // Selection & Export
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Modals
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [viewUserModal, setViewUserModal] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [hardDeleteOption, setHardDeleteOption] = useState(false);

  // New Upgraded Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingUserTarget, setEditingUserTarget] = useState<UserProfile | null>(null);

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyUserTarget, setVerifyUserTarget] = useState<UserProfile | null>(null);

  const [importModalOpen, setImportModalOpen] = useState(false);

  // ========================================================
  // COMPLAINT MANAGEMENT STATE
  // ========================================================
  const [complaintsList, setComplaintsList] = useState<ComplaintItem[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [complaintSearch, setComplaintSearch] = useState("");
  const [complaintStatusFilter, setComplaintStatusFilter] = useState("ALL");
  const [complaintPriorityFilter, setComplaintPriorityFilter] = useState("ALL");
  const [complaintPage, setComplaintPage] = useState(1);
  const [complaintTotalPages, setComplaintTotalPages] = useState(1);
  const [complaintTotalCount, setComplaintTotalCount] = useState(0);

  // Complaint Detail & Update Modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [complaintTimeline, setComplaintTimeline] = useState<ComplaintUpdateItem[]>([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [loadingComplaintDetail, setLoadingComplaintDetail] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updateText, setUpdateText] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  // System Health
  const [healthStatus, setHealthStatus] = useState<{ status: string; database: string } | null>(null);

  // ========================================================
  // DATA FETCHING HOOKS
  // ========================================================
  const fetchSummary = useCallback(async (filters?: Record<string, string>) => {
    try {
      const sumRes = await reportsApi.getSummary(filters);
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
    } catch {
      setErrorMsg("सिस्टम सारांश लोड करने में त्रुटि हुई।");
    }
  }, []);

  const fetchMasterData = useCallback(async () => {
    try {
      const [hRes, desRes, depRes] = await Promise.all([
        geographyApi.getHierarchy(),
        designationsApi.getAll(),
        designationsApi.getDepartments(),
      ]);
      if (hRes.success && hRes.data) setHierarchy(hRes.data);
      if (desRes.success && desRes.data) setDesignations(desRes.data);
      if (depRes.success && depRes.data) setDepartments(depRes.data);
    } catch {
      // Non-fatal
    }
  }, []);

  const fetchUsers = useCallback(
    async (
      page = 1,
      customFilters?: Partial<FilterState>,
      customLimit?: number,
      customSortBy?: string,
      customSortOrder?: "asc" | "desc"
    ) => {
      setLoadingUsers(true);
      try {
        const active = { ...filterState, ...(customFilters || {}) };
        const activeLimit = customLimit || pageSize;
        const activeSortBy = customSortBy || sortBy;
        const activeSortOrder = customSortOrder || sortOrder;

        const params: Record<string, string> = {
          page: String(page),
          limit: String(activeLimit),
          sortBy: activeSortBy,
          sortOrder: activeSortOrder,
        };

        if (active.search.trim()) params.search = active.search.trim();
        if (active.role !== "ALL") params.role = active.role;
        if (active.status !== "ALL") params.status = active.status;
        if (active.verificationStatus !== "ALL") params.verificationStatus = active.verificationStatus;
        if (active.state !== "ALL") params.state = active.state;
        if (active.district !== "ALL") params.district = active.district;
        if (active.areaType !== "ALL") params.areaType = active.areaType;
        if (active.developmentBlock !== "ALL") params.developmentBlock = active.developmentBlock;
        if (active.gramPanchayat !== "ALL") params.gramPanchayat = active.gramPanchayat;
        if (active.localBody !== "ALL") params.localBody = active.localBody;
        if (active.wardNumber !== "ALL") params.wardNumber = active.wardNumber;
        if (active.assemblyConstituency !== "ALL") params.assemblyConstituency = active.assemblyConstituency;
        if (active.parliamentaryConstituency !== "ALL") params.parliamentaryConstituency = active.parliamentaryConstituency;
        if (active.designationCategory !== "ALL") params.designationCategory = active.designationCategory;
        if (active.designation !== "ALL") params.designation = active.designation;
        if (active.department !== "ALL") params.department = active.department;
        if (active.designationStatus !== "ALL") params.designationStatus = active.designationStatus;
        if (active.locationStatus !== "ALL") params.locationStatus = active.locationStatus;

        const res = await usersApi.getAll(params);
        if (res.success && res.data) {
          setUsersList(res.data.users || []);
          if (res.data.pagination) {
            setMemberTotalPages(res.data.pagination.totalPages || 1);
            setMemberTotalCount(res.data.pagination.total || 0);
            setMemberPage(res.data.pagination.page || 1);
          }
        }
      } catch {
        setErrorMsg("सदस्य सूची लोड करने में त्रुटि।");
      } finally {
        setLoadingUsers(false);
      }
    },
    [filterState, pageSize, sortBy, sortOrder]
  );

  const fetchComplaints = useCallback(
    async (page = 1) => {
      setLoadingComplaints(true);
      try {
        const params: Record<string, string> = {
          page: String(page),
          limit: "15",
        };
        if (complaintStatusFilter && complaintStatusFilter !== "ALL") params.status = complaintStatusFilter;
        if (complaintPriorityFilter && complaintPriorityFilter !== "ALL") params.priority = complaintPriorityFilter;
        if (complaintSearch.trim()) params.search = complaintSearch.trim();

        const res = await complaintsApi.getAll(params);
        if (res.success && res.data) {
          setComplaintsList(res.data.complaints || []);
          if (res.data.pagination) {
            setComplaintTotalPages((res.data.pagination as { totalPages: number }).totalPages || 1);
            setComplaintTotalCount((res.data.pagination as { total: number }).total || 0);
            setComplaintPage((res.data.pagination as { page: number }).page || 1);
          }
        }
      } catch {
        setErrorMsg("शिकायत सूची लोड करने में त्रुटि।");
      } finally {
        setLoadingComplaints(false);
      }
    },
    [complaintStatusFilter, complaintPriorityFilter, complaintSearch]
  );

  const checkHealth = useCallback(async () => {
    try {
      const rawUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jan-connect-backend.onrender.com/api/v1";
      const cleanUrl = rawUrl.replace(/\/+$/, "");
      const res = await fetch(`${cleanUrl}/health`, { credentials: "omit" });
      const data = await res.json().catch(() => null);
      if (data) {
        setHealthStatus(data.data || { status: data.status, database: data.database });
      }
    } catch {
      setHealthStatus({ status: "DEGRADED", database: "DISCONNECTED" });
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    setErrorMsg("");
    setSuccessMsg("");
    await Promise.all([
      fetchSummary(),
      fetchMasterData(),
      fetchUsers(memberPage),
      fetchComplaints(complaintPage),
      checkHealth(),
    ]);
    setRefreshing(false);
    setLoadingData(false);
  }, [fetchSummary, fetchMasterData, fetchUsers, fetchComplaints, checkHealth, memberPage, complaintPage]);

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      refreshAll();
    }
  }, [user, refreshAll]);

  // Handle cascading filter changes from HierarchicalFilters
  const handleFilterChange = (updated: Partial<FilterState>) => {
    const nextFilters = { ...filterState, ...updated };
    setFilterState(nextFilters);
    fetchUsers(1, nextFilters);
  };

  const handleResetFilters = () => {
    setFilterState(initialFilterState);
    fetchUsers(1, initialFilterState);
  };

  // Selection toggle
  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllOnPage = () => {
    const currentPageIds = usersList.map((u) => u._id);
    const allSelected = currentPageIds.every((id) => selectedUserIds.includes(id));
    if (allSelected) {
      setSelectedUserIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  // Member Export Handlers
  const handleExport = async (type: "FILTERED" | "SELECTED" | "ALL", format: "xlsx" | "csv" = "xlsx") => {
    setExportDropdownOpen(false);
    try {
      const params: Record<string, string> = {
        exportType: type,
        format,
      };

      if (type === "FILTERED") {
        Object.entries(filterState).forEach(([k, v]) => {
          if (v && v !== "ALL") params[k] = v;
        });
      }

      const ids = type === "SELECTED" ? selectedUserIds : undefined;
      const filename = `jan-connect-members-${type.toLowerCase()}-${Date.now()}.${format}`;
      await usersApi.downloadExport(params, ids, filename);
      setSuccessMsg(`सदस्य डेटा सफलतापूर्वक निर्यात हुआ (${filename})।`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || "निर्यात विफल रहा।");
    }
  };

  // Member Status Toggle
  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await usersApi.updateStatus(userId, nextStatus as "ACTIVE" | "SUSPENDED");
      if (res.success) {
        setSuccessMsg(`सदस्य स्थिति सफलतापूर्वक ${nextStatus === "ACTIVE" ? "सक्रिय" : "निलंबित"} की गई।`);
        fetchUsers(memberPage);
        fetchSummary();
      } else {
        setErrorMsg(res.message || "स्थिति अद्यतन विफल रहा।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeletingUser(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await usersApi.delete(selectedUser._id, hardDeleteOption);
      if (res.success) {
        setSuccessMsg(
          res.data?.softDeactivated
            ? "सदस्य खाता सुरक्षा व इतिहास संरक्षण हेतु सफलतापूर्वक निष्क्रिय (Deactivated) किया गया।"
            : "सदस्य खाता डेटाबेस से सफलतापूर्वक हटा दिया गया।"
        );
        setDeleteUserModal(false);
        fetchUsers(memberPage);
        fetchSummary();
      } else {
        setErrorMsg(res.message || "सदस्य हटाने में विफलता।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setDeletingUser(false);
    }
  };

  // Complaint Details & Update
  const openComplaintModal = async (complaint: ComplaintItem) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setUpdateText("");
    setRejectionReason(complaint.rejectionReason || "");
    setIsInternalNote(false);
    setShowComplaintModal(true);
    setLoadingComplaintDetail(true);

    try {
      const res = await complaintsApi.getById(complaint._id);
      if (res.success && res.data) {
        setSelectedComplaint(res.data.complaint);
        setComplaintTimeline(res.data.timeline || []);
      }
    } catch {
      setErrorMsg("शिकायत का विवरण लोड करने में त्रुटि।");
    } finally {
      setLoadingComplaintDetail(false);
    }
  };

  const handleUpdateComplaintStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    if (!updateText.trim()) {
      setErrorMsg("कृपया प्रगति विवरण अथवा टिप्पणी दर्ज करें।");
      return;
    }

    if (newStatus === "REJECTED" && !rejectionReason.trim()) {
      setErrorMsg("शिकायत अस्वीकृत करने का कारण अनिवार्य है।");
      return;
    }

    setSubmittingUpdate(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await complaintsApi.addUpdate(selectedComplaint._id, {
        updateText: updateText.trim(),
        newStatus: newStatus !== selectedComplaint.status ? newStatus : undefined,
        isInternal: isInternalNote,
        rejectionReason: newStatus === "REJECTED" ? rejectionReason.trim() : undefined,
      });

      if (res.success) {
        setSuccessMsg("शिकायत स्थिति सफलतापूर्वक अद्यतित की गई।");
        setUpdateText("");
        const detailRes = await complaintsApi.getById(selectedComplaint._id);
        if (detailRes.success && detailRes.data) {
          setSelectedComplaint(detailRes.data.complaint);
          setComplaintTimeline(detailRes.data.timeline || []);
        }
        fetchComplaints(complaintPage);
        fetchSummary();
      } else {
        setErrorMsg(res.message || "शिकायत अपडेट विफल रहा।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setSubmittingUpdate(false);
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

  const allOnPageSelected =
    usersList.length > 0 && usersList.every((u) => selectedUserIds.includes(u._id));

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
              संपूर्ण Jan Connect मंच नियंत्रण, सदस्य प्रबंधन, शिकायत निवारण, एक्सेल आयात/निर्यात एवं सुरक्षा गार्डरेल्स।
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
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center rounded-xl border border-emerald-700/60 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900/60"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              एक्सेल आयात (Import)
            </button>
            <Link
              href="/directory"
              target="_blank"
              className="inline-flex items-center rounded-xl border border-blue-700/60 bg-blue-950/40 px-3.5 py-2 text-xs font-bold text-blue-300 transition hover:bg-blue-900/60"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
              सार्वजनिक निर्देशिका
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
            >
              <Users className="mr-1.5 h-3.5 w-3.5 text-orange-400" />
              मेरी प्रोफाइल
            </Link>
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
            <div className="flex-1">
              <p className="font-bold">त्रुटि सूचना:</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg("")} className="text-rose-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center justify-between gap-2.5 rounded-xl border border-emerald-800 bg-emerald-950/80 p-4 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="font-semibold">{successMsg}</p>
            </div>
            <button onClick={() => setSuccessMsg("")} className="text-emerald-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 pb-2 space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Activity size={14} />
            <span>अवलोकन (Overview)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("members");
              fetchUsers(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "members"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Users size={14} />
            <span>सदस्य निर्देशिका</span>
            <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
              {memberTotalCount || summary?.users.total || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("quality")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "quality"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <UserCheck size={14} />
            <span>डेटा गुणवत्ता</span>
            {Boolean((summary?.users.unverified || 0) + (summary?.users.missingDesignation || 0)) && (
              <span className="rounded-full bg-amber-950 border border-amber-700 px-1.5 py-0.2 text-[10px] text-amber-400 font-bold">
                {(summary?.users.unverified || 0) + (summary?.users.missingDesignation || 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("designations")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "designations"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Briefcase size={14} />
            <span>पद एवं विभाग</span>
            <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
              {designations.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("complaints");
              fetchComplaints(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "complaints"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FileText size={14} />
            <span>शिकायत निवारण</span>
            <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
              {summary?.complaints.total ?? 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("bot")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "bot"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Bot size={14} />
            <span>स्मार्ट बॉट व FAQ</span>
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "announcements"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Bell size={14} />
            <span>सूचनाएं</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "audit"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ShieldCheck size={14} />
            <span>ऑडिट लॉग्स</span>
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "system"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Database size={14} />
            <span>स्वास्थ्य व बैकअप</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: SYSTEM OVERVIEW / CONTROL CENTER
           ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Filter Bar: Date Range, District, Designation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-orange-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    डैशबोर्ड विश्लेषण फ़िल्टर (Analytics Filters)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setApplyingOverviewFilter(true);
                      const f: Record<string, string> = {};
                      if (overviewStartDate) f.startDate = overviewStartDate;
                      if (overviewEndDate) f.endDate = overviewEndDate;
                      if (overviewDistrict !== "ALL") f.district = overviewDistrict;
                      if (overviewDesignation !== "ALL") f.designation = overviewDesignation;
                      await fetchSummary(f);
                      setApplyingOverviewFilter(false);
                    }}
                    disabled={applyingOverviewFilter}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-orange-500 disabled:opacity-50"
                  >
                    {applyingOverviewFilter ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                    <span>फ़िल्टर लागू करें</span>
                  </button>
                  <button
                    onClick={async () => {
                      setOverviewStartDate("");
                      setOverviewEndDate("");
                      setOverviewDistrict("ALL");
                      setOverviewDesignation("ALL");
                      await fetchSummary();
                    }}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    रीसेट
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">आरंभ तिथि (Start Date)</label>
                  <input
                    type="date"
                    value={overviewStartDate}
                    onChange={(e) => setOverviewStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">अंतिम तिथि (End Date)</label>
                  <input
                    type="date"
                    value={overviewEndDate}
                    onChange={(e) => setOverviewEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">जिला (District)</label>
                  <select
                    value={overviewDistrict}
                    onChange={(e) => setOverviewDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-white focus:border-orange-500"
                  >
                    <option value="ALL">सभी जिले (All Districts)</option>
                    {(hierarchy?.districts || []).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">पदनाम (Designation)</label>
                  <select
                    value={overviewDesignation}
                    onChange={(e) => setOverviewDesignation(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-white focus:border-orange-500"
                  >
                    <option value="ALL">सभी पद (All Designations)</option>
                    {designations.map((des) => (
                      <option key={des._id} value={des.titleHi || des.title}>
                        {des.titleHi ? `${des.titleHi} (${des.title})` : des.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 1: Member Accounts Metrics (Clickable) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div
                onClick={() => {
                  setFilterState((prev) => ({ ...prev, role: "ALL", status: "ALL" }));
                  setActiveTab("members");
                  fetchUsers(1, { role: "ALL", status: "ALL" });
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-orange-500/50 hover:bg-slate-800/40"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">कुल पंजीकृत सदस्य</p>
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">{summary?.users.total ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">क्लिक कर सदस्य सूची देखें &rarr;</p>
              </div>

              <div
                onClick={() => {
                  setFilterState((prev) => ({ ...prev, status: "ACTIVE" }));
                  setActiveTab("members");
                  fetchUsers(1, { status: "ACTIVE" });
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-emerald-500/50 hover:bg-slate-800/40"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">सक्रिय सदस्य (Active)</p>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-emerald-400">{summary?.users.active ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">सक्रिय एवं कार्यरत खाते</p>
              </div>

              <div
                onClick={() => setActiveTab("system")}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-rose-500/50 hover:bg-slate-800/40"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">निष्क्रिय / डिलीटेड</p>
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-rose-400">
                  {(summary?.users.deactivated || 0) + (summary?.users.suspended || 0)}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">रिकवरी केंद्र से पुनर्प्राप्त करें &rarr;</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">आज नए पंजीकरण</p>
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-blue-400">{summary?.users.todayRegistrations ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  चयनित अवधि: {summary?.users.periodRegistrations ?? summary?.users.todayRegistrations ?? 0}
                </p>
              </div>
            </div>

            {/* Row 2: Data Quality & Verification Cards (Clickable to Quality Tab) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div
                onClick={() => setActiveTab("quality")}
                className="cursor-pointer rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 shadow-sm transition hover:border-amber-500 hover:bg-amber-950/40"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">सत्यापन शेष (Unverified)</p>
                  <UserCheck className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-amber-300">{summary?.users.unverified ?? 0}</h3>
                <p className="mt-1 text-[11px] text-amber-400/80">समीक्षा केंद्र खोलें &rarr;</p>
              </div>

              <div
                onClick={() => setActiveTab("quality")}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-blue-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">पद आवंटित नहीं</p>
                  <Briefcase className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-blue-300">{summary?.users.missingDesignation ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">Missing Designation</p>
              </div>

              <div
                onClick={() => setActiveTab("quality")}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-purple-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">अपूर्ण भौगोलिक पता</p>
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-purple-300">{summary?.users.missingLocation ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">Missing District / Ward</p>
              </div>

              <div
                onClick={() => setActiveTab("quality")}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-emerald-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">संपर्क विवरण अपूर्ण</p>
                  <Mail className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-emerald-300">{summary?.users.incompleteContact ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">Missing Email / Contact</p>
              </div>
            </div>

            {/* Row 3: Complaint Operations & Bot Insights (Clickable) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div
                onClick={() => {
                  setComplaintStatusFilter("ALL");
                  setActiveTab("complaints");
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">कुल शिकायतें</p>
                  <FileText className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">{summary?.complaints.total ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  सफलता दर: {summary?.complaints.resolutionRate ?? 0}%
                </p>
              </div>

              <div
                onClick={() => {
                  setComplaintStatusFilter("RESOLVED");
                  setActiveTab("complaints");
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-emerald-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">निस्तारित शिकायतें</p>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-emerald-400">{summary?.complaints.resolved ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">सफलतापूर्वक हल</p>
              </div>

              <div
                onClick={() => {
                  setComplaintStatusFilter("IN_PROGRESS");
                  setActiveTab("complaints");
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-blue-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">प्रक्रियाधीन शिकायतें</p>
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-blue-400">{summary?.complaints.inProgress ?? 0}</h3>
                <p className="mt-1 text-[11px] text-slate-400">वर्तमान में प्रगति पर</p>
              </div>

              <div
                onClick={() => setActiveTab("bot")}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-amber-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">बॉट प्रश्न (अनुत्तरित)</p>
                  <Bot className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="mt-3 text-2xl font-black text-amber-400">
                  {summary?.botStats?.totalQueries ?? 0}{" "}
                  <span className="text-xs font-semibold text-rose-400">
                    ({summary?.botStats?.unansweredCount ?? 0} अनुत्तरित)
                  </span>
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">FAQ बॉट केंद्र खोलें &rarr;</p>
              </div>
            </div>

            {/* Row 4: Demographic Breakdowns (Real Database Aggregates) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Role Distribution */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span>भूमिका अनुसार सदस्य (By Role)</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60">
                    <span className="text-slate-300 font-medium">नागरिक (Citizen)</span>
                    <span className="font-bold text-white">{summary?.users.citizens ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60">
                    <span className="text-slate-300 font-medium">बूथ कार्यकर्ता (Booth Worker)</span>
                    <span className="font-bold text-white">{summary?.users.boothWorkers ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60">
                    <span className="text-slate-300 font-medium">कार्यालय स्टाफ (PA / Staff)</span>
                    <span className="font-bold text-white">{summary?.users.staff ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60">
                    <span className="text-slate-300 font-medium">जनप्रतिनिधि (Politicians)</span>
                    <span className="font-bold text-white">{summary?.users.politicians ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60">
                    <span className="text-slate-300 font-medium">मुख्य व्यवस्थापक (Super Admin)</span>
                    <span className="font-bold text-white">{summary?.users.superAdmins ?? 1}</span>
                  </div>
                </div>
              </div>

              {/* Area & Top Districts Breakdown */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>भौगोलिक वितरण (Geographical Distribution)</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-800/60 rounded-xl text-center">
                      <p className="text-[11px] text-slate-400">ग्रामीण (Rural)</p>
                      <p className="text-lg font-black text-white mt-0.5">{summary?.distribution?.byArea?.rural ?? 0}</p>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-xl text-center">
                      <p className="text-[11px] text-slate-400">शहरी (Urban)</p>
                      <p className="text-lg font-black text-white mt-0.5">{summary?.distribution?.byArea?.urban ?? 0}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">शीर्ष जिले (Top Districts)</p>
                    {(summary?.distribution?.byDistrict || []).length > 0 ? (
                      summary?.distribution?.byDistrict.map((d, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-slate-800/40 text-[11px]">
                          <span className="text-slate-300">{d.district}</span>
                          <span className="font-bold text-orange-400">{d.count} सदस्य</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500">कोई डेटा उपलब्ध नहीं।</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Designations Breakdown */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>शीर्ष पदनाम (Top Designations)</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {(summary?.distribution?.byDesignation || []).length > 0 ? (
                    summary?.distribution?.byDesignation.map((d, i) => (
                      <div key={i} className="flex justify-between p-2.5 bg-slate-800/60 rounded-xl text-[11px]">
                        <span className="font-semibold text-slate-200 truncate max-w-[70%]">{d.title}</span>
                        <span className="font-bold text-emerald-400">{d.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-slate-500">कोई पदनाम आवंटन नहीं।</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="flex items-center text-sm font-bold text-white">
                    <Users className="mr-2 h-4 w-4 text-orange-400" />
                    हालिया सदस्य (Recent Members)
                  </h3>
                  <button onClick={() => setActiveTab("members")} className="text-xs font-bold text-orange-400 hover:underline">
                    सभी देखें &rarr;
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {summary?.recentMembers && summary.recentMembers.length > 0 ? (
                    summary.recentMembers.map((m) => (
                      <div key={m._id} className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs">
                        <div>
                          <p className="font-bold text-white">{m.fullName}</p>
                          <p className="font-mono text-[11px] text-slate-400">+91 {m.mobileNumber}</p>
                        </div>
                        <div className="text-right">
                          <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                            {m.role}
                          </span>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {new Date(m.createdAt).toLocaleDateString("hi-IN")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-slate-500">कोई हालिया पंजीकरण नहीं।</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="flex items-center text-sm font-bold text-white">
                    <FileText className="mr-2 h-4 w-4 text-blue-400" />
                    हालिया शिकायतें (Recent Complaints)
                  </h3>
                  <button onClick={() => setActiveTab("complaints")} className="text-xs font-bold text-blue-400 hover:underline">
                    सभी देखें &rarr;
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {summary?.recentComplaints && summary.recentComplaints.length > 0 ? (
                    summary.recentComplaints.map((c) => (
                      <div key={c._id} className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-orange-400">{c.trackingId}</span>
                          <p className="font-bold text-white line-clamp-1">{c.subject}</p>
                          <p className="text-[10px] text-slate-400">{c.citizenId?.fullName || "नागरिक"}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              c.status === "RESOLVED"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : c.status === "REJECTED"
                                ? "bg-rose-950 text-rose-400 border border-rose-800"
                                : "bg-blue-950 text-blue-400 border border-blue-800"
                            }`}
                          >
                            {c.status}
                          </span>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {new Date(c.createdAt).toLocaleDateString("hi-IN")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-slate-500">कोई हालिया शिकायत नहीं।</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: MEMBER MANAGEMENT DIRECTORY
           ======================================================== */}
        {activeTab === "members" && (
          <div className="space-y-4">
            {/* Hierarchical Cascading Filter System */}
            <HierarchicalFilters
              filters={filterState}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              hierarchy={hierarchy}
              designations={designations}
              departments={departments}
              totalMatches={memberTotalCount}
              loading={loadingUsers}
            />

            {/* Actions Bar: Bulk Operations, Export Dropdown, Import, Add User */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-medium">
                  चयनित: <strong className="text-white">{selectedUserIds.length}</strong> सदस्य
                </span>
                {selectedUserIds.length > 0 && (
                  <button
                    onClick={() => setSelectedUserIds([])}
                    className="text-[11px] text-red-400 hover:underline ml-2"
                  >
                    चयन हटाएं
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Export Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>डेटा निर्यात (Export)</span>
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                  </button>

                  {exportDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl p-1.5 z-30 text-xs font-medium space-y-1">
                      <button
                        onClick={() => handleExport("FILTERED", "xlsx")}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-200"
                      >
                        फ़िल्टर किए गए सदस्य (.xlsx)
                      </button>
                      <button
                        onClick={() => handleExport("FILTERED", "csv")}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-200"
                      >
                        फ़िल्टर किए गए सदस्य (.csv)
                      </button>
                      {selectedUserIds.length > 0 && (
                        <button
                          onClick={() => handleExport("SELECTED", "xlsx")}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 text-orange-400 font-bold"
                        >
                          केवल चयनित ({selectedUserIds.length}) सदस्य (.xlsx)
                        </button>
                      )}
                      <div className="border-t border-slate-700 my-1"></div>
                      <button
                        onClick={() => handleExport("ALL", "xlsx")}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-300 text-[11px]"
                      >
                        संपूर्ण डेटाबेस निर्यात (.xlsx)
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setImportModalOpen(true)}
                  className="inline-flex items-center rounded-xl border border-emerald-700/60 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900/60"
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                  एक्सेल आयात
                </button>

                <button
                  onClick={() => {
                    setEditingUserTarget(null);
                    setUserModalMode("CREATE");
                    setUserModalOpen(true);
                  }}
                  className="inline-flex items-center rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-500"
                >
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  नया सदस्य बनाएं
                </button>
              </div>
            </div>

            {/* Table Sorting & Density Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-semibold text-slate-400">क्रमबद्ध (Sort by):</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      const newSort = e.target.value;
                      setSortBy(newSort);
                      fetchUsers(1, undefined, pageSize, newSort, sortOrder);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="createdAt">पंजीकरण दिनांक (Created At)</option>
                    <option value="fullName">नाम (Full Name)</option>
                    <option value="mobileNumber">मोबाइल नंबर (Mobile)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-semibold text-slate-400">दिशा (Order):</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      const newOrder = e.target.value as "asc" | "desc";
                      setSortOrder(newOrder);
                      fetchUsers(1, undefined, pageSize, sortBy, newOrder);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="desc">अवरोही / नवीनतम प्रथम (Desc)</option>
                    <option value="asc">आरोही / वर्णमाला (Asc)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-semibold text-slate-400">प्रति पृष्ठ (Limit):</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setPageSize(newSize);
                      fetchUsers(1, undefined, newSize, sortBy, sortOrder);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value={10}>10 सदस्य</option>
                    <option value={25}>25 सदस्य</option>
                    <option value={50}>50 सदस्य</option>
                    <option value={100}>100 सदस्य</option>
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                कुल परिणाम: <strong className="text-white">{memberTotalCount}</strong> सदस्य
              </div>
            </div>

            {/* Users Table / Desktop View */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl overflow-x-auto">
              {loadingUsers ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-orange-500" />
                  <p className="mt-2 font-medium">सदस्य सूची लोड हो रही है...</p>
                </div>
              ) : usersList.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <Users className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="font-semibold text-slate-300">कोई सदस्य रिकॉर्ड उपलब्ध नहीं है।</p>
                  <p className="text-[11px] text-slate-500">फ़िल्टर बदलकर पुनः प्रयास करें।</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={allOnPageSelected}
                          onChange={toggleSelectAllOnPage}
                          className="rounded text-orange-600 focus:ring-0"
                          title="इस पृष्ठ के सभी सदस्य चुनें"
                        />
                      </th>
                      <th className="py-3 px-3">सदस्य विवरण</th>
                      <th className="py-3 px-3">पदनाम एवं विभाग</th>
                      <th className="py-3 px-3">भौगोलिक स्थान</th>
                      <th className="py-3 px-3 text-center">भूमिका</th>
                      <th className="py-3 px-3 text-center">सत्यापन स्थिति</th>
                      <th className="py-3 px-3 text-center">खाता स्थिति</th>
                      <th className="py-3 px-3 text-right">कार्यवाही</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList.map((u) => {
                      const isSelected = selectedUserIds.includes(u._id);
                      return (
                        <tr
                          key={u._id}
                          className={`transition ${
                            isSelected ? "bg-orange-950/20" : "hover:bg-slate-800/40"
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectUser(u._id)}
                              className="rounded text-orange-600 focus:ring-0"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-white text-sm">{u.fullName}</div>
                            <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>+91 {u.mobileNumber}</span>
                            </div>
                            {u.voterId && (
                              <div className="text-[10px] text-slate-500 font-mono">EPIC: {u.voterId}</div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {u.designation ? (
                              <div>
                                <span className="font-bold text-orange-400 text-xs block">{u.designation}</span>
                                {u.designationCategory && (
                                  <span className="text-[10px] text-slate-400 block">{u.designationCategory}</span>
                                )}
                                {u.department && (
                                  <span className="text-[10px] text-slate-500 block truncate max-w-xs">{u.department}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">पद अनिर्दिष्ट</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-slate-300 font-medium">
                              {u.district || "—"}
                              {u.assemblyConstituency ? ` | ${u.assemblyConstituency}` : ""}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {u.areaType === "RURAL"
                                ? [u.developmentBlock, u.gramPanchayat, u.village].filter(Boolean).join(" • ") || "ग्रामीण"
                                : [u.localBody, u.wardNumber ? `वार्ड ${u.wardNumber}` : ""].filter(Boolean).join(" • ") || "शहरी"}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
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
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => {
                                setVerifyUserTarget(u);
                                setVerifyModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 group"
                              title="सत्यापन स्थिति बदलें"
                            >
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                  u.verificationStatus === "VERIFIED"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800 group-hover:border-emerald-500"
                                    : u.verificationStatus === "FLAGGED"
                                    ? "bg-amber-950 text-amber-400 border border-amber-800 group-hover:border-amber-500"
                                    : u.verificationStatus === "REJECTED"
                                    ? "bg-rose-950 text-rose-400 border border-rose-800 group-hover:border-rose-500"
                                    : "bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-slate-500"
                                }`}
                              >
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {u.verificationStatus || "UNVERIFIED"}
                              </span>
                            </button>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleStatusToggle(u._id, u.accountStatus || "ACTIVE")}
                              title="स्थिति बदलें"
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                u.accountStatus === "ACTIVE"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                  : u.accountStatus === "SUSPENDED"
                                  ? "bg-amber-950 text-amber-400 border border-amber-800"
                                  : "bg-rose-950 text-rose-400 border border-rose-800"
                              }`}
                            >
                              {u.accountStatus || "ACTIVE"}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setViewUserModal(true);
                                }}
                                title="विवरण देखें"
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUserTarget(u);
                                  setUserModalMode("EDIT");
                                  setUserModalOpen(true);
                                }}
                                title="संपादित करें"
                                className="rounded-lg p-1.5 text-blue-400 hover:bg-slate-800 hover:text-blue-300"
                              >
                                <Edit size={14} />
                              </button>
                              {u.role !== "SUPER_ADMIN" && (
                                <button
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setHardDeleteOption(false);
                                    setDeleteUserModal(true);
                                  }}
                                  title="हटाएं / निष्क्रिय करें"
                                  className="rounded-lg p-1.5 text-rose-400 hover:bg-slate-800 hover:text-rose-300"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Pagination Controls */}
              {memberTotalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                  <p>
                    पृष्ठ <span className="font-bold text-white">{memberPage}</span> / {memberTotalPages} (कुल {memberTotalCount} सदस्य)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={memberPage <= 1}
                      onClick={() => fetchUsers(memberPage - 1)}
                      className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-bold text-white hover:bg-slate-700 disabled:opacity-40"
                    >
                      <ChevronLeft size={14} className="mr-1" /> पूर्व
                    </button>
                    <button
                      disabled={memberPage >= memberTotalPages}
                      onClick={() => fetchUsers(memberPage + 1)}
                      className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-bold text-white hover:bg-slate-700 disabled:opacity-40"
                    >
                      अगला <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: DATA QUALITY CENTER
           ======================================================== */}
        {activeTab === "quality" && (
          <DataQualityTab
            onEditUser={(u) => {
              setEditingUserTarget(u);
              setUserModalMode("EDIT");
              setUserModalOpen(true);
            }}
            onVerifyUser={(u) => {
              setVerifyUserTarget(u);
              setVerifyModalOpen(true);
            }}
          />
        )}

        {/* ========================================================
            TAB 3: DESIGNATION & DEPARTMENT MANAGEMENT (MASTER DATA)
           ======================================================== */}
        {activeTab === "designations" && (
          <DesignationManagementTab
            designations={designations}
            departments={departments}
            onRefresh={fetchMasterData}
          />
        )}

        {/* ========================================================
            TAB 4: COMPLAINT MANAGEMENT
           ======================================================== */}
        {activeTab === "complaints" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center text-lg font-bold text-white">
                  <FileText className="mr-2 h-5 w-5 text-orange-500" />
                  शिकायत निवारण प्रणाली (Grievance Redressal System)
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  नागरिकों द्वारा दर्ज शिकायतों का अवलोकन, प्रगति समयरेखा एवं स्थिति अद्यतन
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="text"
                  placeholder="ट्रैकिंग आईडी, विषय या नागरिक नाम द्वारा खोजें..."
                  value={complaintSearch}
                  onChange={(e) => setComplaintSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchComplaints(1);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <select
                  value={complaintStatusFilter}
                  onChange={(e) => setComplaintStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="ALL">सभी स्थितियां (All Status)</option>
                  <option value="SUBMITTED">प्रस्तुत (SUBMITTED)</option>
                  <option value="UNDER_REVIEW">समीक्षाधीन (UNDER_REVIEW)</option>
                  <option value="IN_PROGRESS">प्रक्रियाधीन (IN_PROGRESS)</option>
                  <option value="RESOLVED">निस्तारित (RESOLVED)</option>
                  <option value="REJECTED">अस्वीकृत (REJECTED)</option>
                </select>
              </div>

              <div>
                <select
                  value={complaintPriorityFilter}
                  onChange={(e) => setComplaintPriorityFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="ALL">सभी प्राथमिकताएं</option>
                  <option value="URGENT">अति-आवश्यक (URGENT)</option>
                  <option value="HIGH">उच्च (HIGH)</option>
                  <option value="MEDIUM">मध्यम (MEDIUM)</option>
                  <option value="LOW">सामान्य (LOW)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loadingComplaints ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
                  <p className="mt-2">शिकायत सूची लोड हो रही है...</p>
                </div>
              ) : complaintsList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  कोई शिकायत रिकॉर्ड उपलब्ध नहीं है।
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">ट्रैकिंग आईडी / दिनांक</th>
                      <th className="py-3 px-3">नागरिक / मोबाइल</th>
                      <th className="py-3 px-3">विषय / श्रेणी</th>
                      <th className="py-3 px-3">प्राथमिकता</th>
                      <th className="py-3 px-3">स्थिति (Status)</th>
                      <th className="py-3 px-3 text-right">कार्यवाही</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {complaintsList.map((c) => (
                      <tr key={c._id} className="transition hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <span className="font-mono text-xs font-bold text-orange-400">{c.trackingId}</span>
                          <p className="text-[10px] text-slate-500">
                            {new Date(c.createdAt).toLocaleDateString("hi-IN")}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-white">{c.citizenId?.fullName || "नागरिक"}</p>
                          <p className="font-mono text-[10px] text-slate-400">
                            +91 {c.citizenId?.mobileNumber || "—"}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-white line-clamp-1">{c.subject}</p>
                          <span className="inline-block rounded-xs bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                              c.priority === "URGENT"
                                ? "bg-rose-950 text-rose-300 border border-rose-800"
                                : c.priority === "HIGH"
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              c.status === "RESOLVED"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : c.status === "REJECTED"
                                ? "bg-rose-950 text-rose-400 border border-rose-800"
                                : "bg-blue-950 text-blue-400 border border-blue-800"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => openComplaintModal(c)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-slate-700"
                          >
                            <Edit size={12} className="text-orange-400" />
                            अद्यतन / स्थिति
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {complaintTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                <p>
                  पृष्ठ <span className="font-bold text-white">{complaintPage}</span> / {complaintTotalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={complaintPage <= 1}
                    onClick={() => fetchComplaints(complaintPage - 1)}
                    className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-bold text-white hover:bg-slate-700 disabled:opacity-40"
                  >
                    <ChevronLeft size={14} className="mr-1" /> पूर्व
                  </button>
                  <button
                    disabled={complaintPage >= complaintTotalPages}
                    onClick={() => fetchComplaints(complaintPage + 1)}
                    className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-bold text-white hover:bg-slate-700 disabled:opacity-40"
                  >
                    अगला <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: SMART FAQ BOT MANAGEMENT
           ======================================================== */}
        {activeTab === "bot" && (
          <FaqManagementTab />
        )}

        {/* ========================================================
            TAB 7: ANNOUNCEMENTS MANAGEMENT
           ======================================================== */}
        {activeTab === "announcements" && (
          <AnnouncementsTab />
        )}

        {/* ========================================================
            TAB 8: AUDIT LOGS
           ======================================================== */}
        {activeTab === "audit" && (
          <AuditLogsTab />
        )}

        {/* ========================================================
            TAB 9: SYSTEM HEALTH, RECOVERY & SECURITY GUARDRAILS
           ======================================================== */}
        {(activeTab === "system" || (activeTab as string) === "security") && (
          <div className="space-y-6">
            <SystemHealthTab />

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
        )}
      </div>

      {/* ========================================================
          MODALS INTEGRATION
         ======================================================== */}

      {/* 1. UPGRADED 4-TAB USER FORM MODAL (ADD & EDIT) */}
      <UserFormModal
        isOpen={userModalOpen}
        mode={userModalMode}
        initialUser={editingUserTarget}
        hierarchy={hierarchy}
        designations={designations}
        departments={departments}
        onClose={() => setUserModalOpen(false)}
        onSuccess={(savedUser) => {
          setSuccessMsg(
            userModalMode === "CREATE"
              ? `नया सदस्य [${savedUser.fullName}] सफलतापूर्वक बनाया गया।`
              : `सदस्य [${savedUser.fullName}] की प्रोफ़ाइल अद्यतित की गई।`
          );
          fetchUsers(memberPage);
          fetchSummary();
        }}
      />

      {/* 2. QUICK VERIFICATION MODAL */}
      <VerifyUserModal
        isOpen={verifyModalOpen}
        user={verifyUserTarget}
        onClose={() => setVerifyModalOpen(false)}
        onSuccess={(updatedUser) => {
          setSuccessMsg(`सदस्य [${updatedUser.fullName}] का सत्यापन स्तर [${updatedUser.verificationStatus}] अद्यतित हुआ।`);
          fetchUsers(memberPage);
        }}
      />

      {/* 3. FLEXIBLE 4-MODE EXCEL IMPORT MODAL */}
      <FlexibleImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={(summaryResult) => {
          setSuccessMsg(
            `एक्सेल आयात संपन्न: ${summaryResult.createdCount} नए सदस्य पंजीकृत, ${summaryResult.updatedCount} अपडेट, ${summaryResult.skippedCount} छोड़े गए।`
          );
          fetchUsers(1);
          fetchSummary();
        }}
      />

      {/* 4. VIEW USER MODAL */}
      {viewUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">सदस्य संपूर्ण विवरण (Member Profile)</h3>
              </div>
              <button
                onClick={() => setViewUserModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-slate-800/60 p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedUser.fullName}</h4>
                  <p className="text-orange-400 font-semibold">{selectedUser.designation || "पद अनिर्दिष्ट"}</p>
                </div>
                <span className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-300">
                  {selectedUser.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-slate-500 font-medium">मोबाइल नंबर:</span>
                  <p className="font-mono font-bold text-white mt-0.5">+91 {selectedUser.mobileNumber}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-slate-500 font-medium">सत्यापन स्थिति:</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{selectedUser.verificationStatus || "UNVERIFIED"}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-slate-500 font-medium">ईमेल:</span>
                  <p className="font-medium text-white mt-0.5">{selectedUser.email || "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-slate-500 font-medium">खाता स्थिति:</span>
                  <p className="font-bold mt-0.5 text-emerald-400">{selectedUser.accountStatus || "ACTIVE"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
                <span className="text-slate-500 font-medium">भौगोलिक विवरण:</span>
                <p className="text-slate-200">
                  <span className="text-slate-400">ज़िला:</span> {selectedUser.district || "—"} |{" "}
                  <span className="text-slate-400">क्षेत्र:</span> {selectedUser.areaType || "—"}
                </p>
                <p className="text-slate-200">
                  <span className="text-slate-400">ब्लॉक/निकाय:</span> {selectedUser.developmentBlock || selectedUser.localBody || "—"} |{" "}
                  <span className="text-slate-400">पंचायत/वार्ड:</span> {selectedUser.gramPanchayat || selectedUser.wardNumber || "—"}
                </p>
                <p className="text-slate-200">
                  <span className="text-slate-400">विधानसभा:</span> {selectedUser.assemblyConstituency || "—"}
                </p>
                {selectedUser.address && (
                  <p className="text-slate-200">
                    <span className="text-slate-400">निवास:</span> {selectedUser.address}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setViewUserModal(false);
                    setEditingUserTarget(selectedUser);
                    setUserModalMode("EDIT");
                    setUserModalOpen(true);
                  }}
                  className="rounded-xl bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-500"
                >
                  संपादित करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {deleteUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-white">खाता हटाने / निष्क्रिय करने की पुष्टि</h3>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              क्या आप वाकई <strong className="text-white">{selectedUser.fullName}</strong> (+91 {selectedUser.mobileNumber}) का खाता हटाना चाहते हैं?
            </p>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-800/50 p-3 text-xs space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hardDeleteOption}
                  onChange={(e) => setHardDeleteOption(e.target.checked)}
                  className="mt-0.5 rounded-sm text-rose-600 focus:ring-0"
                />
                <span className="text-slate-300">
                  स्थायी विलोपन (Hard Delete) का प्रयास करें (यदि कोई शिकायत इतिहास नहीं है)।
                </span>
              </label>
              <p className="text-[11px] text-slate-500">
                नोट: यदि इस सदस्य के साथ शिकायतें जुड़ी हैं, तो डेटा ऑडिट सुरक्षा के तहत खाता स्वतः सुरक्षित रूप से केवल निष्क्रिय (DEACTIVATED) किया जाएगा।
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteUserModal(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                रद्द करें
              </button>
              <button
                type="button"
                disabled={deletingUser}
                onClick={handleDeleteUser}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-60"
              >
                {deletingUser ? <Loader2 size={14} className="animate-spin" /> : null}
                हटाएं / निष्क्रिय करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPLAINT DETAILS & UPDATE MODAL */}
      {showComplaintModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-orange-400">
                  {selectedComplaint.trackingId}
                </span>
                <h3 className="text-base font-bold text-white line-clamp-1">{selectedComplaint.subject}</h3>
              </div>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-800/50 p-3">
                <span className="text-slate-500 font-medium">नागरिक:</span>
                <p className="font-bold text-white">{selectedComplaint.citizenId?.fullName || "नागरिक"}</p>
                <p className="font-mono text-slate-400">+91 {selectedComplaint.citizenId?.mobileNumber || "—"}</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 p-3">
                <span className="text-slate-500 font-medium">श्रेणी / प्राथमिकता:</span>
                <p className="font-bold text-white">{selectedComplaint.category}</p>
                <span className="font-extrabold text-orange-400">{selectedComplaint.priority}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-3 text-xs">
              <span className="text-slate-500 font-medium">शिकायत का विवरण:</span>
              <p className="mt-1 text-slate-200 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2">प्रगति समयरेखा (Progress Timeline)</h4>
              <div className="max-h-40 overflow-y-auto space-y-2 rounded-xl border border-slate-800 p-3 bg-slate-950/50 text-xs">
                {complaintTimeline.length === 0 ? (
                  <p className="text-slate-500 text-center py-2">अभी कोई प्रगति टिप्पणी दर्ज नहीं है।</p>
                ) : (
                  complaintTimeline.map((item) => (
                    <div key={item._id} className="border-b border-slate-800/60 pb-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-white">
                          {item.authorId?.fullName || "स्टाफ"} ({item.authorRole})
                        </span>
                        <span>{new Date(item.createdAt).toLocaleString("hi-IN")}</span>
                      </div>
                      <p className="mt-1 text-slate-200">{item.updateText}</p>
                      {item.statusAfter && item.statusBefore !== item.statusAfter && (
                        <span className="inline-block mt-1 text-[10px] text-orange-400 font-mono">
                          स्थिति: {item.statusBefore} &rarr; {item.statusAfter}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateComplaintStatus} className="border-t border-slate-800 pt-4 space-y-3 text-xs">
              <h4 className="font-bold text-white">स्थिति अद्यतित करें / टिप्पणी जोड़ें</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">नई स्थिति (New Status)</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                  >
                    <option value="SUBMITTED">प्रस्तुत (SUBMITTED)</option>
                    <option value="UNDER_REVIEW">समीक्षाधीन (UNDER_REVIEW)</option>
                    <option value="ASSIGNED">आवंटित (ASSIGNED)</option>
                    <option value="IN_PROGRESS">प्रक्रियाधीन (IN_PROGRESS)</option>
                    <option value="WAITING_FOR_INFORMATION">अतिरिक्त जानकारी प्रतीक्षित</option>
                    <option value="RESOLVED">निस्तारित (RESOLVED)</option>
                    <option value="REJECTED">अस्वीकृत (REJECTED)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded-sm text-orange-600"
                    />
                    <span>आंतरिक नोट (नागरिक से छिपाएं)</span>
                  </label>
                </div>
              </div>

              {newStatus === "REJECTED" && (
                <div className="rounded-xl border border-rose-800 bg-rose-950/40 p-3">
                  <label className="mb-1 block font-bold text-rose-300">
                    अस्वीकृति का कारण (Mandatory Rejection Reason) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. अधिकार क्षेत्र से बाहर अथवा अपर्याप्त विवरण"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full rounded-lg border border-rose-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block font-bold text-slate-300">
                  प्रगति टिप्पणी / समाधान विवरण (Update Details) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="अद्यतन विवरण लिखें..."
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 font-bold text-slate-300 hover:bg-slate-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submittingUpdate}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-500 disabled:opacity-60"
                >
                  {submittingUpdate ? <Loader2 size={13} className="animate-spin" /> : null}
                  स्थिति अद्यतित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
