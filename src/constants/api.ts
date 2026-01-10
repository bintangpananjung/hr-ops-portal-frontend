export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    CURRENT: "/auth/current",
  },
  EMPLOYEES: {
    LIST: "/employees",
    CREATE: "/employees",
    DETAIL: (id: string) => `/employees/${id}`,
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
  },
  ATTENDANCES: {
    CREATE: "/attendances",
    ALL: "/attendances/all",
    CURRENT: "/attendances/current",
    CURRENT_TODAY: "/attendances/current/today",
    BY_EMPLOYEE: (employeeId: string) => `/attendances/employee/${employeeId}`,
    UPDATE: (id: string) => `/attendances/${id}`,
    DELETE: (id: string) => `/attendances/${id}`,
  },
  UPLOAD: {
    PHOTO: "/upload/photo",
  },
} as const;
