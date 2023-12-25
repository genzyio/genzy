import { type FC, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryClientProvider: FC<PropsWithChildren> = ({ children }) => {
  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
};
