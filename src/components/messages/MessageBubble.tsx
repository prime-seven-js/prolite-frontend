import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { timeAgo } from "@/lib/converttime";
import type { MessageBubbleProps } from "@/types/messagespage";

/**
 * MessageBubble — hiển thị một tin nhắn trong thread.
 * Tin nhắn của mình: căn phải, gradient xanh.
 * Tin nhắn người khác: căn trái, avatar + tên.
 */
const MessageBubble = ({ message, isMine, senderName, senderAvatar }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-2 max-w-[75%] ${isMine ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar — chỉ hiển thị cho tin nhắn người khác */}
        {!isMine && (
          <InitialAvatar
            name={senderName}
            avatarUrl={senderAvatar}
            sizeClassName="w-8 h-8"
            textClassName="text-xs"
            wrapperClassName="shrink-0 self-end"
          />
        )}
        <div>
          {/* Tên người gửi — chỉ hiển thị cho tin nhắn người khác */}
          {!isMine && (
            <p className="text-xs text-gray-500 mb-1 px-1">{senderName}</p>
          )}
          {/* Nội dung tin nhắn */}
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isMine
                ? "bg-linear-to-r from-[#2496d4] to-[#3ba8e0] text-white rounded-br-md"
                : "bg-white/6 text-gray-200 rounded-bl-md"
            }`}
          >
            {message.content}
          </div>
          {/* Thời gian gửi */}
          <p
            className={`text-[10px] text-gray-600 mt-1 px-1 ${isMine ? "text-right" : ""}`}
          >
            {timeAgo(message.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
