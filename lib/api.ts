/**
 * Centralized API Client for Jan Connect
 * Provides typed request/response methods for frontend-to-backend communication.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

export interface NoticeItem {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  noticeType?: string;
  publishedAt?: string;
  isImportant?: boolean;
  status?: string;
  attachmentUrl?: string;
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
  status?: string;
  createdAt?: string;
}

export interface ContactMessagePayload {
  name: string;
  mobile: string;
  email?: string;
  subject: string;
  message: string;
}

export interface CitizenRegistrationPayload {
  fullName: string;
  mobile: string;
  alternateMobile?: string;
  dateOfBirth?: string;
  gender?: string;
  occupation?: string;
  email?: string;
  preferredLanguage?: string;
  address: string;
  villageMohalla: string;
  wardNumber?: string;
  boothNumber?: string;
  district: string;
  assemblyConstituency: string;
  pincode: string;
  gpsLocation?: string;
  familyId?: string;
  emergencyContact: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Include cookies for session/HttpOnly token authentication
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `HTTP ${res.status}: Request failed`,
        errors: data.errors,
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Network error: Unable to connect to server",
    };
  }
}

// ==========================================
// AUTH API
// ==========================================
export const authApi = {
  sendCitizenOtp: (mobile: string) =>
    request<{ expiresAt: string }>("/api/auth/citizen/send-otp", {
      method: "POST",
      body: JSON.stringify({ mobile }),
    }),

  verifyCitizenOtp: (mobile: string, otp: string) =>
    request<{ user: unknown; token?: string }>("/api/auth/citizen/verify-otp", {
      method: "POST",
      body: JSON.stringify({ mobile, otp }),
    }),

  politicianLogin: (identifier: string, password: string) =>
    request<{ user: unknown }>("/api/auth/politician/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),

  staffLogin: (identifier: string, password: string) =>
    request<{ user: unknown }>("/api/auth/staff/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),

  boothWorkerLogin: (identifier: string, password: string) =>
    request<{ user: unknown }>("/api/auth/booth-worker/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),

  logout: () =>
    request("/api/auth/logout", {
      method: "POST",
    }),

  getMe: () => request<{ user: unknown }>("/api/auth/me"),
};

// ==========================================
// NOTICES API
// ==========================================
export const noticesApi = {
  getAll: (params?: { category?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<{ notices: NoticeItem[]; total: number }>(`/api/notices${qs}`);
  },

  getById: (id: string) =>
    request<{ notice: NoticeItem }>(`/api/notices/${id}`),
};

// ==========================================
// SCHEMES API
// ==========================================
export const schemesApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<{ schemes: SchemeItem[]; total: number }>(`/api/schemes${qs}`);
  },

  getById: (id: string) =>
    request<{ scheme: SchemeItem }>(`/api/schemes/${id}`),
};

// ==========================================
// CONTACT API
// ==========================================
export const contactApi = {
  sendMessage: (payload: ContactMessagePayload) =>
    request<{ messageId: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ==========================================
// USERS / REGISTRATION API
// ==========================================
export const userApi = {
  registerCitizen: (payload: CitizenRegistrationPayload) =>
    request<{ userId: string }>("/api/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getProfile: () => request<{ profile: unknown }>("/api/users/profile"),
};
