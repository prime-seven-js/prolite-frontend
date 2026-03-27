import { MessageSquarePlus, Search, X } from "lucide-react";
import type { ConversationListHeaderProps } from "@/types/messagespage";

/**
 * ConversationListHeader — header của sidebar conversations.
 * Gồm: title "Messages", nút "New Chat", và search bar.
 */
const ConversationListHeader = ({
  searchQuery,
  onSearchChange,
  showNewChat,
  onToggleNewChat,
}: ConversationListHeaderProps) => {
  return (
    <div className="shrink-0 z-10 glass-header px-4 pt-4 pb-3 border-b border-white/6">
      {/* Title + nút New Chat */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold tracking-tight">Messages</h1>
        <button
          onClick={onToggleNewChat}
          title={showNewChat ? "Close" : "Create new conversation"}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            showNewChat
              ? "bg-white/10 text-gray-300 hover:bg-white/15"
              : "bg-[#2496d4]/15 text-[#63d4f7] hover:bg-[#2496d4]/25"
          }`}
        >
          {showNewChat ? (
            <X className="w-4 h-4" />
          ) : (
            <MessageSquarePlus className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/50 transition-colors"
        />
      </div>
    </div>
  );
};

export default ConversationListHeader;
