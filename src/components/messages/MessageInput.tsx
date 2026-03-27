import { useRef, useEffect, useCallback } from "react";
import { SendHorizonal, Smile } from "lucide-react";
import type { MessageInputProps } from "@/types/messagespage";

/**
 * MessageInput — textarea tự co giãn + nút gửi.
 * Enter gửi tin, Shift+Enter = xuống dòng.
 */
const MessageInput = ({ value, onChange, onSend }: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) onSend();
      }
    },
    [value, onSend],
  );

  const canSend = value.trim().length > 0;

  return (
    <div className="shrink-0 border-t border-white/6 bg-transparent px-3 py-3">
      <div className="flex items-end gap-2">
        {/* Emoji placeholder */}
        <button className="mb-1 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-300 hover:bg-white/8 transition-colors shrink-0">
          <Smile className="w-5 h-5" />
        </button>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="w-full resize-none px-4 py-2.5 bg-white/6 border border-white/8 rounded-2xl text-[15px] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/50 transition-colors leading-snug scrollbar-none overflow-hidden"
            style={{ maxHeight: "120px" }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!canSend}
          className={`mb-1 w-9 h-9 flex items-center justify-center rounded-full shrink-0 transition-all ${
            canSend
              ? "bg-[#0084ff] text-white hover:bg-[#0073e6] shadow-lg shadow-[#0084ff]/20"
              : "bg-white/6 text-gray-600 cursor-not-allowed"
          }`}
        >
          <SendHorizonal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
