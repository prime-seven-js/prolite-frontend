import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";

import { useAuthStore } from "@/stores/useAuthStore";
// TanStack Query hooks
import { useAllUsers } from "@/hooks/useAllUsers";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
} from "@/hooks/useConversations";
import { useUserLookup } from "@/hooks/useUserLookup";

// Components tách ra từ MessagesPage
import ConversationList from "@/components/messages/ConversationList";
import NewChatPanel from "@/components/messages/NewChatPanel";
import MessageThread from "@/components/messages/MessageThread";
import EmptyConversation from "@/components/messages/EmptyConversation";

/**
 * Trang Messages — giao diện chat.
 *
 * Cấu trúc:
 * ┌─────────────────────┬────────────────────────┐
 * │ ConversationList     │ MessageThread           │
 * │  ├ Header + Search   │  ├ Thread Header        │
 * │  ├ NewChatPanel      │  ├ Messages (auto-scroll)│
 * │  └ Conversation Items│  └ MessageInput         │
 * └─────────────────────┴────────────────────────┘
 *
 * Data fetching (TanStack Query):
 * - useConversations() → danh sách conversations
 * - useMessages(id) → messages của conversation đang active
 * - useAllUsers() → danh sách users (cho new chat)
 * - useUserLookup() → lookup table user_id → username
 */
const MessagesPage = () => {
  // Auth state
  const user = useAuthStore((s) => s.user);

  // Server state — TanStack Query
  const { data: usersData = [] } = useAllUsers();
  const { data: conversations = [] } = useConversations();
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();

  // UI state
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  // Messages cho conversation đang active
  const { data: messages = [], isLoading: loading } =
    useMessages(activeConversationId);

  // Build user lookup table
  const userLookup = useUserLookup();

  /** Gửi tin nhắn — dùng mutation, clear input ngay lập tức */
  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !activeConversationId) return;
    setMessageInput("");
    await sendMessageMutation.mutateAsync({
      conversationId: activeConversationId,
      content: trimmed,
    });
  };

  /** Tạo conversation mới và chuyển sang conversation đó */
  const handleStartConversation = async (targetUserId: string) => {
    try {
      const convId = await createConversationMutation.mutateAsync([
        targetUserId,
      ]);
      setActiveConversationId(convId);
      setShowNewChat(false);
    } catch (err) {
      console.log("Failed to create conversation", err);
    }
  };

  // Lọc users cho new chat — loại bỏ current user, filter theo search query
  const filteredUsers = useMemo(() => {
    if (!user) return [];
    return usersData
      .filter((u) => u.user_id !== user.user_id)
      .filter((u) =>
        searchQuery
          ? u.username.toLowerCase().includes(searchQuery.toLowerCase())
          : true,
      );
  }, [usersData, user, searchQuery]);

  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  // Right sidebar — online friends (placeholder)
  const rightSidebar = (
    <Card className="glass-card border-0 rounded-2xl py-0">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="font-bold text-[15px] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#63d4f7]" />
          Online Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <p className="text-sm text-gray-500">No friends online right now</p>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout
      username={user.username}
      activePath="/messages"
      rightSidebar={rightSidebar}
    >
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar trái — danh sách conversations */}
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showNewChat={showNewChat}
          onToggleNewChat={() => setShowNewChat(!showNewChat)}
          newChatPanel={
            <NewChatPanel
              users={filteredUsers}
              onStartConversation={(id) => void handleStartConversation(id)}
            />
          }
        />

        {/* Panel phải — thread chat hoặc empty state */}
        <div
          className={`flex-1 flex flex-col ${
            activeConversationId ? "flex" : "hidden md:flex"
          }`}
        >
          {activeConversationId ? (
            <MessageThread
              messages={messages}
              loading={loading}
              currentUser={user}
              userLookup={userLookup}
              messageInput={messageInput}
              onMessageInputChange={setMessageInput}
              onSendMessage={() => void handleSendMessage()}
              onBack={() => setActiveConversationId(null)}
            />
          ) : (
            <EmptyConversation
              onStartNewChat={() => setShowNewChat(true)}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MessagesPage;
