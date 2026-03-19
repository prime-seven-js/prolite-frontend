import { useRef } from "react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_POST_IMAGES } from "@/lib/postImages";

interface ImagePickerProps {
  imageCount: number;
  onImageSelect: (files: FileList | null) => void;
  iconClassName?: string;
}

export function ImagePicker({
  imageCount,
  onImageSelect,
  iconClassName = "h-4.5 w-4.5",
}: ImagePickerProps) {
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
