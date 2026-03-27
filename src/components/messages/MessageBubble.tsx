import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { formatTimeOnly } from "@/lib/converttime";
import type { MessageBubbleProps } from "@/types/messagespage";

/**
 * MessageBubble — một tin nhắn kiểu Facebook Messenger.
 * - Tin của mình: căn phải, nền xanh Messenger (#0084ff)
 * - Tin người khác: căn trái, avatar chỉ hiện ở tin cuối nhóm
 * - Rounded corners thông minh theo grouping
 */
const MessageBubble = ({
  message,
  isMine,
  senderName,
  senderAvatar,
  isFirstInGroup = true,
  isLastInGroup = true,
}: MessageBubbleProps) => {
  // Bo góc tùy vị trí trong nhóm
  let bubbleRadius = "rounded-[18px]";
  if (isMine) {
    if (isFirstInGroup && !isLastInGroup)
      bubbleRadius = "rounded-[18px] rounded-br-[4px]";
    else if (!isFirstInGroup && !isLastInGroup)
      bubbleRadius = "rounded-[18px] rounded-tr-[4px] rounded-br-[4px]";
    else if (!isFirstInGroup && isLastInGroup)
      bubbleRadius = "rounded-[18px] rounded-tr-[4px]";
  } else {
    if (isFirstInGroup && !isLastInGroup)
      bubbleRadius = "rounded-[18px] rounded-bl-[4px]";
    else if (!isFirstInGroup && !isLastInGroup)
      bubbleRadius = "rounded-[18px] rounded-tl-[4px] rounded-bl-[4px]";
    else if (!isFirstInGroup && isLastInGroup)
      bubbleRadius = "rounded-[18px] rounded-tl-[4px]";
  }

  const marginTop = isFirstInGroup ? "mt-3" : "mt-[2px]";

  return (
    <div
      className={`flex w-full group ${isMine ? "justify-end" : "justify-start"} ${marginTop}`}
    >
      <div
        className={`flex items-end gap-1.5 max-w-[72%] sm:max-w-[65%] ${isMine ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar — chỉ người kia mới có, chỉ hiện ở tin cuối nhóm */}
        {!isMine && (
          <div className="w-6 h-6 shrink-0 mb-0.5">
            {isLastInGroup ? (
              <InitialAvatar
                name={senderName || "?"}
                avatarUrl={senderAvatar}
                sizeClassName="w-6 h-6"
                textClassName="text-[9px]"
              />
            ) : (
              <div className="w-6 h-6" />
            )}
          </div>
        )}

        <div
          className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
        >
          {/* Bubble + timestamp hover */}
          <div className="flex items-center gap-1.5">
            {isMine && (
              <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap select-none">
                {formatTimeOnly(message.created_at)}
              </span>
            )}

            <div
              className={`px-3 py-2 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap max-w-full ${bubbleRadius} ${
                isMine
                  ? "bg-[#0084ff] text-white"
                  : "bg-[#3a3a3a] text-gray-100"
              }`}
            >
              {message.content}
            </div>

            {!isMine && (
              <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap select-none">
                {formatTimeOnly(message.created_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
