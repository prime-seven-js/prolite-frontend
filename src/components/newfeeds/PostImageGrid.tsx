import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { DotIndicator } from "@/components/newfeeds/DotIndicator";
import type { PostImageGridProps } from "@/types/newfeedspage";

/**
 * Khuôn ảnh của các bài posts (Shout out to Codex =))).
 */

// Tách chiều cao slider theo ngữ cảnh dùng lại để tránh lặp class Tailwind dài.
const getSliderHeightClassName = (variant: "feed" | "composer") =>
  variant === "composer" ? "h-[240px] sm:h-[280px]" : "h-[360px] sm:h-[440px]";

export function PostImageGrid({
  imageUrls,
  className = "",
  variant = "feed",
  onRemoveImage,
}: PostImageGridProps) {
  const canOpenLightbox = variant === "feed";
  // React Hook
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const closeLightbox = async () => {
    // Khi đóng lightbox thì thoát luôn fullscreen nếu đang bật,
    // để trạng thái UI luôn đồng bộ giữa modal và trình duyệt.
    setIsLightboxOpen(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    // Nếu số ảnh giảm đi sau khi xóa ảnh, đảm bảo activeIndex không bị vượt mảng.
    setActiveIndex((currentIndex) => {
      if (imageUrls.length === 0) return 0;
      return Math.min(currentIndex, imageUrls.length - 1);
    });
  }, [imageUrls.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    // Khóa scroll nền khi lightbox mở và hỗ trợ điều hướng bằng bàn phím.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") void closeLightbox();
      if (imageUrls.length <= 1) return;
      if (event.key === "ArrowLeft")
        setActiveIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
      if (event.key === "ArrowRight")
        setActiveIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageUrls.length, isLightboxOpen, closeLightbox]);

  useEffect(() => {
    if (!isLightboxOpen || !canOpenLightbox) return;
    const lightboxElement = lightboxRef.current;
    if (!lightboxElement) return;
    // Theo dõi trạng thái fullscreen để khi người dùng tự thoát fullscreen
    // thì lightbox cũng đóng theo, tránh lệch state.
    const syncWithFullscreen = () => {
      if (!document.fullscreenElement) setIsLightboxOpen(false);
    };
    document.addEventListener("fullscreenchange", syncWithFullscreen);
    if (!document.fullscreenElement && lightboxElement.requestFullscreen) {
      void lightboxElement.requestFullscreen().catch(() => {});
    }
    return () => {
      document.removeEventListener("fullscreenchange", syncWithFullscreen);
    };
  }, [canOpenLightbox, isLightboxOpen]);

  if (imageUrls.length === 0) return null;
  const hasMultipleImages = imageUrls.length > 1;
  const goToPrevious = () =>
    setActiveIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
  const goToNext = () =>
    setActiveIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));
  const openLightbox = (index: number) => {
    if (!canOpenLightbox) return;
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div
        className={`mt-3 overflow-hidden rounded-[26px] border border-white/8 bg-[#071320] ${className}`}
      >
        <div
          className={`group relative overflow-hidden bg-[#091727] ${getSliderHeightClassName(variant)}`}
        >
          {/* Dùng translateX để tạo hiệu ứng slider, mỗi ảnh chiếm đúng 100% chiều rộng. */}
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative h-full min-w-full">
                {canOpenLightbox ? (
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="h-full w-full cursor-zoom-in"
                    aria-label={`Open image ${index + 1} in full size`}
                  >
                    <PostImage
                      src={imageUrl}
                      index={index}
                      className="object-cover"
                    />
                  </button>
                ) : (
                  <PostImage
                    src={imageUrl}
                    index={index}
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {hasMultipleImages && (
            <>
              <NavArrow direction="left" onClick={goToPrevious} />
              <NavArrow direction="right" onClick={goToNext} />
            </>
          )}

          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
            {activeIndex + 1}/{imageUrls.length}
          </div>

          {onRemoveImage && (
            <button
              type="button"
              onClick={() => onRemoveImage(activeIndex)}
              className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
              aria-label={`Remove image ${activeIndex + 1}`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasMultipleImages && (
          <div className="flex items-center justify-center gap-2 bg-[#071320] px-4 py-3">
            <DotIndicator
              count={imageUrls.length}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-90 bg-black"
          onClick={() => void closeLightbox()}
        >
          <button
            type="button"
            onClick={() => void closeLightbox()}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close image preview"
          >
            <X className="h-5 w-5" />
          </button>

          {hasMultipleImages && (
            <>
              <LightboxArrow direction="left" onClick={goToPrevious} />
              <LightboxArrow direction="right" onClick={goToNext} />
            </>
          )}

          <div
            className="relative flex h-screen w-screen items-center justify-center p-4 sm:p-8"
            // Chặn click nổi bọt để click vào ảnh không làm đóng lightbox.
            onClick={(e) => e.stopPropagation()}
          >
            <PostImage
              src={imageUrls[activeIndex]}
              index={activeIndex}
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/45 px-4 py-2 text-sm text-white">
            <span>
              {activeIndex + 1}/{imageUrls.length}
            </span>
            {hasMultipleImages && (
              <DotIndicator
                count={imageUrls.length}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                inactiveDotColor="bg-white/35 hover:bg-white/55"
                stopPropagation
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

// --- Small helper sub-components (private to this file) ---

function NavArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute ${isLeft ? "left-3" : "right-3"} top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-100 transition hover:bg-black/65 sm:opacity-0 sm:group-hover:opacity-100`}
      aria-label={`${isLeft ? "Previous" : "Next"} image`}
    >
      {isLeft ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  );
}

function LightboxArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={(e) => {
        // Không cho click vào nút điều hướng làm trigger đóng lightbox ở lớp cha.
        e.stopPropagation();
        onClick();
      }}
      className={`absolute ${isLeft ? "left-4" : "right-4"} top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20`}
      aria-label={`${isLeft ? "Previous" : "Next"} image`}
    >
      {isLeft ? (
        <ChevronLeft className="h-6 w-6" />
      ) : (
        <ChevronRight className="h-6 w-6" />
      )}
    </button>
  );
}

function PostImage({
  src,
  index,
  className,
}: {
  src: string;
  index: number;
  className: string;
}) {
  return (
    <img
      src={src}
      alt={`Post attachment ${index + 1}`}
      className={`h-full w-full ${className}`}
      // lazy + async giúp giảm chi phí tải ảnh trong feed dài.
      loading="lazy"
      decoding="async"
    />
  );
}
