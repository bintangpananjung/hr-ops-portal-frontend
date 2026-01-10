import { API_BASE_URL } from "@/constants/api";
import type { BaseResponse } from "@/types/api/common";
import { ACCESS_TOKEN_KEY } from "@/constants/auth";

export class ApiClient {
  baseUrl: string;
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request<T, B = unknown>(
    url: string,
    method: string,
    body?: B
  ): Promise<T> {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return response.json() as Promise<T>;
  }

  get<T>(url: string) {
    return this.request<BaseResponse<T>>(url, "GET");
  }

  post<T>(url: string, body: object) {
    return this.request<BaseResponse<T>>(url, "POST", body);
  }

  update<T>(url: string, body: object) {
    return this.request<BaseResponse<T>>(url, "PUT", body);
  }

  delete<T>(url: string) {
    return this.request<BaseResponse<T>>(url, "DELETE");
  }

  async uploadFile<T>(
    url: string,
    formData: FormData
  ): Promise<BaseResponse<T>> {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const headers: HeadersInit = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return response.json() as Promise<BaseResponse<T>>;
  }
}

export const apiClient = new ApiClient();
