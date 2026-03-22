import { MessageCircle } from "lucide-react";
import { timeAgo } from "@/lib/converttime";
import ConversationListHeader from "./ConversationListHeader";
import type { ConversationListProps } from "@/types/messagespage";

/**
 * ConversationList — sidebar trái chứa danh sách conversations.
 * Compose: ConversationListHeader + NewChatPanel (inject via prop) + conversation items.
 */
const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  showNewChat,
  onToggleNewChat,
  newChatPanel,
}: ConversationListProps) => {
  return (
    <div
      className={`w-full md:w-80 md:shrink-0 border-r border-white/4 flex flex-col ${
        activeConversationId ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header + Search */}
      <ConversationListHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        showNewChat={showNewChat}
        onToggleNewChat={onToggleNewChat}
      />

      {/* New Chat Panel — inject từ parent */}
      {showNewChat && newChatPanel}

      {/* Conversation Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm font-medium mb-1">No conversations yet</p>
            <p className="text-xs">Start a new conversation above</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeConversationId === conv.conversation_id;
            return (
              <button
                key={conv.conversation_id}
                onClick={() => onSelectConversation(conv.conversation_id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/4 transition-colors text-left ${
                  isActive ? "bg-[#2496d4]/8" : "hover:bg-white/3"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2496d4] to-[#63d4f7] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Conversation</p>
                  <p className="text-xs text-gray-500 truncate">
                    {timeAgo(conv.conversations?.created_at ?? "")}
                  </p>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#2496d4] shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
