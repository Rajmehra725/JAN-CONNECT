/**
 * Centralized API Client for Jan Connect
 * Provides typed request/response methods for frontend-to-backend communication.
 * Supports environment variable configuration via NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL.
 */

function cleanBase(url?: string): string {
  if (!url) return "";
  return url.trim().replace(/\/+$/, "");
}

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? `${cleanBase(process.env.NEXT_PUBLIC_API_URL)}/api/v1`
    : "https://jan-connect-backend.onrender.com/api/v1");

const V1 = cleanBase(RAW_BASE);

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
  address?: string;
  villageMohalla?: string;
  wardNumber?: string;
  boothNumber?: string;
  district?: string;
  assemblyConstituency?: string;
  pincode?: string;
  constituencyId?: { _id: string; name: string; code?: string };
  wardId?: { _id: string; name?: string; wardNumber: string };
  boothId?: { _id: string; name?: string; boothNumber: string };
  createdAt?: string;
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
  complaints: {
    total: number;
    submitted: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  };
  users: {
    citizens: number;
    boothWorkers: number;
    staff: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
  todayAttendance: number;
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
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${V1}${cleanEndpoint}`;
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
    return request<{ complaints: ComplaintItem[]; pagination: unknown }>(
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

  updateStatus: (id: string, status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED") =>
    request<{ user: UserProfile }>(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ==========================================
// GEOGRAPHY API
// ==========================================
export const geographyApi = {
  getConstituencies: () => request<Array<{ _id: string; name: string; district: string; state: string }>>("/geography/constituencies"),

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
// REPORTS & SUMMARY API
// ==========================================
export const reportsApi = {
  getSummary: () => request<DashboardSummary>("/reports/summary"),

  getExportUrl: () => `${V1}/reports/export/complaints`,
};

// ==========================================
// NOTICES API
// ==========================================
export const noticesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ notices: NoticeItem[]; pagination: unknown }>(`/notices${qs}`);
  },

  getById: (id: string) => request<NoticeItem>(`/notices/${id}`),

  create: (payload: Record<string, unknown>) =>
    request<NoticeItem>("/notices", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
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
