import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import { apiClient } from "@/lib/api-client";

const defaultFetcher = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  if (response.success && response.data !== undefined) {
    return response.data;
  }
  throw new Error((response as any).message || "Failed to fetch data");
};

export const useSWRService = <T>(
  key: string | null,
  config?: SWRConfiguration<T>
): SWRResponse<T, Error> => {
  return useSWR<T, Error>(key, defaultFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...config,
  });
};
