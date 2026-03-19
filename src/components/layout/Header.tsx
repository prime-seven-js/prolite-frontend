// Icons
import { Bell } from "lucide-react";

// Shadcn
import { Button } from "@/components/ui/button";

// Component & React-router Hook
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { useNavigate } from "react-router";

// Type
import type { HeaderProps } from "@/types/pagelayout";
import { useAuthStore } from "@/stores/useAuthStore";

export function Header({ username }: HeaderProps) {
  const { user } = useAuthStore();
  // Use React-router Hook
  const navigate = useNavigate();
  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Logo & Brand Name */}
        <div className="flex items-center gap-2.5">
          <img
            src="/src/assets/prolite-logo.svg"
            alt="Prolite"
            className="w-8 h-8"
          />
          <span className="text-lg font-extrabold tracking-wide bg-gradient-primary bg-clip-text text-transparent">
            PROLITE
          </span>
        </div>

        {/* Noti & Profile */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-white/6"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2496d4] animate-pulse-glow" />
          </Button>
          {/* Initial Avatar */}
          <button className="hover:cursor-pointer" onClick={() => navigate(`/profile/${user?.user_id}`)}>
            <InitialAvatar
              name={username}
              sizeClassName="w-8 h-8"
              textClassName="text-xs"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
