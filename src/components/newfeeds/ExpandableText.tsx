import { useState, useMemo } from "react";

/**
 * ExpandableText — hiển thị nội dung text với "See more/See less"
 * khi vượt quá wordLimit (mặc định 200 từ).
 */

interface ExpandableTextProps {
  content: string;
  wordLimit?: number;
  className?: string;
}

export function ExpandableText({
  content,
  wordLimit = 200,
  className = "",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  // Tách từ và kiểm tra có cần truncate không
  const { truncatedText, isTruncated } = useMemo(() => {
    const words = content.split(/\s+/);
    if (words.length <= wordLimit) {
      return { truncatedText: content, isTruncated: false };
    }
    return {
      truncatedText: words.slice(0, wordLimit).join(" ") + "...",
      isTruncated: true,
    };
  }, [content, wordLimit]);

  return (
    <p className={className}>
      {expanded || !isTruncated ? content : truncatedText}
      {isTruncated && (
        <>
          {" "}
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[#63d4f7] hover:text-[#8dd8f8] text-sm font-medium cursor-pointer transition-colors inline"
          >
            {expanded ? "See less" : "See more"}
          </button>
        </>
      )}
    </p>
  );
}
