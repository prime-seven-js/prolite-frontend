import { MessageCircle } from "lucide-react";
import { timeAgo } from "@/lib/converttime";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import ConversationListHeader from "./ConversationListHeader";
import type { ConversationListProps } from "@/types/messagespage";

/**
 * ConversationList — sidebar trái chứa danh sách conversations.
 * Compose: ConversationListHeader + NewChatPanel (inject via prop) + conversation items.
 * Hiển thị tên + avatar participant thay vì "Conversation" chung.
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
  userLookup: _userLookup,
  currentUserId,
}: ConversationListProps) => {
  /**
   * Resolve tên + avatar của participant còn lại trong conversation 1-1.
   * Nếu có data participants từ API → dùng trực tiếp.
   * Nếu không → fallback dùng userLookup.
   */
  const getOtherParticipant = (conv: (typeof conversations)[0]) => {
    // Ưu tiên dùng participants từ Conversation type
    if (conv.participants && conv.participants.length > 0) {
      const other = conv.participants.find((p) => p.user_id !== currentUserId);
      if (other) {
        return { name: other.username, avatar: other.avatar };
      }
    }
    // Fallback: không có participant data
    return { name: "Conversation", avatar: undefined };
  };

  /** Filter conversations theo search query (so khớp tên participant) */
  const filteredConversations = searchQuery.trim()
    ? conversations.filter((conv) => {
        const { name } = getOtherParticipant(conv);
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : conversations;

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
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm font-medium mb-1">
              {searchQuery ? "No matching conversations" : "No conversations yet"}
            </p>
            <p className="text-xs">
              {searchQuery
                ? "Try a different search"
                : "Start a new conversation above"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = activeConversationId === conv.conversation_id;
            const { name, avatar } = getOtherParticipant(conv);

            // Last message preview
            const lastMsg = conv.last_message;
            const lastMsgPreview = lastMsg
              ? lastMsg.sender_id === currentUserId
                ? `You: ${lastMsg.content}`
                : lastMsg.content
              : null;
            const lastMsgTime = lastMsg?.created_at;

            return (
              <button
                key={conv.conversation_id}
                onClick={() => onSelectConversation(conv.conversation_id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/4 transition-colors text-left ${
                  isActive ? "bg-[#2496d4]/8" : "hover:bg-white/3"
                }`}
              >
                {/* Avatar participant */}
                <InitialAvatar
                  name={name}
                  avatarUrl={avatar}
                  sizeClassName="w-10 h-10"
                  textClassName="text-sm"
                />

                {/* Tên + last message preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{name}</p>
                    {lastMsgTime && (
                      <span className="text-[10px] text-gray-600 shrink-0">
                        {timeAgo(lastMsgTime)}
                      </span>
                    )}
                  </div>
                  {lastMsgPreview ? (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {lastMsgPreview}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600 mt-0.5">
                      {timeAgo(conv.conversations?.created_at ?? "")}
                    </p>
                  )}
                </div>

                {/* Active indicator */}
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
