import { useState } from "react";
import { useSWRService } from "@/services/swr";
import { apiClient } from "@/lib/api-client";
import type { Attendance } from "@/types/api/attendance";
import { WorkMode } from "@/types/api/attendance";
import type { UploadDto } from "@/types/api/upload";
import { API_ENDPOINTS } from "@/constants/api";

interface UseAttendanceOptions {
  userId?: string;
}

export function useAttendance(options: UseAttendanceOptions = {}) {
  const { userId } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: todayAttendance, mutate } = useSWRService<Attendance | null>(
    API_ENDPOINTS.ATTENDANCES.CURRENT_TODAY,
    {
      onError: (err: any) => {
        if (err?.response?.status !== 404) {
          console.error("Error fetching today's attendance:", err);
        }
      },
    }
  );

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await apiClient.uploadFile<UploadDto>(
      API_ENDPOINTS.UPLOAD.PHOTO,
      formData
    );

    return uploadResponse.data.url;
  };

  const clockIn = async (file: File, workMode: WorkMode) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    setIsLoading(true);
    setError("");

    try {
      const photoUrl = await uploadPhoto(file);

      const attendanceResponse = await apiClient.post<Attendance>(
        API_ENDPOINTS.ATTENDANCES.CREATE,
        {
          employeeId: userId,
          date: new Date().toISOString(),
          workMode,
          checkInPhoto: photoUrl,
          checkIn: new Date().toISOString(),
        }
      );

      await mutate(attendanceResponse.data);
      return attendanceResponse.data;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to clock in";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clockOut = async (file: File, workMode: WorkMode) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    setIsLoading(true);
    setError("");

    try {
      const photoUrl = await uploadPhoto(file);

      const attendanceResponse = await apiClient.post<Attendance>(
        API_ENDPOINTS.ATTENDANCES.CREATE,
        {
          employeeId: userId,
          date: new Date().toISOString(),
          checkOut: new Date().toISOString(),
          workMode,
          checkOutPhoto: photoUrl,
        }
      );

      await mutate(attendanceResponse.data);
      return attendanceResponse.data;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to clock out";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const hasCheckedIn = !!todayAttendance?.checkIn;
  const hasCheckedOut = !!todayAttendance?.checkOut;

  return {
    todayAttendance: todayAttendance ?? null,
    isLoading,
    error,
    setError,
    clockIn,
    clockOut,
    hasCheckedIn,
    hasCheckedOut,
    refetch: mutate,
  };
}
