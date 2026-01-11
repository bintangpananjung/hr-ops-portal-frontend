import { useMemo } from "react";
import type { Attendance } from "@/types/api/attendance";
import { API_ENDPOINTS } from "@/constants/api";
import type { PaginatedResponse } from "@/types/pagination";
import { apiClient } from "@/lib/api-client";
import useSWR from "swr";

interface UseEmployeeAttendanceProps {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export function useEmployeeAttendance({
  employeeId,
  startDate,
  endDate,
  page = 1,
  limit = 10,
}: UseEmployeeAttendanceProps = {}) {
  const swrKey = useMemo(() => {
    if (!employeeId) return null;

    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const baseUrl = API_ENDPOINTS.ATTENDANCES.BY_EMPLOYEE(employeeId);
    return `${baseUrl}?${params.toString()}`;
  }, [employeeId, startDate, endDate, page, limit]);

  const paginatedFetcher = async (
    url: string
  ): Promise<PaginatedResponse<Attendance>> => {
    const result = await apiClient.get<Attendance[]>(url);
    if (result.success) {
      return result as unknown as PaginatedResponse<Attendance>;
    }
    throw new Error(result.message || "Failed to fetch attendances");
  };

  const {
    data: response,
    isLoading,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Attendance>>(swrKey, paginatedFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    attendances: response?.data || [],
    meta: response?.meta,
    isLoading,
    error: error?.message || null,
    refetch: mutate,
  };
}
