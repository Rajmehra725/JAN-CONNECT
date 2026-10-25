/**
 * Centralized API Client for Jan Connect
 * Provides typed request/response methods for frontend-to-backend communication.
 * Supports environment variable configuration via NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL.
 */

function cleanBase(url?: string): string {
  if (!url) return "";
  // Strip duplicate internal slashes except after http: or https:
  const normalized = url.trim().replace(/([^:])\/\/+/g, "$1/");
  return normalized.replace(/\/+$/, "");
}

export function getApiBase(): string {
  if (typeof window !== "undefined") {
    // In local development, use same-origin proxy to eliminate CORS, CORP and third-party cookie restrictions
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "/api/v1";
    }
  }

  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBase) {
    return cleanBase(envBase);
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${cleanBase(process.env.NEXT_PUBLIC_API_URL)}/api/v1`;
  }
  return "https://jan-connect-backend.onrender.com/api/v1";
}

const V1 = getApiBase();

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface CaptchaChallenge {
  challengeId: string;
  question: string;
  expiresInSeconds: number;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  mobileNumber: string;
  alternateMobile?: string;
  role: "SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN";
  accountStatus: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  email?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  occupation?: string;
  designation?: string;
  designationCategory?: "POLITICAL" | "ORGANIZATIONAL" | "ADMINISTRATIVE";
  designationId?: { _id: string; title: string; titleHi?: string; category: string; level?: string } | string;
  department?: string;
  departmentId?: { _id: string; name: string; nameHi?: string; code?: string } | string;
  officialEmail?: string;
  officeAddress?: string;
  officeContact?: string;
  termStartDate?: string;
  termEndDate?: string;
  voterId?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  address?: string;
  villageMohalla?: string;
  state?: string;
  division?: string;
  district?: string;
  areaType?: "RURAL" | "URBAN";
  tehsil?: string;
  developmentBlock?: string;
  gramPanchayat?: string;
  village?: string;
  localBodyType?: string;
  localBody?: string;
  wardNumber?: string;
  wardName?: string;
  boothNumber?: string;
  assemblyConstituency?: string;
  parliamentaryConstituency?: string;
  pincode?: string;
  familyId?: string;
  emergencyContact?: string;
  gpsLocation?: string;
  profilePhoto?: string;
  verificationStatus?: "UNVERIFIED" | "VERIFIED" | "REJECTED" | "FLAGGED";
  verifiedBy?: { _id: string; fullName: string; role: string };
  verifiedAt?: string;
  verificationNotes?: string;
  sourceOfInformation?: string;
  isPublicDirectoryVisible?: boolean;
  constituencyId?: { _id: string; name: string; code?: string; district?: string };
  wardId?: { _id: string; name?: string; wardNumber: string };
  boothId?: { _id: string; name?: string; boothNumber: string };
  officeId?: { _id: string; name?: string; address?: string };
  createdBy?: { _id: string; fullName: string; role: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface DesignationItem {
  _id: string;
  title: string;
  titleHi?: string;
  category: "POLITICAL" | "ORGANIZATIONAL" | "ADMINISTRATIVE";
  level?: "NATIONAL" | "STATE" | "DIVISION" | "DISTRICT" | "SUB_DIVISION" | "BLOCK" | "MUNICIPAL" | "PANCHAYAT" | "BOOTH";
  applicableAreaType?: "ALL" | "RURAL" | "URBAN";
  departmentId?: { _id: string; name: string; nameHi?: string; code?: string } | string;
  departmentName?: string;
  sortOrder?: number;
  isActive: boolean;
  assignedMembersCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentItem {
  _id: string;
  name: string;
  nameHi?: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface GeographyHierarchy {
  states: string[];
  districts: string[];
  assemblyConstituencies: string[];
  parliamentaryConstituencies: string[];
  rural: {
    tehsils: string[];
    developmentBlocks: string[];
    gramPanchayats: string[];
    villages: string[];
  };
  urban: {
    localBodyTypes: string[];
    localBodies: string[];
    wards: Array<{ wardNumber: string; wardName?: string }>;
  };
}

export interface PublicDirectoryMember {
  _id: string;
  fullName: string;
  designation: string;
  designationCategory: string;
  department?: string;
  profilePhoto?: string;
  state?: string;
  division?: string;
  district?: string;
  assemblyConstituency?: string;
  parliamentaryConstituency?: string;
  areaType?: string;
  developmentBlock?: string;
  localBody?: string;
  gramPanchayat?: string;
  village?: string;
  wardNumber?: string;
  wardName?: string;
  officeAddress?: string;
  officeContact?: string;
  officialEmail?: string;
  termStartDate?: string;
  termEndDate?: string;
  verificationStatus: string;
  updatedAt?: string;
}

export interface ComplaintItem {
  _id: string;
  trackingId: string;
  citizenId: { _id: string; fullName: string; mobileNumber: string };
  category: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "WAITING_FOR_INFORMATION"
    | "RESOLVED"
    | "REJECTED"
    | "REOPENED";
  constituencyId?: { _id: string; name: string };
  wardId?: { _id: string; wardNumber: string };
  boothId?: { _id: string; boothNumber: string };
  assignedUserId?: { _id: string; fullName: string; role: string };
  assignedOfficeId?: { _id: string; name: string; address?: string };
  location?: string;
  rejectionReason?: string;
  resolutionDetails?: string;
  resolutionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintUpdateItem {
  _id: string;
  complaintId: string;
  authorId: { _id: string; fullName: string; role: string };
  authorRole: string;
  statusBefore?: string;
  statusAfter?: string;
  updateText: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TaskItem {
  _id: string;
  title: string;
  description: string;
  assignedWorkerId: { _id: string; fullName: string; mobileNumber: string };
  createdById: { _id: string; fullName: string; role: string };
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  dueDate?: string;
  completionNotes?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  _id: string;
  workerId: { _id: string; fullName: string; mobileNumber: string };
  attendanceDate: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE";
  location?: string;
  fieldActivity?: string;
}

export interface DashboardSummary {
  systemHealth?: {
    database: string;
    apiStatus: string;
    timestamp: string;
  };
  complaints: {
    total: number;
    submitted: number;
    inProgress: number;
    resolved: number;
    rejected: number;
    urgent: number;
    overdue?: number;
    todayComplaints?: number;
    resolutionRate?: number;
  };
  users: {
    total: number;
    citizens: number;
    boothWorkers: number;
    staff: number;
    politicians?: number;
    superAdmins?: number;
    todayRegistrations?: number;
    periodRegistrations?: number;
    active?: number;
    suspended?: number;
    deactivated?: number;
    pending?: number;
    verified?: number;
    unverified?: number;
    pendingReview?: number;
    rejected?: number;
    missingDesignation?: number;
    missingLocation?: number;
    incompleteContact?: number;
  };
  distribution?: {
    byDesignation: Array<{ title: string; count: number }>;
    byDistrict: Array<{ district: string; count: number }>;
    byArea: { rural: number; urban: number };
  };
  botStats?: {
    totalQueries: number;
    unansweredCount: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
  todayAttendance: number;
  recentMembers?: Array<{
    _id: string;
    fullName: string;
    mobileNumber: string;
    role: "SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN";
    designation?: string;
    accountStatus: "ACTIVE" | "SUSPENDED" | "DEACTIVATED" | "PENDING";
    verificationStatus?: string;
    createdAt: string;
  }>;
  recentComplaints?: Array<{
    _id: string;
    trackingId: string;
    subject: string;
    category: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status: string;
    citizenId?: { fullName: string; mobileNumber: string };
    createdAt: string;
  }>;
  recentActivity?: AuditLogItem[];
  trend?: Array<{
    date: string;
    label?: string;
    registrations?: number;
    complaints?: number;
    count?: number;
    resolved?: number;
  }>;
}

export interface FaqItem {
  _id: string;
  faqId: string;
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
  keywords: string[];
  alternativePhrases: string[];
  category: string;
  sortOrder: number;
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BotAskResponse {
  status: "ANSWERED" | "CLARIFYING" | "UNANSWERED" | "HANDED_OFF";
  confidence: number;
  language: "HI" | "EN";
  answer: string | null;
  matchedFaq: { faqId: string; question: string; category: string } | null;
  clarificationOptions: Array<{ faqId: string; question: string; score?: number }>;
  fallbackSupport: {
    tawkEnabled: boolean;
    supportEmail: string;
    portalHelpline: string;
  };
}

export interface BotAnalytics {
  totalQueries: number;
  answeredQueries: number;
  clarifyingQueries: number;
  unansweredQueries: number;
  accuracyRate: number;
  topFaqs: Array<{ faqId: string; questionHi: string; usageCount: number; category: string }>;
}

export interface AuditLogItem {
  _id: string;
  actorId?: { fullName: string; role: string; mobileNumber?: string };
  userId?: { fullName: string; role: string; mobileNumber?: string };
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  noticeType?: string;
  isImportant?: boolean;
  attachmentUrl?: string;
  publishedAt?: string;
  createdAt?: string;
}

export interface SchemeItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  eligibility: string;
  requiredDocuments: string[];
  applicationInstructions?: string;
  department?: string;
  officialUrl?: string;
  verified?: boolean;
}

function buildUrl(endpoint: string): string {
  let fullUrl: string;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    fullUrl = endpoint;
  } else {
    const base = getApiBase();
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    fullUrl = `${base}${cleanEndpoint}`;
  }
  return fullUrl.replace(/([^:])\/\/+/g, "$1/");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = buildUrl(endpoint);
  const defaultHeaders: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // Dual auth: Attach Bearer token from localStorage for seamless cross-origin communication
  if (typeof window !== "undefined") {
    try {
      const storedToken = localStorage.getItem("jc_token");
      if (storedToken && !defaultHeaders["Authorization"]) {
        defaultHeaders["Authorization"] = `Bearer ${storedToken}`;
      }
    } catch {
      // Ignore storage access restrictions
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers as Record<string, string>),
      },
      credentials: "include", // HttpOnly session cookie
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `HTTP ${res.status}: अनुरोध विफल रहा।`,
        code: data.code,
        errors: data.errors,
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data !== undefined ? data.data : data,
    };
  } catch (error) {
    const rawMsg =
      error instanceof Error ? error.message : "सर्वर से संपर्क स्थापित नहीं हो सका।";
    const isNetworkErr =
      rawMsg.toLowerCase().includes("failed to fetch") ||
      rawMsg.toLowerCase().includes("fetch failed") ||
      rawMsg.toLowerCase().includes("networkerror");

    return {
      success: false,
      message: isNetworkErr
        ? "बैकएंड सर्वर से कनेक्शन नहीं हो सका (यदि Render स्लीप मोड में है तो चालू होने में 30-50 सेकंड लग सकते हैं)। कृपया कुछ सेकंड बाद पुनः प्रयास करें।"
        : rawMsg,
    };
  }
}

// ==========================================
// AUTH & CAPTCHA API
// ==========================================
export const authApi = {
  getCaptcha: () => request<CaptchaChallenge>("/auth/captcha"),

  registerCitizen: (payload: Record<string, unknown>) =>
    request<{ user: UserProfile }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: async (
    mobileNumber: string,
    password: string,
    captchaId?: string,
    captchaAnswer?: string,
    expectedRole?: string
  ) => {
    const res = await request<{ user: UserProfile; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        mobileNumber,
        password,
        captchaId,
        captchaAnswer,
        expectedRole,
      }),
    });

    if (res.success && res.data?.token && typeof window !== "undefined") {
      try {
        localStorage.setItem("jc_token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("jc_user", JSON.stringify(res.data.user));
        }
      } catch {
        // Ignore storage access restrictions
      }
    }

    return res;
  },

  logout: async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("jc_token");
        localStorage.removeItem("jc_user");
      }
    } catch {
      // Ignore
    }
    return request("/auth/logout", {
      method: "POST",
    });
  },

  getMe: async () => {
    const res = await request<{ user: UserProfile }>("/auth/me");
    if (!res.success && typeof window !== "undefined") {
      if (
        res.code === "AUTH_REQUIRED" ||
        res.code === "SESSION_EXPIRED" ||
        res.code === "INVALID_TOKEN"
      ) {
        try {
          localStorage.removeItem("jc_token");
          localStorage.removeItem("jc_user");
        } catch {
          // Ignore
        }
      }
    }
    return res;
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  updateProfile: (payload: Record<string, unknown>) =>
    request<{ user: UserProfile }>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

// ==========================================
// COMPLAINTS API
// ==========================================
export const complaintsApi = {
  create: (payload: Record<string, unknown>) =>
    request<ComplaintItem>("/complaints", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ complaints: ComplaintItem[]; pagination: { total: number; page: number; totalPages: number } }>(
      `/complaints${qs}`
    );
  },

  track: (trackingId: string) =>
    request<{ complaint: ComplaintItem; timeline: ComplaintUpdateItem[] }>(
      `/complaints/track/${encodeURIComponent(trackingId)}`
    ),

  getById: (id: string) =>
    request<{ complaint: ComplaintItem; timeline: ComplaintUpdateItem[] }>(
      `/complaints/${id}`
    ),

  addUpdate: (
    id: string,
    payload: {
      updateText: string;
      newStatus?: string;
      isInternal?: boolean;
      rejectionReason?: string;
    }
  ) =>
    request<ComplaintUpdateItem>(`/complaints/${id}/updates`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  assign: (
    id: string,
    payload: { assignedUserId?: string; assignedOfficeId?: string }
  ) =>
    request<ComplaintItem>(`/complaints/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getExportUrl: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `${buildUrl("/reports/export/complaints")}${qs}`;
  },

  downloadExport: async (params?: Record<string, string>, filename = "complaints.xlsx") => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    const url = buildUrl(`/reports/export/complaints${qs}`);
    const token = typeof window !== "undefined" ? localStorage.getItem("jc_token") : null;
    const res = await fetch(url, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("डाउनलोड विफल रहा।");
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  },
};

// ==========================================
// TASKS API
// ==========================================
export const tasksApi = {
  create: (payload: Record<string, unknown>) =>
    request<TaskItem>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ tasks: TaskItem[]; pagination: unknown }>(`/tasks${qs}`);
  },

  getById: (id: string) => request<TaskItem>(`/tasks/${id}`),

  update: (
    id: string,
    payload: { status?: string; completionNotes?: string }
  ) =>
    request<TaskItem>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

// ==========================================
// ATTENDANCE API
// ==========================================
export const attendanceApi = {
  checkIn: (payload: { location?: string; fieldActivity?: string }) =>
    request<AttendanceRecord>("/attendance/check-in", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  checkOut: (payload: { fieldActivity?: string }) =>
    request<AttendanceRecord>("/attendance/check-out", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMy: () => request<AttendanceRecord[]>("/attendance/my"),

  getAll: (date?: string) => {
    const qs = date ? `?date=${encodeURIComponent(date)}` : "";
    return request<AttendanceRecord[]>(`/attendance/all${qs}`);
  },
};

// ==========================================
// USER MANAGEMENT API (Super Admin / Privileged)
// ==========================================
export const usersApi = {
  createUser: (payload: Record<string, unknown>) =>
    request<{ user: UserProfile }>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ users: UserProfile[]; pagination: { total: number; page: number; totalPages: number } }>(
      `/users${qs}`
    );
  },

  getById: (id: string) => request<{ user: UserProfile }>(`/users/${id}`),

  update: (id: string, payload: Record<string, unknown>) =>
    request<{ user: UserProfile }>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  verify: (
    id: string,
    payload: {
      verificationStatus: "UNVERIFIED" | "VERIFIED" | "REJECTED" | "FLAGGED";
      verificationNotes?: string;
      isPublicDirectoryVisible?: boolean;
    }
  ) =>
    request<{ user: UserProfile }>(`/users/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  updateStatus: (id: string, status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED") =>
    request<{ user: UserProfile }>(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string, hardDelete = false) =>
    request<{ id: string; retentionNotice?: string; softDeactivated?: boolean }>(
      `/users/${id}${hardDelete ? "?hardDelete=true" : ""}`,
      { method: "DELETE" }
    ),

  restore: (id: string) =>
    request<{ user: UserProfile }>(`/users/${id}/restore`, {
      method: "PATCH",
    }),

  getExportUrl: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `${buildUrl("/users/export")}${qs}`;
  },

  downloadExport: async (
    params?: Record<string, string>,
    userIds?: string[],
    filename = "members.xlsx"
  ) => {
    const isPost = userIds && userIds.length > 0;
    const url = buildUrl(
      `/users/export${!isPost && params ? `?${new URLSearchParams(params).toString()}` : ""}`
    );
    const token = typeof window !== "undefined" ? localStorage.getItem("jc_token") : null;
    const res = await fetch(url, {
      method: isPost ? "POST" : "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isPost ? { "Content-Type": "application/json" } : {}),
      },
      credentials: "include",
      body: isPost ? JSON.stringify({ exportType: "SELECTED", userIds, ...params }) : undefined,
    });
    if (!res.ok) throw new Error("सदस्य डेटा डाउनलोड विफल रहा।");
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  },

  downloadTemplate: async (filename = "jan_connect_member_import_template.xlsx") => {
    const url = buildUrl("/users/import/template");
    const token = typeof window !== "undefined" ? localStorage.getItem("jc_token") : null;
    const res = await fetch(url, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("टेम्पलेट डाउनलोड विफल रहा।");
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  },

  previewImport: (formData: FormData) =>
    request<{
      headers: string[];
      detectedMapping: Record<string, string>;
      totalRows: number;
      validRows: number;
      duplicateInFileRows: number;
      existingInDbRows: number;
      invalidRows: number;
      preview: Array<{
        rowNumber: number;
        fullName: string;
        mobileNumber: string;
        rawMobile: string;
        role: string;
        designation?: string;
        district?: string;
        isValid: boolean;
        isDuplicateInFile: boolean;
        duplicateOfRow: number | null;
        isExistingInDb: boolean;
        existingRecord?: { fullName: string; role: string; accountStatus: string };
        errors: string[];
      }>;
      rows: Array<{
        rowNumber: number;
        fullName: string;
        mobileNumber: string;
        rawMobile: string;
        role: string;
        designation?: string;
        district?: string;
        isValid: boolean;
        isDuplicateInFile: boolean;
        duplicateOfRow: number | null;
        isExistingInDb: boolean;
        existingRecord?: { fullName: string; role: string; accountStatus: string };
        errors: string[];
      }>;
      errors: Array<{ rowNumber: number; name: string; mobile: string; reason: string }>;
    }>("/users/import/preview", {
      method: "POST",
      body: formData,
    }),

  confirmImport: (payload: {
    rows: unknown[];
    importMode?: "CREATE_NEW" | "UPDATE_EXISTING" | "CREATE_OR_UPDATE" | "SKIP_MATCHED";
  }) =>
    request<{
      totalProcessed: number;
      createdCount: number;
      updatedCount: number;
      skippedCount: number;
      failedCount: number;
      failures: Array<{ rowNumber: number; name?: string; mobile?: string; reason: string }>;
    }>("/users/import/confirm", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  downloadErrorReport: async (
    errors: Array<{ rowNumber: number; name?: string; mobile?: string; reason: string }>,
    filename = "jan_connect_import_errors.xlsx"
  ) => {
    const url = buildUrl("/users/import/error-report");
    const token = typeof window !== "undefined" ? localStorage.getItem("jc_token") : null;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ errors }),
    });
    if (!res.ok) throw new Error("त्रुटि रिपोर्ट डाउनलोड विफल रहा।");
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  },
};

// ==========================================
// DESIGNATION & DEPARTMENT API (Super Admin / Master Data)
// ==========================================
export const designationsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<DesignationItem[]>(`/designations${qs}`);
  },

  getById: (id: string) => request<DesignationItem>(`/designations/${id}`),

  create: (payload: Partial<DesignationItem>) =>
    request<DesignationItem>("/designations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<DesignationItem>) =>
    request<DesignationItem>(`/designations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    request<{ deactivated?: boolean; deleted?: boolean }>(`/designations/${id}`, {
      method: "DELETE",
    }),

  getDepartments: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<DepartmentItem[]>(`/designations/departments${qs}`);
  },

  createDepartment: (payload: Partial<DepartmentItem>) =>
    request<DepartmentItem>("/designations/departments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ==========================================
// GEOGRAPHY API (Cascading Master Data)
// ==========================================
export const geographyApi = {
  getHierarchy: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<GeographyHierarchy>(`/geography/hierarchy${qs}`);
  },

  getSummary: () => request<Record<string, unknown>>("/geography/summary"),

  getConstituencies: () =>
    request<Array<{ _id: string; name: string; district: string; state: string }>>("/geography/constituencies"),

  createConstituency: (payload: Record<string, unknown>) =>
    request("/geography/constituencies", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getWards: (constituencyId?: string) => {
    const qs = constituencyId ? `?constituencyId=${encodeURIComponent(constituencyId)}` : "";
    return request<Array<{ _id: string; wardNumber: string; name?: string }>>(`/geography/wards${qs}`);
  },

  getBooths: (constituencyId?: string, wardId?: string) => {
    const params = new URLSearchParams();
    if (constituencyId) params.append("constituencyId", constituencyId);
    if (wardId) params.append("wardId", wardId);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return request<Array<{ _id: string; boothNumber: string; name?: string }>>(`/geography/booths${qs}`);
  },

  getOffices: (constituencyId?: string) => {
    const qs = constituencyId ? `?constituencyId=${encodeURIComponent(constituencyId)}` : "";
    return request<Array<{ _id: string; name: string; address?: string }>>(`/geography/offices${qs}`);
  },
};

// ==========================================
// PUBLIC DIRECTORY API
// ==========================================
export const directoryApi = {
  getDirectory: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{
      members: PublicDirectoryMember[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(`/directory${qs}`);
  },

  getMemberById: (id: string) => request<PublicDirectoryMember>(`/directory/${id}`),
};

// ==========================================
// REPORTS & SUMMARY API
// ==========================================
export const reportsApi = {
  getSummary: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<DashboardSummary>(`/reports/summary${qs}`);
  },

  getExportUrl: () => `${V1}/reports/export/complaints`,
};

// ==========================================
// NOTICES & ANNOUNCEMENTS API
// ==========================================
export const noticesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ notices: NoticeItem[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/notices${qs}`);
  },

  getById: (id: string) => request<NoticeItem>(`/notices/${id}`),

  create: (payload: Record<string, unknown>) =>
    request<NoticeItem>("/notices", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Record<string, unknown>) =>
    request<NoticeItem>(`/notices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    request(`/notices/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// SMART FAQ BOT & FAQS API
// ==========================================
export const botApi = {
  ask: (query: string, sessionId?: string) =>
    request<BotAskResponse>("/bot/ask", {
      method: "POST",
      body: JSON.stringify({ query, sessionId }),
    }),

  getPublicFaqs: (category?: string) => {
    const qs = category && category !== "ALL" ? `?category=${category}` : "";
    return request<FaqItem[]>(`/bot/faqs${qs}`);
  },
};

export const faqsApi = {
  getAdminFaqs: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ faqs: FaqItem[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/faqs${qs}`);
  },

  create: (payload: Partial<FaqItem>) =>
    request<FaqItem>("/faqs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<FaqItem>) =>
    request<FaqItem>(`/faqs/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    request(`/faqs/${id}`, {
      method: "DELETE",
    }),

  testMatcher: (query: string) =>
    request<{
      status: string;
      confidence: number;
      matchedFaq: FaqItem | null;
      clarificationOptions: Array<{ faqId: string; question: string; score?: number }>;
      language: string;
    }>("/faqs/test", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  getUnanswered: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ unanswered: Array<{ _id: string; query: string; detectedLanguage: string; status: string; confidence: number; createdAt: string }>; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/faqs/unanswered${qs}`);
  },

  getAnalytics: () => request<BotAnalytics>("/faqs/analytics"),
};

// ==========================================
// AUDIT LOGS API
// ==========================================
export const auditApi = {
  getLogs: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ logs: AuditLogItem[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/audit${qs}`);
  },
};

// ==========================================
// SCHEMES API
// ==========================================
export const schemesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ schemes: SchemeItem[]; pagination: unknown }>(`/schemes${qs}`);
  },

  getById: (id: string) => request<SchemeItem>(`/schemes/${id}`),

  create: (payload: Record<string, unknown>) =>
    request<SchemeItem>("/schemes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ==========================================
// EVENTS API
// ==========================================
export const eventsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<Array<{ _id: string; title: string; eventDate: string; venue: string }>>(`/events${qs}`);
  },

  getById: (id: string) => request(`/events/${id}`),

  create: (payload: Record<string, unknown>) =>
    request("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ==========================================
// CONTACT API
// ==========================================
export const contactApi = {
  submit: (payload: Record<string, unknown>) =>
    request<{ id: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ==========================================
// NOTIFICATIONS API
// ==========================================
export const notificationsApi = {
  getMy: () =>
    request<{ notifications: unknown[]; unreadCount: number }>("/notifications"),

  markAsRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllAsRead: () => request("/notifications/read-all", { method: "PATCH" }),
};

// ==========================================
// UPLOADS API
// ==========================================
export const uploadsApi = {
  uploadFile: (formData: FormData) =>
    request<{ assetId: string; url: string; publicId: string }>("/uploads", {
      method: "POST",
      body: formData,
    }),

  getStatus: () =>
    request<{ configured: boolean; maxFileSize: string; supportedFormats: string[] }>(
      "/uploads/status"
    ),
};
