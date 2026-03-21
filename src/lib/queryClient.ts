import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient singleton — cấu hình mặc định cho toàn bộ app.
 * - staleTime: 30s → data được coi là "fresh" trong 30s, tránh refetch thừa
 * - retry: 1     → chỉ thử lại 1 lần khi request fail
 * - refetchOnWindowFocus: false → không auto refetch khi user quay lại tab
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
