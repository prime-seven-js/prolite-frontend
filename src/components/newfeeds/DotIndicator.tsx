import type { DotIndicatorProps } from "@/types/newfeedspage";

/**
 * Các nút cho biết vị trí của ảnh khi đăng tải nhiều ảnh.
 */

export function DotIndicator({
  count,
  activeIndex,
  onSelect,
  activeDotColor = "bg-[#63d4f7]",
  inactiveDotColor = "bg-white/25 hover:bg-white/45",
  stopPropagation = false,
}: DotIndicatorProps) {
  // Nếu chỉ có 1 ảnh thì không xuất hiện
  if (count <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={(e) => {
            if (stopPropagation) e.stopPropagation();
            onSelect(index);
          }}
          className={`h-2 rounded-full transition-all ${
            index === activeIndex
              ? `w-6 ${activeDotColor}`
              : `w-2 ${inactiveDotColor}`
          }`}
          aria-label={`Go to image ${index + 1}`}
        />
      ))}
    </div>
  );
}
