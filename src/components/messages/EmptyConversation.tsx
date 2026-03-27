import { MessageCircle } from "lucide-react";
import type { EmptyConversationProps } from "@/types/messagespage";

/**
 * EmptyConversation — placeholder khi chưa chọn conversation nào.
 */
const EmptyConversation = ({ onStartNewChat }: EmptyConversationProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 select-none">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#2496d4]/20 to-[#63d4f7]/10 flex items-center justify-center mb-5 ring-1 ring-white/6">
        <MessageCircle className="w-9 h-9 text-[#63d4f7]/50" />
      </div>
      <h2 className="text-[18px] font-bold text-gray-200 mb-1.5">
        Your messages
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-[220px] leading-relaxed">
        Choose a conversation or create new one to start.
      </p>
      <button
        onClick={onStartNewChat}
        className="mt-6 px-5 py-2.5 bg-[#0084ff] hover:bg-[#0073e6] text-white text-sm font-semibold rounded-full transition-colors shadow-lg shadow-[#0084ff]/20"
      >
        Create a new conversation.
      </button>
    </div>
  );
};

export default EmptyConversation;
