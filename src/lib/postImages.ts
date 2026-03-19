export const MAX_POST_IMAGES = 4;
export const MAX_POST_IMAGE_SIZE_MB = 8;
const MAX_POST_IMAGE_EDGE = 1200;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const optimizeImageFile = async (file: File) => {
  const sourceUrl = await fileToDataUrl(file);

  try {
    const image = await loadImage(sourceUrl);
    const longestEdge = Math.max(image.naturalWidth, image.naturalHeight);
    const scale = Math.min(1, MAX_POST_IMAGE_EDGE / longestEdge);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return sourceUrl;
    }

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/webp", 0.78);
  } catch {
    return sourceUrl;
  }
};

export const preparePostImageUrls = async (
  files: FileList | null,
  existingCount: number,
) => {
  if (!files?.length) {
    return {
      imageUrls: [],
      error: null as string | null,
    };
  }

  const remainingSlots = Math.max(MAX_POST_IMAGES - existingCount, 0);
  if (remainingSlots === 0) {
    return {
      imageUrls: [],
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

  const imageUrls = await Promise.all(validFiles.map(optimizeImageFile));

  if (selectedFiles.length > filesToProcess.length) {
    skippedMessages.push(
      `Only the first ${MAX_POST_IMAGES} images were kept for this post.`,
    );
  }

  return {
    imageUrls,
    error: skippedMessages[0] ?? null,
  };
};
