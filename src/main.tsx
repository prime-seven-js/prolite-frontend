import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./index.css";
import App from "./App.tsx";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* QueryClientProvider cung cấp TanStack Query context cho toàn bộ app */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools chỉ hiển thị ở dev mode, giúp debug query cache */}
      {ReactQueryDevtools ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  </StrictMode>,
);
