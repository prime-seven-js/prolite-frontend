// Lib
import { timeAgo } from "@/lib/converttime";
// Type
import type { PostHeaderProps } from "@/types/newfeedspage";

export function PostHeader({ username, timestamp, size = "base" }: PostHeaderProps) {
  const isSmall = size === "sm";
  // Username + Time
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className={`font-semibold truncate ${isSmall ? "text-sm" : "text-[15px]"}`}
      >
        @{username}
      </span>
      <span className={`text-gray-600 ${isSmall ? "text-xs" : "text-sm"}`}>
        ·
      </span>
      <span
        className={`text-gray-500 shrink-0 ${isSmall ? "text-xs" : "text-sm"}`}
      >
        {timeAgo(timestamp)}
      </span>
    </div>
  );
}
