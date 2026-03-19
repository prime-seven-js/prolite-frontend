import { useEffect } from "react";

// Custom hook gom pattern "fetch data khi component mount"
// Thay thế useEffect fetch đang lặp ở nhiều page
export function useInitData(...fetchers: (() => Promise<void>)[]) {
  useEffect(() => {
    fetchers.forEach((f) => f().catch(console.error));
  }, fetchers);
}
