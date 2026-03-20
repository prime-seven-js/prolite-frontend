// Icons
import { Bell, Search, Home, LogOut, Plus } from "lucide-react";
// Shadcn
import { Button } from "@/components/ui/button";
// React-router Hook & Global state
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
// Type
import type { MobileBottomNavProps } from "@/types/pagelayout";

export function MobileBottomNav({ activePath, onOpenComposer }: MobileBottomNavProps) {
  // Use React-router Hook
  const navigate = useNavigate();
  // Global state
  const { signOut } = useAuthStore();
  // Check whether the current page is active or not
  const iconClass = (path: string) =>
    activePath === path
      ? "text-[#63d4f7] rounded-full"
      : "text-gray-500 hover:text-gray-300 rounded-full";

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-header z-50 border-t border-white/6">
      <div className="flex items-center justify-around py-2">
        {/* Mobile bottom navigation items */}
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
          className={`${iconClass("/notifications")} relative`}
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2496d4]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
        >
          <LogOut className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
}
