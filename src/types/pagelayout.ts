import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface PageLayoutProps {
  username: string;
  activePath: string;
  children: ReactNode;
  rightSidebar?: ReactNode;
  onNewPost?: () => void;
}

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  active?: boolean;
}

export interface MobileBottomNavProps {
  activePath: string;
  onOpenComposer: () => void;
}

export interface HeaderProps {
  username: string;
}

export interface SidebarProps {
  navItems: NavItem[];
  onNewPost: () => void;
}

export interface InitialAvatarProps {
  name: string;
  avatarUrl?: string;
  sizeClassName: string;
  textClassName: string;
  wrapperClassName?: string;
}
