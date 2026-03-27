import { InitialAvatar } from "@/components/layout/InitialAvatar";
import type { NewChatPanelProps } from "@/types/messagespage";

/**
 * NewChatPanel — danh sách users có thể bắt đầu chat mới.
 */
const NewChatPanel = ({ users, onStartConversation }: NewChatPanelProps) => {
  return (
    <div className="border-b border-white/6 bg-black/10 px-3 py-2 max-h-56 overflow-y-auto no-scrollbar">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1 pb-2">
        Start a conversation
      </p>

      {users.length === 0 ? (
        <p className="text-xs text-gray-600 px-1 py-3 text-center">
          No users found
        </p>
      ) : (
        users.map((u) => (
          <button
            key={u.user_id}
            onClick={() => onStartConversation(u.user_id)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/6 transition-colors text-left"
          >
            <InitialAvatar
              name={u.username}
              avatarUrl={u.avatar}
              sizeClassName="w-9 h-9"
              textClassName="text-xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-200 truncate">
                {u.username}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default NewChatPanel;
