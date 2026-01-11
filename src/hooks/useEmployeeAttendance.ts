import { useSWRService } from "@/services/swr";
import type { Attendance } from "@/types/api/attendance";
import { API_ENDPOINTS } from "@/constants/api";

interface UseEmployeeAttendanceProps {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export function useEmployeeAttendance({
  employeeId,
  startDate,
  endDate,
}: UseEmployeeAttendanceProps = {}) {
  const getSwrKey = () => {
    if (!employeeId) return null;

    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    const baseUrl = API_ENDPOINTS.ATTENDANCES.BY_EMPLOYEE(employeeId);
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const {
    data: attendances,
    isLoading,
    error,
    mutate,
  } = useSWRService<Attendance[]>(getSwrKey());

  return {
    attendances: attendances || [],
    isLoading,
    error: error?.message || null,
    refetch: mutate,
  };
}
