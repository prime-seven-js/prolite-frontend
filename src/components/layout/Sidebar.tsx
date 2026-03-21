import { LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import type { SidebarProps } from "@/types/pagelayout";

/**
 * Sidebar cho UI trên màn hình rộng.
 * Global State:
 * - useAuthStore → Lưu trữ state liên quan đến Auth.
 */

export function Sidebar({ navItems, onNewPost }: SidebarProps) {
  // Gọi các phương thức của useAuthStore() và useNavigate(). 
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] py-6 px-3">
      {/* Các mục ở trên Sidebar */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.label}
            onClick={() => navigate(item.path)}
            variant="ghost"
            className={`nav-glow w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl text-[15px] font-medium ${item.active ? "active" : "text-gray-400"}`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
        <Button
          key="SignOut"
          onClick={signOut}
          variant="ghost"
          className={`nav-glow w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl text-[15px] font-medium text-gray-400 hover:text-red-400`}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
        <Button
          onClick={onNewPost}
          className="btn-gradient w-full gap-2 px-4 py-3 h-auto rounded-xl text-[15px] mt-4"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Button>
      </nav>
    </aside>
  );
}
