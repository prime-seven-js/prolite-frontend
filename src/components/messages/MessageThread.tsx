import { useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Phone, Video } from "lucide-react";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { formatMessageTimestamp } from "@/lib/converttime";
import type { MessageThreadProps } from "@/types/messagespage";

const GROUPING_TIME_MS = 5 * 60 * 1000; // 5 phút
const DIVIDER_TIME_MS = 30 * 60 * 1000; // 30 phút

/**
 * MessageThread — panel phải của giao diện chat.
 * Header + danh sách tin nhắn (auto-scroll) + input gửi tin.
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
  participantName = "Conversation",
  participantAvatar,
}: MessageThreadProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll khi có tin nhắn mới
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Grouping + divider logic
  const processed = useMemo(() => {
    return messages.map((msg, i) => {
      const prev = messages[i - 1];
      const next = messages[i + 1];

      const cur = new Date(msg.created_at + "Z").getTime();
      const prvT = prev ? new Date(prev.created_at + "Z").getTime() : 0;
      const nxtT = next ? new Date(next.created_at + "Z").getTime() : 0;

      const samePrev =
        prev?.sender_id === msg.sender_id && cur - prvT <= GROUPING_TIME_MS;
      const sameNext =
        next?.sender_id === msg.sender_id && nxtT - cur <= GROUPING_TIME_MS;

      return {
        ...msg,
        isFirstInGroup: !samePrev,
        isLastInGroup: !sameNext,
        showDivider: !prev || cur - prvT > DIVIDER_TIME_MS,
      };
    });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* ─── Thread Header ─── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 glass-header border-b border-white/5 shadow-sm">
        {/* Back button — mobile only */}
        <button
          onClick={onBack}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-200 hover:bg-white/8 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <InitialAvatar
          name={participantName}
          avatarUrl={participantAvatar}
          sizeClassName="w-9 h-9"
          textClassName="text-sm"
        />

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold leading-tight truncate">
            {participantName}
          </p>
          <p className="text-[11px] text-green-400 font-medium">Active now</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-[#63d4f7] hover:bg-white/8 transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-[#63d4f7] hover:bg-white/8 transition-colors">
            <Video className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* ─── Messages Area ─── */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-2">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 border-2 border-[#2496d4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          /* Empty conversation — first time chatting */
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2 pb-8">
            <InitialAvatar
              name={participantName}
              avatarUrl={participantAvatar}
              sizeClassName="w-20 h-20 mb-2"
              textClassName="text-2xl"
            />
            <p className="font-semibold text-gray-200 text-[16px]">
              {participantName}
            </p>
            <p className="text-sm text-gray-500">Say hi to your friend! 👋</p>
          </div>
        ) : (
          <div className="flex flex-col justify-end min-h-full">
            {/* Top identity card */}
            <div className="flex flex-col items-center py-6 gap-2 mb-2">
              <InitialAvatar
                name={participantName}
                avatarUrl={participantAvatar}
                sizeClassName="w-16 h-16"
                textClassName="text-xl"
              />
              <p className="font-semibold text-gray-200">{participantName}</p>
              <p className="text-xs text-gray-500">
                You are now connected with {participantName}
              </p>
            </div>

            {processed.map((msg) => {
              const isMine = msg.sender_id === currentUser.user_id;
              const name =
                msg.users?.username ??
                userLookup[msg.sender_id]?.username ??
                "Unknown";
              const avatar =
                msg.users?.avatar ?? userLookup[msg.sender_id]?.avatar;

              return (
                <div key={msg.id} className="flex flex-col w-full">
                  {msg.showDivider && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-white/6" />
                      <span className="text-[11px] text-gray-500 font-medium shrink-0">
                        {formatMessageTimestamp(msg.created_at)}
                      </span>
                      <div className="flex-1 h-px bg-white/6" />
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isMine={isMine}
                    senderName={name}
                    senderAvatar={avatar}
                    isFirstInGroup={msg.isFirstInGroup}
                    isLastInGroup={msg.isLastInGroup}
                  />
                </div>
              );
            })}

            <div ref={endRef} className="h-2" />
          </div>
        )}
      </div>

      {/* ─── Input ─── */}
      <MessageInput
        value={messageInput}
        onChange={onMessageInputChange}
        onSend={onSendMessage}
      />
    </div>
  );
};

export default MessageThread;
