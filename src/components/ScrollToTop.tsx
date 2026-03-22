import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop — tự động scroll lên đầu trang khi thay đổi route.
 * Đặt trong BrowserRouter, trước Routes.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
