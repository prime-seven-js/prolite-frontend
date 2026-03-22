import { useEffect, useRef, useState } from "react";
import {
  preparePostImages,
  revokeDraftPostImages,
  type DraftPostImage,
} from "@/lib/postImages";

/**
 * useDraftImages — custom hook quản lý draft images cho post composer.
 *
 * Quản lý: state images, imageError, refs cho cleanup.
 * Cung cấp: appendImages, removeImage, clearImages.
 * Tự động revoke blob URLs khi unmount (tránh memory leak).
 *
 * Sử dụng: gọi 2 lần trong NewFeedsPage (main composer + modal).
 */
export function useDraftImages() {
  const [images, setImages] = useState<DraftPostImage[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const imagesRef = useRef<DraftPostImage[]>([]);

  // Sync ref với state để cleanup trong useEffect có data mới nhất
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Cleanup: revoke tất cả blob URLs khi unmount
  useEffect(
    () => () => {
      revokeDraftPostImages(imagesRef.current);
    },
    [],
  );

  /** Thêm ảnh mới vào draft (validate + tạo preview) */
  const appendImages = async (files: FileList | null) => {
    const { images: newImages, error } = await preparePostImages(
      files,
      images.length,
    );
    if (newImages.length > 0) {
      setImages((current) => [...current, ...newImages]);
    }
    setImageError(error);
  };

  /** Xóa 1 ảnh khỏi draft theo index, revoke blob URL */
  const removeImage = (index: number) => {
    setImages((current) => {
      const imageToRemove = current[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      return current.filter((_, i) => i !== index);
    });
    setImageError(null);
  };

  /** Clear tất cả ảnh, revoke blob URLs */
  const clearImages = () => {
    revokeDraftPostImages(images);
    setImages([]);
    setImageError(null);
  };

  return {
    images,
    imageError,
    /** Danh sách preview URLs cho UI */
    previewUrls: images.map((img) => img.previewUrl),
    appendImages,
    removeImage,
    clearImages,
  };
}
