import { useState } from "react";
import { useSWRService } from "@/services/swr";
import { apiClient } from "@/lib/api-client";
import type {
  Employee,
  CreateEmployee,
  UpdateEmployee,
} from "@/types/api/employee";
import { removeEmptyStrings } from "@/helpers/payload";
import { API_ENDPOINTS } from "@/constants/api";

export function useEmployees() {
  const [error, setError] = useState<string | null>(null);

  const {
    data: employees,
    isLoading,
    mutate,
  } = useSWRService<Employee[]>(API_ENDPOINTS.EMPLOYEES.LIST);

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
      const response = await apiClient.get<Employee>(
        API_ENDPOINTS.EMPLOYEES.DETAIL(id)
      );
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch employee");
      return null;
    }
  };

  return {
    employees: employees || [],
    isLoading,
    error,
    fetchEmployees: mutate,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
  };
}
