import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MessageInputProps } from "@/types/messagespage";

/**
 * MessageInput — ô nhập tin nhắn + nút gửi.
 * Enter gửi tin, Shift+Enter xuống dòng.
 */
const MessageInput = ({ value, onChange, onSend }: MessageInputProps) => {
  /** Enter gửi tin nhắn, Shift+Enter xuống dòng */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="shrink-0 glass-header border-t border-white/6 px-4 py-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/6 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/40 transition-colors"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim()}
          className="btn-gradient rounded-xl px-4 py-2.5 h-auto disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
