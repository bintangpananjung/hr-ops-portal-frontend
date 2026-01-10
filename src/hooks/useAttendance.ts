import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { Attendance } from "@/types/api/attendance";
import { WorkMode } from "@/types/api/attendance";
import type { UploadDto } from "@/types/api/upload";

interface UseAttendanceOptions {
  userId?: string;
}

export function useAttendance(options: UseAttendanceOptions = {}) {
  const { userId } = options;
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodayAttendance = async () => {
    try {
      const response = await apiClient.get<Attendance>(
        "/attendances/current/today"
      );
      if (response.data) {
        setTodayAttendance(response.data);
      }
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        console.error("Error fetching today's attendance:", err);
      }
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await apiClient.uploadFile<UploadDto>(
      "/upload/photo",
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
        "/attendances",
        {
          employeeId: userId,
          date: new Date().toISOString(),
          workMode,
          photoUrl,
          checkIn: new Date().toISOString(),
        }
      );

      setTodayAttendance(attendanceResponse.data);
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
        "/attendances",
        {
          employeeId: userId,
          date: new Date().toISOString(),
          checkOut: new Date().toISOString(),
          workMode,
          photoUrl,
        }
      );

      setTodayAttendance(attendanceResponse.data);
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
    todayAttendance,
    isLoading,
    error,
    setError,
    clockIn,
    clockOut,
    hasCheckedIn,
    hasCheckedOut,
    refetch: fetchTodayAttendance,
  };
}
