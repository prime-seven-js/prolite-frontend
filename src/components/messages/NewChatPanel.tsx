import { InitialAvatar } from "@/components/layout/InitialAvatar";
import type { NewChatPanelProps } from "@/types/messagespage";

/**
 * NewChatPanel — danh sách users có thể bắt đầu chat mới.
 * Hiển thị khi user bấm nút "New" trên header.
 */
const NewChatPanel = ({ users, onStartConversation }: NewChatPanelProps) => {
  return (
    <div className="border-b border-white/6 px-2 py-2 max-h-60 overflow-y-auto no-scrollbar">
      <p className="text-xs text-gray-500 px-2 pb-2">
        Start a conversation with:
      </p>

      {users.map((u) => (
        <button
          key={u.user_id}
          onClick={() => onStartConversation(u.user_id)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
        >
          <InitialAvatar
            name={u.username}
            avatarUrl={u.avatar}
            sizeClassName="w-8 h-8"
            textClassName="text-xs"
          />
          <span className="text-sm font-medium">{u.username}</span>
        </button>
      ))}

      {/* Empty state */}
      {users.length === 0 && (
        <p className="text-xs text-gray-600 px-2 py-4 text-center">
          No users found
        </p>
      )}
    </div>
  );
};

export default NewChatPanel;
