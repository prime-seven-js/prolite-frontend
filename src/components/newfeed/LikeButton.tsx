import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  liked: boolean;
  likes: number;
  loading: boolean;
  animating: boolean;
  onClick: () => void;
}

export function LikeButton({ liked, likes, loading, animating, onClick }: LikeButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={onClick}
      className="gap-1.5 rounded-full hover:bg-pink-500/10 text-gray-600 px-2"
    >
      <Heart
        className={`w-4.5 h-4.5 transition-colors ${liked
            ? "fill-pink-500 text-pink-500"
            : "text-gray-600 group-hover:text-pink-400"
          } ${animating ? "animate-like-bounce" : ""}`}
      />
      <span
        className={`text-xs transition-colors ${liked
            ? "text-pink-500"
            : "text-gray-600 group-hover:text-pink-400"
          }`}
      >
        {likes}
      </span>
    </Button>
  );
}
