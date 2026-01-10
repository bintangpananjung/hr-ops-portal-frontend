import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { Attendance } from "@/types/api/attendance";

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
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendances = async () => {
    if (!employeeId) return;

    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const queryString = params.toString();
      const url = `/attendances/employee/${employeeId}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get<Attendance[]>(url);
      if (response.success && response.data) {
        setAttendances(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch attendances"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, [employeeId, startDate, endDate]);

  return {
    attendances,
    isLoading,
    error,
    refetch: fetchAttendances,
  };
}
