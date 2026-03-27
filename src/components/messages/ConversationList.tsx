import { MessageCircle } from "lucide-react";
import { timeAgo } from "@/lib/converttime";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import ConversationListHeader from "./ConversationListHeader";
import type { ConversationListProps } from "@/types/messagespage";

/**
 * ConversationList — sidebar trái chứa danh sách conversations.
 * Hiển thị participant name/avatar, last message preview, thời gian.
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
  currentUserId,
}: ConversationListProps) => {
  /** Lấy participant còn lại (không phải current user) */
  const getOtherParticipant = (conv: (typeof conversations)[0]) => {
    const other = conv.participants?.find((p) => p.user_id !== currentUserId);
    if (other) return { name: other.username, avatar: other.avatar };
    return { name: "Conversation", avatar: undefined };
  };

  /** Filter theo search query */
  const filtered = searchQuery.trim()
    ? conversations.filter((conv) => {
        const { name } = getOtherParticipant(conv);
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : conversations;

  return (
    <div
      className={`w-full md:w-[300px] lg:w-[320px] shrink-0 border-r border-white/5 flex flex-col overflow-hidden ${
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
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-gray-500">
            <MessageCircle className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium text-gray-400">
              {searchQuery
                ? "Không tìm thấy cuộc trò chuyện"
                : "Chưa có cuộc trò chuyện nào"}
            </p>
            {!searchQuery && (
              <p className="text-xs mt-1 text-gray-600">
                Click the icon above to start chatting
              </p>
            )}
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = activeConversationId === conv.conversation_id;
            const { name, avatar } = getOtherParticipant(conv);
            const lastMsg = conv.last_message;
            const preview = lastMsg
              ? lastMsg.sender_id === currentUserId
                ? `Bạn: ${lastMsg.content}`
                : lastMsg.content
              : null;
            const lastTime =
              lastMsg?.created_at ?? conv.conversations?.created_at;

            return (
              <button
                key={conv.conversation_id}
                onClick={() => onSelectConversation(conv.conversation_id)}
                className={`w-[calc(100%-12px)] mx-1.5 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                  isActive ? "bg-[#2496d4]/12 shadow-sm" : "hover:bg-white/5"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <InitialAvatar
                    name={name}
                    avatarUrl={avatar}
                    sizeClassName="w-12 h-12"
                    textClassName="text-sm"
                  />
                  {/* Online dot placeholder */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <p
                      className={`text-[14px] truncate font-semibold ${isActive ? "text-[#63d4f7]" : "text-gray-100"}`}
                    >
                      {name}
                    </p>
                    {lastTime && (
                      <span className="text-[11px] text-gray-500 shrink-0">
                        {timeAgo(lastTime)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[12px] truncate mt-0.5 ${isActive ? "text-[#63d4f7]/70" : "text-gray-500"}`}
                  >
                    {preview ?? "Start the conversation"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
