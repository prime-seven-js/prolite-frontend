import { MessageCircle, Search, Home, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import type { MobileBottomNavProps } from "@/types/pagelayout";

/** 
 * Thanh điều hướng trên điện thoại.
 * Global State:
 * - useAuthStore → Lưu trữ state liên quan đến Auth.
*/

export function MobileBottomNav({
  activePath,
  onOpenComposer,
}: MobileBottomNavProps) {
  // Gọi các phương thức của useAuthStore() và useNavigate().
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  // Kiểm tra hiện tại trang nào đang được chọn.
  const iconClass = (path: string) =>
    activePath === path
      ? "text-[#63d4f7] rounded-full"
      : "text-gray-500 hover:text-gray-300 rounded-full";

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-header z-50 border-t border-white/6">
      <div className="flex items-center justify-around py-2">
        {/* Các mục ở thanh điều hướng */}
        <Button
          variant="ghost"
          size="icon"
          className={iconClass("/")}
          onClick={() => navigate("/")}
        >
          <Home className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={iconClass("/search")}
          onClick={() => navigate("/search")}
        >
          <Search className="w-6 h-6" />
        </Button>
        <Button
          onClick={onOpenComposer}
          className="btn-gradient p-2.5 rounded-full -mt-4 shadow-lg shadow-[#2496d4]/20"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`${iconClass("/messages")} relative`}
          onClick={() => navigate("/messages")}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
}
