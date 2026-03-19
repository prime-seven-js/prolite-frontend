export function timeAgo(dateString: string) {
  const date = new Date(dateString);
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
