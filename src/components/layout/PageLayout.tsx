import { Home, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import type { NavItem, PageLayoutProps } from "@/types/pagelayout";

/**
 * Layout chung cho hầu hết các trang.
 */

export function PageLayout({
  username,
  activePath,
  children,
  rightSidebar,
  onNewPost,
}: PageLayoutProps) {
  // Gọi phương thức của useNavigate().
  const navigate = useNavigate();

  // Khai báo các mục trên thanh điều hướng.
  const BASE_NAV_ITEMS: NavItem[] = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
  ];

  // Kiểm tra hiện tại trang nào đang được chọn.
  const navItems = BASE_NAV_ITEMS.map((item) => ({
    ...item,
    active: item.path === activePath,
  }));

  // Xử lý việc tạo post mới ở Home, nếu không ở Home sẽ tự động điều hướng đến đó.
  const handleNewPost = onNewPost ?? (() => navigate("/"));

  return (
    <div className="min-h-screen bg-gradient-blue dark text-white font-[Inter,system-ui,sans-serif]">
      {/* Header */}
      <Header username={username} />
      <div className="max-w-7xl mx-auto flex">
        {/* Left sidebar */}
        <Sidebar navItems={navItems} onNewPost={handleNewPost} />
        {/* Content from other pages */}
        <main className="flex-1 min-w-0 border-x border-white/4 min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
        {/* Right sidebar if exists */}
        {rightSidebar && (
          <aside className="hidden xl:block w-80 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] py-6 px-4 space-y-5 overflow-y-auto no-scrollbar">
            {rightSidebar}
          </aside>
        )}
      </div>
      {/* Mobile Navigation */}
      <MobileBottomNav activePath={activePath} onOpenComposer={handleNewPost} />
      <div className="lg:hidden h-16" />
    </div>
  );
}
