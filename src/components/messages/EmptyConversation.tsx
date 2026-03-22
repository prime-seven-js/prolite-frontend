import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmptyConversationProps } from "@/types/messagespage";

/**
 * EmptyConversation — placeholder khi chưa chọn conversation nào.
 * Hiển thị icon, text, và nút "Start a conversation".
 */
const EmptyConversation = ({ onStartNewChat }: EmptyConversationProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#2496d4]/20 to-[#63d4f7]/20 flex items-center justify-center mb-6">
        <MessageCircle className="w-10 h-10 text-[#63d4f7]/50" />
      </div>
      <h2 className="text-xl font-semibold text-gray-300 mb-2">
        Your Messages
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        Select a conversation or start a new one to begin chatting
      </p>
      <Button
        onClick={onStartNewChat}
        className="btn-gradient rounded-xl mt-6 gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Start a conversation
      </Button>
    </div>
  );
};

export default EmptyConversation;
