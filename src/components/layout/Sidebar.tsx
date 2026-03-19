// Shadcn
import { Button } from "@/components/ui/button";

// Icons
import { LogOut, Plus } from "lucide-react";

// React-router Hook & Global state
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

// Type
import type { SidebarProps } from "@/types/pagelayout";

export function Sidebar({ navItems, onNewPost }: SidebarProps) {
  // Use React-router Hook & Global state
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] py-6 px-3">
      {/* Sidebar Items */}
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
          <LogOut className="w-4 h-4" />Sign Out
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
