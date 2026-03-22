import { MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationListHeaderProps } from "@/types/messagespage";

/**
 * ConversationListHeader — header của sidebar conversations.
 * Gồm: title "Messages", nút "New", và search bar.
 */
const ConversationListHeader = ({
  searchQuery,
  onSearchChange,
  showNewChat,
  onToggleNewChat,
}: ConversationListHeaderProps) => {
  return (
    <div className="shrink-0 z-10 glass-header px-4 py-3">
      {/* Title + nút New */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold">Messages</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleNewChat}
          className="rounded-full text-[#63d4f7] hover:bg-[#2496d4]/10 text-xs gap-1.5"
        >
          <MessageCircle className="w-4 h-4" />
          {showNewChat ? "Cancel" : "New"}
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/6 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/40 transition-colors"
        />
      </div>
    </div>
  );
};

export default ConversationListHeader;
