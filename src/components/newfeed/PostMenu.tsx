// React Hook
import { useState } from "react";
// Icon
import { MoreHorizontal } from "lucide-react";
// Shadcn
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Type
import type { PostMenuProps } from "@/types/newfeedspage";

export function PostMenu({ loading, onDelete }: PostMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      {/* ... */}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setShowMenu(!showMenu)}
        className="rounded-full hover:bg-[#2496d4]/10 text-gray-600 hover:text-[#63d4f7]"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      {/* Menu (Only Delete =))) */}
      {showMenu && (
        <Card className="absolute right-0 top-8 glass-modal border-0 rounded-xl py-1 min-w-35 z-10">
          <Button
            variant="ghost"
            disabled={loading}
            onClick={async () => {
              await onDelete();
              setShowMenu(false);
            }}
            className="w-full justify-start px-4 py-2 h-auto text-sm text-red-400 hover:bg-white/4"
          >
            {loading ? "Deleting..." : "Delete post"}
          </Button>
        </Card>
      )}
    </div>
  );
}
