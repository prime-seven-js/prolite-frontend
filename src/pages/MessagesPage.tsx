import { useMemo, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/user";

// TanStack Query hooks
import { useAllUsers } from "@/hooks/useAllUsers";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
} from "@/hooks/useConversations";
import { useUserLookup } from "@/hooks/useUserLookup";

// Realtime subscriptions
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useRealtimeConversations } from "@/hooks/useRealtimeConversations";

// Components
import ConversationList from "@/components/messages/ConversationList";
import NewChatPanel from "@/components/messages/NewChatPanel";
import MessageThread from "@/components/messages/MessageThread";
import EmptyConversation from "@/components/messages/EmptyConversation";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Home, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router";

/**
 * MessagesPage — giao diện chat 1-1 kiểu Messenger.
 *
 * Layout:
 * ┌─────────────┬──────────────────────────────┐
 * │ Left sidebar│ ConversationList              │ MessageThread   │
 * │ (Sidebar)   │ (320px fixed)                │ (flex-1)        │
 * └─────────────┴──────────────────────────────┘
 *
 * Mobile: ConversationList HOẶC MessageThread (toggle bằng back button)
 */
const MessagesPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Data
  const { data: usersData = [] } = useAllUsers();
  const { data: conversations = [] } = useConversations();
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();

  // UI State
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  // Messages của conversation active
  const { data: messages = [], isLoading: loading } =
    useMessages(activeConversationId);
  const userLookup = useUserLookup();

  // Realtime
  useRealtimeMessages(activeConversationId);
  useRealtimeConversations();

  /** Gửi tin nhắn */
  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !activeConversationId) return;
    setMessageInput("");
    await sendMessageMutation.mutateAsync({
      conversationId: activeConversationId,
      content: trimmed,
    });
  };

  /** Tạo / mở conversation với user */
  const handleStartConversation = async (targetUserId: string) => {
    try {
      const convId = await createConversationMutation.mutateAsync([
        targetUserId,
      ]);
      setActiveConversationId(convId);
      setShowNewChat(false);
    } catch (err) {
      console.error("Failed to start conversation", err);
    }
  };

  // Filter users (loại current user + filter theo search)
  const filteredUsers = useMemo(() => {
    if (!user) return [];
    return usersData
      .filter((u: User) => u.user_id !== user.user_id)
      .filter((u: User) =>
        searchQuery
          ? u.username.toLowerCase().includes(searchQuery.toLowerCase())
          : true,
      );
  }, [usersData, user, searchQuery]);

  // Tên + avatar của participant trong conversation đang active
  const activeParticipant = useMemo(() => {
    if (!activeConversationId || !user)
      return { name: "Conversation", avatar: undefined };

    const conv = conversations.find(
      (c) => c.conversation_id === activeConversationId,
    );
    if (conv?.participants) {
      const other = conv.participants.find((p) => p.user_id !== user.user_id);
      if (other) return { name: other.username, avatar: other.avatar };
    }

    // Fallback từ messages
    const otherMsg = messages.find((m) => m.sender_id !== user.user_id);
    if (otherMsg) {
      const lookup = userLookup[otherMsg.sender_id];
      if (lookup) return { name: lookup.username, avatar: lookup.avatar };
    }

    return { name: "Conversation", avatar: undefined };
  }, [activeConversationId, conversations, messages, user, userLookup]);

  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  const navItems = [
    { icon: Home, label: "Home", path: "/", active: false },
    { icon: Search, label: "Search", path: "/search", active: false },
    { icon: MessageCircle, label: "Messages", path: "/messages", active: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-blue dark text-white font-[Inter,system-ui,sans-serif] flex flex-col">
      {/* Global Header */}
      <Header username={user.username} />

      {/* Body: Sidebar + ConversationList + MessageThread */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full min-h-0">
        {/* Left Nav Sidebar */}
        <Sidebar navItems={navItems} onNewPost={() => navigate("/")} />

        {/* Chat Area — full height, trừ bottom nav trên mobile */}
        <main className="flex flex-1 min-w-0 border-x border-white/4 overflow-hidden h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-3.5rem)]">
          {/* Conversation List */}
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
            userLookup={userLookup}
            currentUserId={user.user_id}
          />

          {/* Thread Panel */}
          <div
            className={`flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden ${
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
                participantName={activeParticipant.name}
                participantAvatar={activeParticipant.avatar}
              />
            ) : (
              <EmptyConversation onStartNewChat={() => setShowNewChat(true)} />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav
        activePath="/messages"
        onOpenComposer={() => navigate("/")}
      />
      <div className="lg:hidden h-16" />
    </div>
  );
};

export default MessagesPage;
