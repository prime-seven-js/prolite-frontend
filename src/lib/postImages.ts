import { supabase } from "@/lib/supabase";

export const MAX_POST_IMAGES = 4;
export const MAX_POST_IMAGE_SIZE_MB = 8;
export const POST_IMAGES_BUCKET = "posts_images";

export interface DraftPostImage {
  file: File;
  previewUrl: string;
}

const getFileExtension = (file: File) => {
  const fileNameExtension = file.name.split(".").pop()?.trim().toLowerCase();
  if (fileNameExtension) return fileNameExtension;

  const mimeExtension = file.type.split("/").pop()?.trim().toLowerCase();
  return mimeExtension || "jpg";
};

const buildPostImagePath = (userId: string, file: File) => {
  const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "-");
  const extension = getFileExtension(file);

  return `${sanitizedUserId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
};

export const preparePostImages = async (
  files: FileList | null,
  existingCount: number,
) => {
  if (!files?.length) {
    return {
      images: [] as DraftPostImage[],
      error: null as string | null,
    };
  }

  const remainingSlots = Math.max(MAX_POST_IMAGES - existingCount, 0);
  if (remainingSlots === 0) {
    return {
      images: [] as DraftPostImage[],
      error: `You can add up to ${MAX_POST_IMAGES} images per post.`,
    };
  }

  const selectedFiles = Array.from(files);
  const filesToProcess = selectedFiles.slice(0, remainingSlots);
  const skippedMessages: string[] = [];

  const validFiles = filesToProcess.filter((file) => {
    if (!file.type.startsWith("image/")) {
      skippedMessages.push(`${file.name} is not an image file.`);
      return false;
    }

    if (file.size > MAX_POST_IMAGE_SIZE_MB * 1024 * 1024) {
      skippedMessages.push(
        `${file.name} is larger than ${MAX_POST_IMAGE_SIZE_MB}MB.`,
      );
      return false;
    }

    return true;
  });

  const images = validFiles.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file),
  }));

  if (selectedFiles.length > filesToProcess.length) {
    skippedMessages.push(
      `Only the first ${MAX_POST_IMAGES} images were kept for this post.`,
    );
  }

  return {
    images,
    error: skippedMessages[0] ?? null,
  };
};

export const uploadPostImages = async (
  userId: string,
  images: DraftPostImage[],
) => {
  const imageUrls: string[] = [];
  const uploadedPaths: string[] = [];

  try {
    for (const image of images) {
      const path = buildPostImagePath(userId, image.file);
      const { error: uploadError } = await supabase.storage
        .from("posts_images")
        .upload(path, image.file, {
          cacheControl: "3600",
          contentType: image.file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedPaths.push(path);
      const {
        data: { publicUrl },
      } = supabase.storage.from(POST_IMAGES_BUCKET).getPublicUrl(path);
      imageUrls.push(publicUrl);
    }

    return {
      imageUrls,
      uploadedPaths,
    };
  } catch (error) {
    await removeUploadedPostImages(uploadedPaths);
    throw error;
  }
};

export const removeUploadedPostImages = async (paths: string[]) => {
  if (paths.length === 0) return;
  await supabase.storage.from(POST_IMAGES_BUCKET).remove(paths);
};

export const revokeDraftPostImages = (images: DraftPostImage[]) => {
  images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
};
