"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  UserCheck
} from "lucide-react";
import {
  reportsApi,
  usersApi,
  complaintsApi,
  DashboardSummary,
  UserProfile,
  ComplaintItem,
  ComplaintUpdateItem
} from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth-context";

interface ValidatedImportRow {
  rowNumber: number;
  fullName: string;
  mobileNumber: string;
  rawMobile?: string;
  role: string;
  isValid: boolean;
  isDuplicateInFile: boolean;
  duplicateOfRow?: number | null;
  isExistingInDb: boolean;
  existingRecord?: { fullName: string; role: string; accountStatus: string };
  errors: string[];
}

interface ImportPreviewResult {
  headers: string[];
  detectedMapping: { nameColumn: string; phoneColumn: string };
  totalRows: number;
  validRows: number;
  duplicateInFileRows: number;
  existingInDbRows: number;
  invalidRows: number;
  preview: ValidatedImportRow[];
  rows: ValidatedImportRow[];
  errors: Array<{ rowNumber: number; name?: string; mobile?: string; reason: string }>;
}

export default function SuperAdminDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth(["SUPER_ADMIN"]);
  const { logout } = useAuth();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "complaints" | "security">("overview");

  // Summary & Stats
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ========================================================
  // MEMBER MANAGEMENT STATE
  // ========================================================
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotalPages, setMemberTotalPages] = useState(1);
  const [memberTotalCount, setMemberTotalCount] = useState(0);

  // View / Edit / Delete Member Modals
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [viewUserModal, setViewUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [hardDeleteOption, setHardDeleteOption] = useState(false);

  // Edit User Form
  const [editFullName, setEditFullName] = useState("");
  const [editRole, setEditRole] = useState<"SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN">("CITIZEN");
  const [editEmail, setEditEmail] = useState("");
  const [editAlternateMobile, setEditAlternateMobile] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editVoterId, setEditVoterId] = useState("");
  const [editWardNumber, setEditWardNumber] = useState("");
  const [editBoothNumber, setEditBoothNumber] = useState("");
  const [editAssemblyConstituency, setEditAssemblyConstituency] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "SUSPENDED" | "DEACTIVATED">("ACTIVE");
  const [savingUser, setSavingUser] = useState(false);

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN">("PA_STAFF");
  const [newDesignation, setNewDesignation] = useState("");
  const [newVoterId, setNewVoterId] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newConstituency, setNewConstituency] = useState("");
  const [newWard, setNewWard] = useState("");
  const [newBooth, setNewBooth] = useState("");
  const [submittingUser, setSubmittingUser] = useState(false);

  // Excel Import Modal (Dedicated 2-Column Name + Phone Number Import)
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importingPreview, setImportingPreview] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<ImportPreviewResult | null>(null);
  const [nameColumnMapping, setNameColumnMapping] = useState<string>("");
  const [phoneColumnMapping, setPhoneColumnMapping] = useState<string>("");
  const [skipExistingOnImport, setSkipExistingOnImport] = useState(true);
  const [confirmingImport, setConfirmingImport] = useState(false);
  const [downloadingErrorReport, setDownloadingErrorReport] = useState(false);
  const [importResultSummary, setImportResultSummary] = useState<{
    totalProcessed: number;
    createdCount: number;
    skippedCount: number;
    failedCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const fetchUsers = useCallback(async (page = 1) => {
    setLoadingUsers(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "15"
      };
      if (userRoleFilter && userRoleFilter !== "ALL") params.role = userRoleFilter;
      if (userStatusFilter && userStatusFilter !== "ALL") params.status = userStatusFilter;
      if (userSearch.trim()) params.search = userSearch.trim();

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
  }, [userRoleFilter, userStatusFilter, userSearch]);

  const fetchComplaints = useCallback(async (page = 1) => {
    setLoadingComplaints(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "15"
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
  }, [complaintStatusFilter, complaintPriorityFilter, complaintSearch]);

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
      fetchUsers(memberPage),
      fetchComplaints(complaintPage),
      checkHealth()
    ]);
    setRefreshing(false);
    setLoadingData(false);
  }, [fetchSummary, fetchUsers, fetchComplaints, checkHealth, memberPage, complaintPage]);

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      refreshAll();
    }
  }, [user, refreshAll]);

  // ========================================================
  // MEMBER ACTIONS
  // ========================================================
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

  const openEditModal = (u: UserProfile) => {
    setSelectedUser(u);
    setEditFullName(u.fullName || "");
    setEditRole((u.role as "SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN") || "CITIZEN");
    setEditEmail(u.email || "");
    setEditAlternateMobile(u.alternateMobile || "");
    setEditDesignation(u.designation || "");
    setEditVoterId(u.voterId || "");
    setEditWardNumber(u.wardNumber || "");
    setEditBoothNumber(u.boothNumber || "");
    setEditAssemblyConstituency(u.assemblyConstituency || "");
    setEditDistrict(u.district || "");
    setEditStatus(u.accountStatus || "ACTIVE");
    setEditUserModal(true);
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSavingUser(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await usersApi.update(selectedUser._id, {
        fullName: editFullName.trim(),
        role: editRole,
        email: editEmail.trim() || undefined,
        alternateMobile: editAlternateMobile.trim() || undefined,
        designation: editDesignation.trim() || undefined,
        voterId: editVoterId.trim() || undefined,
        wardNumber: editWardNumber.trim() || undefined,
        boothNumber: editBoothNumber.trim() || undefined,
        assemblyConstituency: editAssemblyConstituency.trim() || undefined,
        district: editDistrict.trim() || undefined,
        accountStatus: editStatus,
      });

      if (res.success) {
        setSuccessMsg(`सदस्य विवरण एवं भूमिका (${editRole}) सफलतापूर्वक अद्यतित की गई।`);
        setEditUserModal(false);
        fetchUsers(memberPage);
        fetchSummary();
      } else {
        setErrorMsg(res.message || "विवरण अद्यतन में त्रुटि।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeletingUser(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await usersApi.delete(selectedUser._id, hardDeleteOption);
      if (res.success) {
        if (res.data?.softDeactivated) {
          setSuccessMsg(res.data.retentionNotice || "डेटा सुरक्षा नीति के तहत खाता निष्क्रिय कर दिया गया है।");
        } else {
          setSuccessMsg("उपयोगकर्ता खाता सफलतापूर्वक हटा दिया गया।");
        }
        setDeleteUserModal(false);
        setSelectedUser(null);
        fetchUsers(memberPage);
        fetchSummary();
      } else {
        setErrorMsg(res.message || "खाता हटाने में त्रुटि।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setDeletingUser(false);
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
        designation: newDesignation.trim() || undefined,
        voterId: newVoterId.trim() || undefined,
        district: newDistrict.trim() || undefined,
        assemblyConstituency: newConstituency.trim() || undefined,
        wardNumber: newWard.trim() || undefined,
        boothNumber: newBooth.trim() || undefined,
      });

      if (res.success) {
        setSuccessMsg(`नया खाता (${newRole}) सफलतापूर्वक निर्मित किया गया।`);
        setShowCreateModal(false);
        setNewFullName("");
        setNewMobile("");
        setNewPassword("");
        setNewDesignation("");
        setNewVoterId("");
        setNewDistrict("");
        setNewConstituency("");
        setNewWard("");
        setNewBooth("");
        fetchUsers(memberPage);
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

  // ========================================================
  // EXCEL IMPORT & EXPORT
  // ========================================================
  const handleExportMembers = async () => {
    try {
      const params: Record<string, string> = {};
      if (userRoleFilter !== "ALL") params.role = userRoleFilter;
      if (userStatusFilter !== "ALL") params.status = userStatusFilter;
      if (userSearch.trim()) params.search = userSearch.trim();
      await usersApi.downloadExport(params, `JanConnect_Members_${Date.now()}.xlsx`);
      setSuccessMsg("सदस्य डेटा एक्सेल फाइल सफलतापूर्वक डाउनलोड हो गई।");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "एक्सेल डाउनलोड विफल रहा।");
    }
  };

  const handleExportComplaints = async () => {
    try {
      const params: Record<string, string> = {};
      if (complaintStatusFilter !== "ALL") params.status = complaintStatusFilter;
      if (complaintPriorityFilter !== "ALL") params.priority = complaintPriorityFilter;
      if (complaintSearch.trim()) params.search = complaintSearch.trim();
      await complaintsApi.downloadExport(params, `JanConnect_Complaints_${Date.now()}.xlsx`);
      setSuccessMsg("शिकायत डेटा एक्सेल फाइल सफलतापूर्वक डाउनलोड हो गई।");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "शिकायत एक्सेल डाउनलोड विफल रहा।");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await usersApi.downloadTemplate();
      setSuccessMsg("एक्सेल इम्पोर्ट टेम्पलेट डाउनलोड हो गया।");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "टेम्पलेट डाउनलोड विफल रहा।");
    }
  };

  const runPreviewAnalysis = async (file: File, customName?: string, customPhone?: string) => {
    setImportingPreview(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (customName) formData.append("nameColumn", customName);
      if (customPhone) formData.append("phoneColumn", customPhone);

      const res = await usersApi.previewImport(formData);
      if (res.success && res.data) {
        setImportPreviewData(res.data);
        if (res.data.detectedMapping) {
          setNameColumnMapping(res.data.detectedMapping.nameColumn || "");
          setPhoneColumnMapping(res.data.detectedMapping.phoneColumn || "");
        }
      } else {
        setErrorMsg(res.message || "फाइल पूर्वावलोकन में त्रुटि हुई।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "फाइल पढ़ने में त्रुटि।");
    } finally {
      setImportingPreview(false);
    }
  };

  const handleFileSelectForPreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportPreviewData(null);
    setImportResultSummary(null);
    setErrorMsg("");
    await runPreviewAnalysis(file);
  };

  const handleApplyCustomMapping = async () => {
    if (!importFile) return;
    await runPreviewAnalysis(importFile, nameColumnMapping, phoneColumnMapping);
  };

  const handleConfirmImport = async () => {
    if (!importPreviewData?.rows || importPreviewData.rows.length === 0) return;
    setConfirmingImport(true);
    setErrorMsg("");
    try {
      const res = await usersApi.confirmImport({
        rows: importPreviewData.rows,
        skipExisting: skipExistingOnImport,
      });

      if (res.success && res.data) {
        setImportResultSummary({
          totalProcessed: res.data.totalProcessed,
          createdCount: res.data.createdCount,
          skippedCount: res.data.skippedCount,
          failedCount: res.data.failedCount,
        });
        setSuccessMsg(
          `इम्पोर्ट पूर्ण: ${res.data.createdCount} नए नागरिक सदस्य जोड़े गए, ${res.data.skippedCount} छोड़े गए।`
        );
        fetchUsers(1);
        fetchSummary();
      } else {
        setErrorMsg(res.message || "डेटा आयात विफल रहा।");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "सर्वर त्रुटि।");
    } finally {
      setConfirmingImport(false);
    }
  };

  const handleDownloadErrorReport = async () => {
    if (!importPreviewData?.errors || importPreviewData.errors.length === 0) {
      setErrorMsg("डाउनलोड करने के लिए कोई त्रुटि या छोड़ी गई प्रविष्टि नहीं है।");
      return;
    }
    setDownloadingErrorReport(true);
    try {
      await usersApi.downloadErrorReport(importPreviewData.errors);
      setSuccessMsg("त्रुटि एवं छोड़ी गई प्रविष्टियों की रिपोर्ट सफलतापूर्वक डाउनलोड हो गई।");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "त्रुटि रिपोर्ट डाउनलोड में समस्या आई।");
    } finally {
      setDownloadingErrorReport(false);
    }
  };

  // ========================================================
  // COMPLAINT DETAILS & STATUS UPDATES
  // ========================================================
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
        // Reload single complaint timeline
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
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center rounded-xl border border-emerald-700/60 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900/60"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              एक्सेल आयात (Import)
            </button>
            <button
              onClick={handleExportMembers}
              className="inline-flex items-center rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-500"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              सदस्य एक्सेल निर्यात
            </button>
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
        <div className="flex border-b border-slate-800 pb-2 space-x-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Activity size={14} />
            सिस्टम अवलोकन (Overview)
          </button>
          <button
            onClick={() => {
              setActiveTab("members");
              fetchUsers(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "members"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Users size={14} />
            सदस्य निर्देशिका (Members & Staff)
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
              {summary?.users.total ?? 0}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("complaints");
              fetchComplaints(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "complaints"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FileText size={14} />
            शिकायत निवारण (Complaints)
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
              {summary?.complaints.total ?? 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "security"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Shield size={14} />
            सुरक्षा व ऑडिट (Security)
          </button>
        </div>

        {/* ========================================================
            TAB 1: SYSTEM OVERVIEW
           ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Global Live Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div
                onClick={() => {
                  setUserRoleFilter("ALL");
                  setActiveTab("members");
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    कुल सदस्य (Total Members)
                  </p>
                  <Users size={16} className="text-orange-400" />
                </div>
                <p className="mt-2 text-3xl font-black text-white">
                  {summary?.users.total ?? 0}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">पंजीकृत नागरिक: {summary?.users.citizens ?? 0}</span>
                  {summary?.users.todayRegistrations ? (
                    <span className="rounded-md bg-emerald-950 px-1.5 py-0.5 text-emerald-400 font-bold">
                      +{summary.users.todayRegistrations} आज
                    </span>
                  ) : null}
                </div>
              </div>

              <div
                onClick={() => {
                  setUserRoleFilter("BOOTH_WORKER");
                  setActiveTab("members");
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    बूथ कार्यकर्ता (Workers)
                  </p>
                  <UserCheck size={16} className="text-emerald-400" />
                </div>
                <p className="mt-2 text-3xl font-black text-emerald-400">
                  {summary?.users.boothWorkers ?? 0}
                </p>
                <p className="mt-2 text-[11px] text-emerald-400/90 font-medium">
                  आज फील्ड उपस्थिति: {summary?.todayAttendance ?? 0}
                </p>
              </div>

              <div
                onClick={() => {
                  setComplaintStatusFilter("ALL");
                  setActiveTab("complaints");
                }}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-blue-500/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    कुल शिकायतें (Complaints)
                  </p>
                  <FileText size={16} className="text-blue-400" />
                </div>
                <p className="mt-2 text-3xl font-black text-blue-400">
                  {summary?.complaints.total ?? 0}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{summary?.complaints.resolved ?? 0} निस्तारित</span>
                  {summary?.complaints.urgent ? (
                    <span className="rounded-md bg-rose-950 px-1.5 py-0.5 text-rose-400 font-bold">
                      {summary.complaints.urgent} तत्काल
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    निस्तारण दर (Resolution Rate)
                  </p>
                  <TrendingUp size={16} className="text-purple-400" />
                </div>
                <p className="mt-2 text-3xl font-black text-purple-400">
                  {summary?.complaints.resolutionRate ?? 0}%
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>अस्वीकृत: {summary?.complaints.rejected ?? 0}</span>
                  <span>प्रक्रियाधीन: {summary?.complaints.inProgress ?? 0}</span>
                </div>
              </div>
            </div>

            {/* 7-Day Complaint Activity Trend Visualizer */}
            {summary?.trend && summary.trend.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-sm font-bold text-white">
                    <TrendingUp className="mr-2 h-4 w-4 text-orange-400" />
                    विगत 7 दिवस शिकायत एवं निस्तारण रुझान (7-Day Activity Trend)
                  </h2>
                  <span className="text-xs text-slate-400">रियल-टाइम डेटाबेस रिकॉर्ड्स</span>
                </div>
                <div className="mt-6 grid grid-cols-7 gap-2">
                  {summary.trend.map((t, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-end rounded-xl bg-slate-800/50 p-3 text-center">
                      <div className="flex items-end gap-1.5 h-24 mb-2">
                        {/* Received Bar */}
                        <div
                          style={{ height: `${Math.min(100, Math.max(12, t.count * 18))}px` }}
                          className="w-3 rounded-t-sm bg-blue-500 shadow-xs"
                          title={`प्राप्त शिकायतें: ${t.count}`}
                        />
                        {/* Resolved Bar */}
                        <div
                          style={{ height: `${Math.min(100, Math.max(12, t.resolved * 18))}px` }}
                          className="w-3 rounded-t-sm bg-emerald-500 shadow-xs"
                          title={`निस्तारित: ${t.resolved}`}
                        />
                      </div>
                      <p className="text-[11px] font-bold text-white">{t.label}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-mono">
                        <span className="text-blue-400 font-bold">{t.count}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-emerald-400 font-bold">{t.resolved}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-blue-500 inline-block" />
                    नई शिकायतें (New Received)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500 inline-block" />
                    निस्तारित शिकायतें (Resolved)
                  </span>
                </div>
              </div>
            )}

            {/* Recent Registrations & Recent Complaints Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Members */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="flex items-center text-sm font-bold text-white">
                    <Users className="mr-2 h-4 w-4 text-orange-400" />
                    नवीनतम सदस्य पंजीकरण (Recent Members)
                  </h3>
                  <button
                    onClick={() => setActiveTab("members")}
                    className="text-xs font-bold text-orange-400 hover:underline"
                  >
                    सभी देखें &rarr;
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {summary?.recentMembers && summary.recentMembers.length > 0 ? (
                    summary.recentMembers.map((m) => (
                      <div
                        key={m._id}
                        className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs"
                      >
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

              {/* Recent Complaints */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="flex items-center text-sm font-bold text-white">
                    <FileText className="mr-2 h-4 w-4 text-blue-400" />
                    हालिया शिकायतें (Recent Complaints)
                  </h3>
                  <button
                    onClick={() => setActiveTab("complaints")}
                    className="text-xs font-bold text-blue-400 hover:underline"
                  >
                    सभी देखें &rarr;
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {summary?.recentComplaints && summary.recentComplaints.length > 0 ? (
                    summary.recentComplaints.map((c) => (
                      <div
                        key={c._id}
                        className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs"
                      >
                        <div>
                          <span className="font-mono text-[10px] font-bold text-orange-400">
                            {c.trackingId}
                          </span>
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
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center text-lg font-bold text-white">
                  <Users className="mr-2 h-5 w-5 text-orange-500" />
                  सदस्य निर्देशिका एवं प्रबंधन (Member Management Directory)
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  सभी 5 भूमिकाओं के सदस्यों का विवरण, पद, मतदाता क्रमांक, स्थिति एवं एक्सेल आयात/निर्यात
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportMembers}
                  className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5 text-orange-400" />
                  एक्सेल निर्यात
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="inline-flex items-center rounded-xl border border-emerald-700/60 bg-emerald-950/40 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900/60"
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                  एक्सेल आयात
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  नया सदस्य बनाएं
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="text"
                  placeholder="नाम, मोबाइल, वोटर आईडी, पद या परिवार आईडी द्वारा खोजें..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchUsers(1);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="ALL">सभी भूमिकाएं (All Roles)</option>
                  <option value="SUPER_ADMIN">सुपर एडमिन (SUPER_ADMIN)</option>
                  <option value="POLITICIAN">जनप्रतिनिधि (POLITICIAN)</option>
                  <option value="PA_STAFF">कार्यालय स्टाफ (PA_STAFF)</option>
                  <option value="BOOTH_WORKER">बूथ कार्यकर्ता (BOOTH_WORKER)</option>
                  <option value="CITIZEN">नागरिक (CITIZEN)</option>
                </select>
              </div>

              <div>
                <select
                  value={userStatusFilter}
                  onChange={(e) => {
                    setUserStatusFilter(e.target.value);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="ALL">सभी स्थितियां (All Status)</option>
                  <option value="ACTIVE">सक्रिय (ACTIVE)</option>
                  <option value="SUSPENDED">निलंबित (SUSPENDED)</option>
                  <option value="DEACTIVATED">निष्क्रिय (DEACTIVATED)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <p>कुल सदस्य: <span className="font-bold text-white">{memberTotalCount}</span></p>
              <button
                onClick={() => fetchUsers(1)}
                className="inline-flex items-center gap-1 text-orange-400 hover:underline"
              >
                <RefreshCw size={12} className={loadingUsers ? "animate-spin" : ""} />
                फ़िल्टर लागू करें
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              {loadingUsers ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
                  <p className="mt-2">सदस्य सूची लोड हो रही है...</p>
                </div>
              ) : usersList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  कोई सदस्य रिकॉर्ड उपलब्ध नहीं है।
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">सदस्य नाम / पद</th>
                      <th className="py-3 px-3">मोबाइल / वोटर आईडी</th>
                      <th className="py-3 px-3">भूमिका (Role)</th>
                      <th className="py-3 px-3">वार्ड / बूथ / क्षेत्र</th>
                      <th className="py-3 px-3">स्थिति (Status)</th>
                      <th className="py-3 px-3 text-right">कार्यवाही (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList.map((u) => (
                      <tr key={u._id} className="transition hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <p className="font-bold text-white">{u.fullName}</p>
                          {u.designation ? (
                            <p className="text-[11px] text-orange-400 font-medium">{u.designation}</p>
                          ) : (
                            <p className="text-[11px] text-slate-500">पद अनिर्दिष्ट</p>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-mono text-slate-300">+91 {u.mobileNumber}</p>
                          {u.voterId ? (
                            <span className="font-mono text-[10px] text-slate-400">EPIC: {u.voterId}</span>
                          ) : null}
                        </td>
                        <td className="py-3 px-3">
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
                        <td className="py-3 px-3 text-slate-300">
                          <div>
                            {u.wardNumber || u.boothNumber ? (
                              <span className="font-semibold">
                                {u.wardNumber ? `वार्ड: ${u.wardNumber}` : ""}
                                {u.wardNumber && u.boothNumber ? " | " : ""}
                                {u.boothNumber ? `बूथ: ${u.boothNumber}` : ""}
                              </span>
                            ) : null}
                            <p className="text-[10px] text-slate-500">
                              {u.assemblyConstituency || u.district || "क्षेत्र अनिर्दिष्ट"}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              u.accountStatus === "ACTIVE"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : u.accountStatus === "SUSPENDED"
                                ? "bg-amber-950 text-amber-400 border border-amber-800"
                                : "bg-rose-950 text-rose-400 border border-rose-800"
                            }`}
                          >
                            {u.accountStatus || "ACTIVE"}
                          </span>
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
                              onClick={() => openEditModal(u)}
                              title="संपादित करें"
                              className="rounded-lg p-1.5 text-blue-400 hover:bg-slate-800 hover:text-blue-300"
                            >
                              <Edit size={14} />
                            </button>
                            {u.role !== "SUPER_ADMIN" && (
                              <>
                                <button
                                  onClick={() => handleStatusToggle(u._id, u.accountStatus || "ACTIVE")}
                                  title={u.accountStatus === "ACTIVE" ? "निलंबित करें" : "सक्रिय करें"}
                                  className={`rounded-lg p-1.5 ${
                                    u.accountStatus === "ACTIVE"
                                      ? "text-amber-400 hover:bg-slate-800 hover:text-amber-300"
                                      : "text-emerald-400 hover:bg-slate-800 hover:text-emerald-300"
                                  }`}
                                >
                                  <Power size={14} />
                                </button>
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
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {memberTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                <p>
                  पृष्ठ <span className="font-bold text-white">{memberPage}</span> / {memberTotalPages}
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
        )}

        {/* ========================================================
            TAB 3: COMPLAINT MANAGEMENT
           ======================================================== */}
        {activeTab === "complaints" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center text-lg font-bold text-white">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  शिकायत निवारण एवं समयरेखा (Complaint Redressal Portal)
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  नागरिक शिकायतों की स्थिति, त्वरित प्रगति टिप्पणी, स्टाफ आवंटन एवं अनिवार्य अस्वीकृति कारण प्रबंधन
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportComplaints}
                  className="inline-flex items-center rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-500"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  शिकायत एक्सेल निर्यात
                </button>
              </div>
            </div>

            {/* Complaints Filters Bar */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="text"
                  placeholder="ट्रैकिंग आईडी (JC-2026-...), विषय या नागरिक नाम से खोजें..."
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
                  <option value="ASSIGNED">आवंटित (ASSIGNED)</option>
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
                  <option value="ALL">सभी प्राथमिकताएं (All Priority)</option>
                  <option value="URGENT">अति-महत्वपूर्ण (URGENT)</option>
                  <option value="HIGH">उच्च (HIGH)</option>
                  <option value="MEDIUM">मध्यम (MEDIUM)</option>
                  <option value="LOW">सामान्य (LOW)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <p>कुल शिकायतें: <span className="font-bold text-white">{complaintTotalCount}</span></p>
              <button
                onClick={() => fetchComplaints(1)}
                className="inline-flex items-center gap-1 text-orange-400 hover:underline"
              >
                <RefreshCw size={12} className={loadingComplaints ? "animate-spin" : ""} />
                फ़िल्टर लागू करें
              </button>
            </div>

            {/* Complaints Table */}
            <div className="overflow-x-auto">
              {loadingComplaints ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
                  <p className="mt-2">शिकायत सूची लोड हो रही है...</p>
                </div>
              ) : complaintsList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  कोई शिकायत उपलब्ध नहीं है।
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
                          <span className="font-mono text-xs font-bold text-orange-400">
                            {c.trackingId}
                          </span>
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

            {/* Pagination Controls */}
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
            TAB 4: SECURITY & SYSTEM GUARDRAILS
           ======================================================== */}
        {activeTab === "security" && (
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
        )}

      </div>

      {/* ========================================================
          MODAL: VIEW MEMBER DETAILS
         ======================================================== */}
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
                  <span className="text-slate-500 font-medium">वोटर आईडी (EPIC):</span>
                  <p className="font-mono font-bold text-white mt-0.5">{selectedUser.voterId || "—"}</p>
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
                <span className="text-slate-500 font-medium">क्षेत्रीय विवरण:</span>
                <p className="text-slate-200">
                  <span className="text-slate-400">वार्ड नंबर:</span> {selectedUser.wardNumber || "—"} |{" "}
                  <span className="text-slate-400">बूथ नंबर:</span> {selectedUser.boothNumber || "—"}
                </p>
                <p className="text-slate-200">
                  <span className="text-slate-400">विधानसभा:</span> {selectedUser.assemblyConstituency || "—"} |{" "}
                  <span className="text-slate-400">जिला:</span> {selectedUser.district || "—"}
                </p>
                {selectedUser.address && (
                  <p className="text-slate-200">
                    <span className="text-slate-400">पता:</span> {selectedUser.address}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setViewUserModal(false);
                    openEditModal(selectedUser);
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500"
                >
                  संपादित करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT MEMBER PROFILE
         ======================================================== */}
      {editUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">सदस्य विवरण संपादित करें</h3>
              </div>
              <button
                onClick={() => setEditUserModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-bold text-slate-300">पूरा नाम (Full Name)</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">
                    भूमिका / पद श्रेणी (Role) <span className="text-orange-400">*</span>
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as "SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN")}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 font-bold text-white outline-none focus:border-blue-500"
                  >
                    <option value="CITIZEN">नागरिक (CITIZEN)</option>
                    <option value="BOOTH_WORKER">बूथ कार्यकर्ता (BOOTH_WORKER)</option>
                    <option value="PA_STAFF">पीए / कार्यालय स्टाफ (PA_STAFF)</option>
                    <option value="POLITICIAN">जन प्रतिनिधि / नेता (POLITICIAN)</option>
                    <option value="SUPER_ADMIN">मुख्य व्यवस्थापक (SUPER_ADMIN)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">खाता स्थिति (Status)</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "ACTIVE" | "SUSPENDED" | "DEACTIVATED")}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">सक्रिय (ACTIVE)</option>
                    <option value="SUSPENDED">निलंबित (SUSPENDED)</option>
                    <option value="DEACTIVATED">निष्क्रिय (DEACTIVATED)</option>
                  </select>
                </div>
              </div>

              {(editRole === "BOOTH_WORKER" || editRole === "PA_STAFF") && (
                <div className="rounded-xl border border-blue-900/60 bg-blue-950/40 p-2.5 text-[11px] text-blue-300">
                  <p className="font-semibold">कार्यकर्ता आवंटन सूचना:</p>
                  <p className="text-slate-300">
                    कार्यकर्ता या स्टाफ को प्रभार सौंपने के लिए नीचे वार्ड नंबर, बूथ नंबर एवं विधानसभा का विवरण दर्ज करें।
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">पद (Designation)</label>
                  <input
                    type="text"
                    placeholder="उदा. मंडल अध्यक्ष / सचिव"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">मतदाता क्रमांक (Voter ID)</label>
                  <input
                    type="text"
                    placeholder="उदा. ABC1234567"
                    value={editVoterId}
                    onChange={(e) => setEditVoterId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">ईमेल</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">वैकल्पिक मोबाइल</label>
                  <input
                    type="tel"
                    value={editAlternateMobile}
                    onChange={(e) => setEditAlternateMobile(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">वार्ड नंबर</label>
                  <input
                    type="text"
                    value={editWardNumber}
                    onChange={(e) => setEditWardNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">बूथ नंबर</label>
                  <input
                    type="text"
                    value={editBoothNumber}
                    onChange={(e) => setEditBoothNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">विधानसभा</label>
                  <input
                    type="text"
                    value={editAssemblyConstituency}
                    onChange={(e) => setEditAssemblyConstituency(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">जिला (District)</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setEditUserModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 font-bold text-slate-300 hover:bg-slate-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-500 disabled:opacity-60"
                >
                  {savingUser ? <Loader2 size={14} className="animate-spin" /> : null}
                  सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DELETE / DEACTIVATE CONFIRMATION
         ======================================================== */}
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

      {/* ========================================================
          MODAL: DEDICATED EXCEL IMPORT (NAME + PHONE NUMBER)
         ======================================================== */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">एक्सेल से सदस्य आयात करें (Import Members from Excel)</h3>
                    <span className="rounded-full bg-emerald-950/70 border border-emerald-700/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      केवल 2 कॉलम: Name + Phone
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    सरल दो-कॉलम एक्सेल (.xlsx, .xls, .csv) सीधे अपलोड करें। अन्य किसी कॉलम की आवश्यकता नहीं है।
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportPreviewData(null);
                  setImportFile(null);
                  setImportResultSummary(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Strict Policy & Information Notice */}
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3.5 text-xs space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-bold text-slate-200">डेटा सुरक्षा एवं आयात नियम (Import Guardrails):</p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-slate-700"
                >
                  <Download size={12} className="mr-1" />
                  मानक 2-कॉलम टेम्पलेट (.xlsx) डाउनलोड करें
                </button>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                <li>
                  <strong className="text-slate-300">डिफ़ॉल्ट भूमिका:</strong> सभी आयातित सदस्य सुरक्षित रूप से <strong className="text-emerald-400">नागरिक (CITIZEN)</strong> के रूप में दर्ज होंगे।
                </li>
                <li>
                  <strong className="text-slate-300">भूमिका संवर्धन:</strong> किसी भी सदस्य को बाद में सदस्य सूची के <em>&quot;संपादित करें (Edit)&quot;</em> बटन से बूथ कार्यकर्ता या स्टाफ बनाया जा सकता है।
                </li>
                <li>
                  <strong className="text-slate-300">डुप्लीकेट सुरक्षा:</strong> फाइल में पुनरावृत्ति होने पर केवल पहली प्रविष्टि ली जाएगी तथा डेटाबेस में पहले से मौजूद सदस्यों को सुरक्षित रूप से छोड़ दिया जाएगा।
                </li>
              </ul>
            </div>

            {/* File Upload Dropzone */}
            <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/20 p-5 text-center transition hover:border-slate-600">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileSelectForPreview}
                className="hidden"
              />
              <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-2 text-xs font-bold text-white">
                {importFile ? importFile.name : "अपनी 2-कॉलम एक्सेल या CSV फाइल चुनें"}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                .xlsx, .xls अथवा .csv फाइलें समर्थित हैं (अधिकतम 2500 पंक्तियाँ प्रति बैच)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 inline-flex items-center rounded-xl bg-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-orange-500"
              >
                <Upload size={13} className="mr-1.5" />
                {importFile ? "दूसरी फाइल चुनें" : "फाइल अपलोड करें"}
              </button>
            </div>

            {/* Preview State Loader */}
            {importingPreview && (
              <div className="py-6 text-center text-xs text-slate-400">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
                <p className="mt-2 font-medium">एक्सेल डेटा पार्सिंग एवं फोन नंबर सत्यापन प्रगति पर है...</p>
              </div>
            )}

            {/* Column Mapping & Preview Results */}
            {importPreviewData && (
              <div className="space-y-3">
                {/* Manual Column Mapping Section */}
                {importPreviewData.headers && importPreviewData.headers.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">
                        कॉलम मैपिंग (Column Mapping)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (सिस्टम ने स्वतः पहचान की है, आप आवश्यकतानुसार बदल सकते हैं)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-0.5">नाम कॉलम (Name Column)</label>
                        <select
                          value={nameColumnMapping}
                          onChange={(e) => setNameColumnMapping(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                        >
                          {importPreviewData.headers.map((h) => (
                            <option key={`name-${h}`} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-0.5">फोन नंबर कॉलम (Phone Column)</label>
                        <select
                          value={phoneColumnMapping}
                          onChange={(e) => setPhoneColumnMapping(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                        >
                          {importPreviewData.headers.map((h) => (
                            <option key={`phone-${h}`} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleApplyCustomMapping}
                          className="w-full rounded-lg border border-orange-500/40 bg-orange-950/40 px-3 py-1.5 text-xs font-bold text-orange-300 hover:bg-orange-900/60"
                        >
                          मैपिंग पुनः जांचें (Re-Check)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4 Distinct Stat Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-2.5">
                    <span className="block text-[10px] text-slate-400">कुल पंक्तियाँ</span>
                    <span className="text-base font-extrabold text-white">{importPreviewData.totalRows}</span>
                  </div>
                  <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-2.5">
                    <span className="block text-[10px] text-emerald-400">नए मान्य सदस्य</span>
                    <span className="text-base font-extrabold text-emerald-300">{importPreviewData.validRows}</span>
                  </div>
                  <div className="rounded-xl border border-amber-900/60 bg-amber-950/30 p-2.5">
                    <span className="block text-[10px] text-amber-400">फाइल में डुप्लीकेट</span>
                    <span className="text-base font-extrabold text-amber-300">{importPreviewData.duplicateInFileRows}</span>
                  </div>
                  <div className="rounded-xl border border-blue-900/60 bg-blue-950/30 p-2.5">
                    <span className="block text-[10px] text-blue-400">डेटाबेस में मौजूद</span>
                    <span className="text-base font-extrabold text-blue-300">{importPreviewData.existingInDbRows}</span>
                  </div>
                  <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-2.5">
                    <span className="block text-[10px] text-rose-400">अमान्य पंक्तियाँ</span>
                    <span className="text-base font-extrabold text-rose-300">{importPreviewData.invalidRows}</span>
                  </div>
                </div>

                {/* Skip Existing Option */}
                <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-2.5 text-xs border border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={skipExistingOnImport}
                      onChange={(e) => setSkipExistingOnImport(e.target.checked)}
                      className="rounded-sm text-emerald-600 focus:ring-0"
                    />
                    <span>मौजूदा डेटाबेस सदस्यों को छोड़ें (सुरक्षित नीति - भूमिकाएं अपरिवर्तित रहेंगी)</span>
                  </label>

                  {importPreviewData.errors && importPreviewData.errors.length > 0 && (
                    <button
                      type="button"
                      disabled={downloadingErrorReport}
                      onClick={handleDownloadErrorReport}
                      className="inline-flex items-center rounded-lg border border-rose-800/60 bg-rose-950/40 px-3 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-900/60 disabled:opacity-50"
                    >
                      {downloadingErrorReport ? (
                        <Loader2 size={11} className="mr-1 animate-spin" />
                      ) : (
                        <Download size={11} className="mr-1" />
                      )}
                      त्रुटि व स्किप रिपोर्ट (.xlsx) डाउनलोड
                    </button>
                  )}
                </div>

                {/* Preview Table */}
                <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-800 text-slate-400 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">पंक्ति</th>
                        <th className="py-2 px-3">नाम (Name)</th>
                        <th className="py-2 px-3">फोन नंबर (Phone)</th>
                        <th className="py-2 px-3">भूमिका (Role)</th>
                        <th className="py-2 px-3">स्थिति व विवरण (Status)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {importPreviewData.preview.map((r) => (
                        <tr
                          key={`row-${r.rowNumber}`}
                          className={
                            !r.isValid
                              ? "bg-rose-950/20"
                              : r.isDuplicateInFile
                              ? "bg-amber-950/20"
                              : r.isExistingInDb
                              ? "bg-blue-950/20"
                              : ""
                          }
                        >
                          <td className="py-2 px-3 font-mono">{r.rowNumber}</td>
                          <td className="py-2 px-3 font-bold text-white">{r.fullName || "—"}</td>
                          <td className="py-2 px-3 font-mono text-slate-200">
                            {r.mobileNumber ? `+91 ${r.mobileNumber}` : (r.rawMobile || "—")}
                          </td>
                          <td className="py-2 px-3">
                            <span className="rounded-md bg-slate-800 px-2 py-0.5 font-bold text-slate-300 text-[10px]">
                              CITIZEN
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {r.isValid && !r.isDuplicateInFile && !r.isExistingInDb ? (
                              <span className="font-bold text-emerald-400">नया सदस्य (स्वीकार्य)</span>
                            ) : r.isDuplicateInFile ? (
                              <span className="font-bold text-amber-400">
                                फाइल में डुप्लीकेट (पंक्ति #{r.duplicateOfRow} का)
                              </span>
                            ) : r.isExistingInDb ? (
                              <span className="font-bold text-blue-400">
                                डेटाबेस में मौजूद ({r.existingRecord?.fullName} - {r.existingRecord?.role}) [स्किप होगा]
                              </span>
                            ) : (
                              <span className="font-bold text-rose-400">{r.errors.join(", ")}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Import Confirmation Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setImportPreviewData(null);
                      setImportFile(null);
                    }}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="button"
                    disabled={confirmingImport || importPreviewData.validRows === 0}
                    onClick={handleConfirmImport}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {confirmingImport ? <Loader2 size={13} className="animate-spin" /> : null}
                    डेटाबेस में आयात की पुष्टि करें ({importPreviewData.validRows} नए सदस्य)
                  </button>
                </div>
              </div>
            )}

            {/* Post-Import Result Summary Notification */}
            {importResultSummary && (
              <div className="rounded-xl border border-emerald-800 bg-emerald-950/60 p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <p className="font-bold text-emerald-300">एक्सेल आयात प्रक्रिया सफलतापूर्वक संपन्न हुई!</p>
                </div>
                <p className="text-slate-300">
                  नए नागरिक जोड़े गए: <strong className="text-white">{importResultSummary.createdCount}</strong> |{" "}
                  सुरक्षा हेतु छोड़े गए (मौजूदा/डुप्लीकेट): <strong className="text-white">{importResultSummary.skippedCount}</strong> |{" "}
                  विफल: <strong className="text-white">{importResultSummary.failedCount}</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  सभी नए सदस्य नीचे सदस्य तालिका में प्रदर्शित हो रहे हैं। आप किसी भी सदस्य को एडिट कर बूथ कार्यकर्ता या स्टाफ में पदोन्नत कर सकते हैं।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: COMPLAINT DETAILS & STATUS UPDATE
         ======================================================== */}
      {showComplaintModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-orange-400">
                  {selectedComplaint.trackingId}
                </span>
                <h3 className="text-base font-bold text-white">{selectedComplaint.subject}</h3>
              </div>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Complaint Meta Grid */}
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

            {/* Existing Timeline */}
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

            {/* Update Status Form */}
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
                    <option value="WAITING_FOR_INFORMATION">अतिरिक्त जानकारी प्रतीक्षित (WAITING_FOR_INFORMATION)</option>
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
                    <span>आंतरिक स्टाफ नोट (नागरिक से छिपाएं)</span>
                  </label>
                </div>
              </div>

              {/* Mandatory Rejection Reason */}
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

      {/* ========================================================
          MODAL: CREATE NEW PRIVILEGED USER / MEMBER
         ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">नया खाता बनाएं (Create Account)</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3 text-xs">
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-white outline-none focus:border-orange-500"
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pl-12 pr-3 text-white outline-none focus:border-orange-500"
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
                  placeholder="न्यूनतम 6 अक्षरों का सुरक्षित पासवर्ड"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">
                    भूमिका (Role) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN")}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-white outline-none focus:border-orange-500"
                  >
                    <option value="POLITICIAN">जनप्रतिनिधि (POLITICIAN)</option>
                    <option value="PA_STAFF">कार्यालय स्टाफ (PA_STAFF)</option>
                    <option value="BOOTH_WORKER">बूथ कार्यकर्ता (BOOTH_WORKER)</option>
                    <option value="CITIZEN">नागरिक (CITIZEN)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">पद (Designation)</label>
                  <input
                    type="text"
                    placeholder="उदा. मंडल अध्यक्ष"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">मतदाता क्रमांक (Voter ID)</label>
                  <input
                    type="text"
                    placeholder="उदा. MP01/123/456"
                    value={newVoterId}
                    onChange={(e) => setNewVoterId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">जिला (District)</label>
                  <input
                    type="text"
                    placeholder="उदा. भोपाल"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">विधानसभा</label>
                  <input
                    type="text"
                    placeholder="उदा. गोविंदपुरा"
                    value={newConstituency}
                    onChange={(e) => setNewConstituency(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">वार्ड नंबर</label>
                  <input
                    type="text"
                    placeholder="उदा. 42"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">बूथ नंबर</label>
                  <input
                    type="text"
                    placeholder="उदा. 108"
                    value={newBooth}
                    onChange={(e) => setNewBooth(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-slate-800 pt-4">
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
                  {submittingUser ? <Loader2 size={14} className="animate-spin" /> : null}
                  खाता बनाएं
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
