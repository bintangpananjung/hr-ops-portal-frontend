import { useState, useMemo } from "react";
import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import type {
  Employee,
  CreateEmployee,
  UpdateEmployee,
} from "@/types/api/employee";
import { removeEmptyStrings } from "@/helpers/payload";
import { API_ENDPOINTS } from "@/constants/api";
import type { PaginatedResponse } from "@/types/pagination";

export function useEmployees(page: number = 1, limit: number = 10) {
  const [error, setError] = useState<string | null>(null);

  const swrKey = useMemo(
    () => `${API_ENDPOINTS.EMPLOYEES.LIST}?page=${page}&limit=${limit}`,
    [page, limit]
  );

  const paginatedFetcher = async (
    url: string
  ): Promise<PaginatedResponse<Employee>> => {
    const result = await apiClient.get<Employee[]>(url);
    if (result.success) {
      return result as unknown as PaginatedResponse<Employee>;
    }
    throw new Error(result.message || "Failed to fetch employees");
  };

  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<Employee>>(swrKey, paginatedFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const createEmployee = async (data: CreateEmployee) => {
    setError(null);
    try {
      const response = await apiClient.post<Employee>(
        API_ENDPOINTS.EMPLOYEES.CREATE,
        data
      );
      if (response.success && response.data) {
        await mutate();
        return response.data;
      }
      throw new Error(response.message || "Failed to create employee");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create employee";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateEmployee = async (id: string, data: UpdateEmployee) => {
    setError(null);
    try {
      const response = await apiClient.patch<Employee>(
        API_ENDPOINTS.EMPLOYEES.UPDATE(id),
        removeEmptyStrings(data)
      );
      if (response.success && response.data) {
        await mutate();
        return response.data;
      }
      throw new Error(response.message || "Failed to update employee");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update employee";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteEmployee = async (id: string) => {
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id));
      await mutate();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete employee";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getEmployee = async (id: string): Promise<Employee | null> => {
    setError(null);
    try {
      const result = await apiClient.get<Employee>(
        API_ENDPOINTS.EMPLOYEES.DETAIL(id)
      );
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch employee");
      return null;
    }
  };

  return {
    employees: response?.data || [],
    meta: response?.meta,
    isLoading,
    error,
    fetchEmployees: mutate,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
  };
}
