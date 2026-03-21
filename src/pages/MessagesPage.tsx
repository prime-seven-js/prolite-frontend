import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, Search, ArrowLeft, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PageLayout } from "@/components/layout/PageLayout";
import { InitialAvatar } from "@/components/layout/InitialAvatar";

import { useAuthStore } from "@/stores/useAuthStore";
// TanStack Query hooks — thay thế useMessageStore và useGlobalStore
import { useAllUsers } from "@/hooks/useAllUsers";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
} from "@/hooks/useConversations";
// Supabase Realtime — nhận message mới qua WebSocket
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

import { timeAgo } from "@/lib/converttime";
// Custom Hooks
import { useUserLookup } from "@/hooks/useUserLookup";

const MessagesPage = () => {
  // Auth state
  const user = useAuthStore((s) => s.user);

  // Server state — TanStack Query
  const { data: usersData = [] } = useAllUsers();
  const { data: conversations = [] } = useConversations();
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();

  // UI state — local (không phải server state)
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messages cho conversation đang active — chỉ fetch khi có conversationId
  const { data: messages = [], isLoading: loading } =
    useMessages(activeConversationId);

  // Realtime — nhận message mới qua WebSocket, tự append vào cache
  useRealtimeMessages(activeConversationId);

  // Build user lookup table
  const userLookup = useUserLookup();

  // Auto-scroll xuống message mới nhất khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  /** Enter gửi tin nhắn, Shift+Enter xuống dòng */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
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
        {/* ── Conversation List (Left Panel) ── */}
        <div
          className={`w-full md:w-80 md:shrink-0 border-r border-white/4 flex flex-col ${
            activeConversationId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* List Header */}
          <div className="sticky top-0 z-10 glass-header px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold">Messages</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewChat(!showNewChat)}
                className="rounded-full text-[#63d4f7] hover:bg-[#2496d4]/10 text-xs gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                New
              </Button>
            </div>
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/6 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/40 transition-colors"
              />
            </div>
          </div>

          {/* New Chat: danh sách users có thể chat */}
          {showNewChat && (
            <div className="border-b border-white/6 px-2 py-2 max-h-60 overflow-y-auto no-scrollbar">
              <p className="text-xs text-gray-500 px-2 pb-2">
                Start a conversation with:
              </p>
              {filteredUsers.map((u) => (
                <button
                  key={u.user_id}
                  onClick={() => void handleStartConversation(u.user_id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <InitialAvatar
                    name={u.username}
                    sizeClassName="w-8 h-8"
                    textClassName="text-xs"
                  />
                  <span className="text-sm font-medium">{u.username}</span>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-xs text-gray-600 px-2 py-4 text-center">
                  No users found
                </p>
              )}
            </div>
          )}

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <MessageCircle className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm font-medium mb-1">No conversations yet</p>
                <p className="text-xs">Start a new conversation above</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.conversation_id;
                return (
                  <button
                    key={conv.conversation_id}
                    onClick={() =>
                      setActiveConversationId(conv.conversation_id)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/4 transition-colors text-left ${
                      isActive ? "bg-[#2496d4]/8" : "hover:bg-white/3"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2496d4] to-[#63d4f7] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        Conversation
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {timeAgo(conv.conversations?.created_at ?? "")}
                      </p>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#2496d4] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Message Thread (Right Panel) ── */}
        <div
          className={`flex-1 flex flex-col ${
            activeConversationId ? "flex" : "hidden md:flex"
          }`}
        >
          {activeConversationId ? (
            <>
              {/* Thread Header */}
              <div className="sticky top-0 z-10 glass-header px-4 py-3 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden rounded-full text-gray-400 hover:text-gray-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#2496d4] to-[#63d4f7] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Conversation</p>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
                {loading && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#2496d4] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <MessageCircle className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-sm">No messages yet. Say hello! 👋</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === user.user_id;
                    const senderName =
                      msg.users?.username ??
                      userLookup[msg.sender_id]?.username ??
                      "Unknown";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[75%] ${isMine ? "flex-row-reverse" : ""}`}
                        >
                          {!isMine && (
                            <InitialAvatar
                              name={senderName}
                              sizeClassName="w-8 h-8"
                              textClassName="text-xs"
                              wrapperClassName="shrink-0 self-end"
                            />
                          )}
                          <div>
                            {!isMine && (
                              <p className="text-xs text-gray-500 mb-1 px-1">
                                {senderName}
                              </p>
                            )}
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isMine
                                  ? "bg-linear-to-r from-[#2496d4] to-[#3ba8e0] text-white rounded-br-md"
                                  : "bg-white/6 text-gray-200 rounded-bl-md"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <p
                              className={`text-[10px] text-gray-600 mt-1 px-1 ${isMine ? "text-right" : ""}`}
                            >
                              {timeAgo(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="sticky bottom-0 glass-header border-t border-white/6 px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/6 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/40 transition-colors"
                  />
                  <Button
                    onClick={() => void handleSendMessage()}
                    disabled={!messageInput.trim()}
                    className="btn-gradient rounded-xl px-4 py-2.5 h-auto disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No conversation selected — placeholder */
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
                onClick={() => setShowNewChat(true)}
                className="btn-gradient rounded-xl mt-6 gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Start a conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MessagesPage;
