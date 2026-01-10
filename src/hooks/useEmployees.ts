import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type {
  Employee,
  CreateEmployee,
  UpdateEmployee,
} from "@/types/api/employee";
import { removeEmptyStrings } from "@/helpers/payload";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Employee[]>("/employees");
      console.log(response);
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch employees"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createEmployee = async (data: CreateEmployee) => {
    setError(null);
    try {
      const response = await apiClient.post<Employee>("/employees", data);
      if (response.success && response.data) {
        await fetchEmployees();
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
        `/employees/${id}`,
        removeEmptyStrings(data)
      );
      if (response.success && response.data) {
        await fetchEmployees();
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
      await apiClient.delete(`/employees/${id}`);
      await fetchEmployees();
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
      const response = await apiClient.get<Employee>(`/employees/${id}`);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch employee");
      return null;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
  };
}
