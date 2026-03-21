import { useRef } from "react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_POST_IMAGES } from "@/lib/postImages";
import type { ImagePickerProps } from "@/types/newfeedspage";

/**
 * Nút chọn đăng tải ảnh.
 * Lib:
 * - MAX_POST_IMAGES (postImages) → Giới hạn số ảnh có thể đăng tải. 
 * React Hooks:
 * - useRef() → Giữ cho component bị re-render.
 */

export function ImagePicker({
  imageCount,
  onImageSelect,
  iconClassName = "h-4.5 w-4.5",
}: ImagePickerProps) {
  // Khiến các ảnh ở input không bị re-render.
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onImageSelect(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      <Button
        variant="ghost"
        size="icon-sm"
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="rounded-lg text-gray-500 hover:bg-[#2496d4]/10 hover:text-[#63d4f7]"
      >
        <Image className={iconClassName} />
      </Button>

      <span className="text-xs text-gray-500">
        {imageCount}/{MAX_POST_IMAGES} images
      </span>
    </>
  );
}
