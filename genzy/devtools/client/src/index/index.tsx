import { type FC } from "react";
import { QueryClientProvider } from "./providers/query-client";
import { RouterProvider } from "./providers/router";
import { ToastProvider } from "./providers/toast";

export const Index: FC = () => {
  return (
    <>
      <QueryClientProvider>
        <RouterProvider />
      </QueryClientProvider>

      <ToastProvider />
    </>
  );
};
