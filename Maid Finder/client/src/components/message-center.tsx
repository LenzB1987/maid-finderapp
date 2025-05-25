import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { MessageSquare, Send, User } from "lucide-react";

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export default function MessageCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/messages/conversations"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: [`/api/messages/conversation/${selectedConversation}`],
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/messages', {
        receiverId: selectedConversation,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/conversation/${selectedConversation}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
      setNewMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (senderId: string) => {
      return apiRequest('PUT', `/api/messages/read/${senderId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
    },
  });

  const handleConversationSelect = (userId: string) => {
    setSelectedConversation(userId);
    // Mark messages as read
    markAsReadMutation.mutate(userId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const selectedUser = conversations?.find((conv: Conversation) => conv.user.id === selectedConversation)?.user;

  return (
    <div className="h-[600px] border rounded-lg overflow-hidden bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Conversations List */}
        <div className="border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Messages
            </h3>
          </div>
          
          <ScrollArea className="h-[calc(600px-73px)]">
            {conversationsLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations && conversations.length > 0 ? (
              <div className="p-2">
                {conversations.map((conv: Conversation) => (
                  <button
                    key={conv.user.id}
                    onClick={() => handleConversationSelect(conv.user.id)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-white transition-colors ${
                      selectedConversation === conv.user.id ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={conv.user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.user.firstName}`}
                          alt={`${conv.user.firstName} ${conv.user.lastName}`}
                        />
                        <AvatarFallback>
                          {conv.user.firstName?.[0]}{conv.user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conv.user.firstName} {conv.user.lastName}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No conversations yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start messaging nannies to begin conversations
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              {selectedUser && (
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={selectedUser.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.firstName}`}
                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      />
                      <AvatarFallback>
                        {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <Skeleton className={`h-12 w-48 rounded-lg ${i % 2 === 0 ? 'rounded-bl-none' : 'rounded-br-none'}`} />
                      </div>
                    ))}
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Start your conversation</p>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
