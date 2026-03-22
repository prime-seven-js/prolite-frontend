import { useEffect, useRef } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import type { MessageThreadProps } from "@/types/messagespage";

/**
 * MessageThread — panel phải hiển thị thread chat.
 * Gồm: header, danh sách messages (auto-scroll), và input gửi tin nhắn.
 */
const MessageThread = ({
  messages,
  loading,
  currentUser,
  userLookup,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onBack,
}: MessageThreadProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll xuống message mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Thread Header */}
      <div className="sticky top-0 z-10 glass-header px-4 py-3 flex items-center gap-3">
        {/* Nút back — chỉ hiển thị trên mobile */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          className="md:hidden rounded-full text-gray-400 hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#2496d4] to-[#63d4f7] flex items-center justify-center shrink-0">
          <MessageCircle className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold">Conversation</p>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#2496d4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUser.user_id;
            const senderName =
              msg.users?.username ??
              userLookup[msg.sender_id]?.username ??
              "Unknown";
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMine={isMine}
                senderName={senderName}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        value={messageInput}
        onChange={onMessageInputChange}
        onSend={onSendMessage}
      />
    </>
  );
};

export default MessageThread;
