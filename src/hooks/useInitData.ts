import { useEffect, useRef } from "react";

// Custom hook gom pattern "fetch data khi component mount"
// Thay thế useEffect fetch đang lặp ở nhiều page
export function useInitData(...fetchers: (() => Promise<void>)[]) {
  const fetchersRef = useRef(fetchers);
  fetchersRef.current = fetchers;

  useEffect(() => {
    fetchersRef.current.forEach((f) => f().catch(console.error));
  }, []);
}
