import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";

interface SWRProviderProps {
  children: ReactNode;
}

const SWRContext = createContext<undefined>(undefined);

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        onError: (error) => {
          console.error("SWR Error:", error);
        },
      }}
    >
      <SWRContext.Provider value={undefined}>{children}</SWRContext.Provider>
    </SWRConfig>
  );
}

export function useSWRContext() {
  const context = useContext(SWRContext);
  return context;
}
