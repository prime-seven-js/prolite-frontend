/**
 * Convertime Utilities
 * - timeAgo → Now - CreatedAt
 * - formatToVNDate → Format CreatedAt sang VN rồi lấy thời gian theo format DD/MM/YYYY
 */

export function timeAgo(dateString: string) {
  const date = new Date(dateString + "Z");

  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (Number.isNaN(diffInSeconds) || diffInSeconds < 0) {
    return "just now";
  }

  const intervals = [
    { label: "year", seconds: 60 * 60 * 24 * 365 },
    { label: "month", seconds: 60 * 60 * 24 * 30 },
    { label: "day", seconds: 60 * 60 * 24 },
    { label: "hour", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const value = Math.floor(diffInSeconds / interval.seconds);

    if (value >= 1) {
      return `${value} ${interval.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function formatToVNDate(dateString: string) {
  const date = new Date(dateString);

  // Cộng thêm 7 tiếng (UTC+7)
  const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const day = String(vnDate.getDate()).padStart(2, "0");
  const month = String(vnDate.getMonth() + 1).padStart(2, "0");
  const year = vnDate.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatTimeOnly(dateString: string) {
  const date = new Date(dateString + "Z");
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatMessageTimestamp(dateString: string) {
  const date = new Date(dateString + "Z");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
