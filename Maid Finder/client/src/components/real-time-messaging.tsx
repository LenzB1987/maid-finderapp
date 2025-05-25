import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  Star,
  Calendar,
  MapPin
} from "lucide-react";

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  messageType?: "text" | "booking_request" | "booking_response" | "system";
  metadata?: any;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  userType?: string;
}

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

interface RealTimeMessagingProps {
  selectedConversation?: string;
  onConversationSelect?: (userId: string) => void;
  currentUser?: User;
}

export default function RealTimeMessaging({ 
  selectedConversation, 
  onConversationSelect, 
  currentUser 
}: RealTimeMessagingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/messages/conversations"],
    refetchInterval: 5000, // Poll every 5 seconds for real-time feel
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages/conversation", selectedConversation],
    enabled: !!selectedConversation,
    refetchInterval: 2000, // More frequent updates for active conversation
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { receiverId: string; content: string; messageType?: string; metadata?: any }) => {
      return apiRequest("/api/messages", "POST", messageData);
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (senderId: string) => {
      return apiRequest(`/api/messages/mark-read/${senderId}`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== currentUser?.id && !lastMessage.isRead) {
        markAsReadMutation.mutate(selectedConversation);
      }
    }
  }, [selectedConversation, messages, currentUser?.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    sendMessageMutation.mutate({
      receiverId: selectedConversation,
      content: newMessage.trim(),
      messageType: "text",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendBookingRequest = (nannyId: string) => {
    sendMessageMutation.mutate({
      receiverId: nannyId,
      content: "I would like to discuss booking your services. Are you available?",
      messageType: "booking_request",
      metadata: { 
        requestType: "booking_inquiry",
        timestamp: new Date().toISOString()
      }
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 7 * 24) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const selectedUser = conversations?.find((conv: Conversation) => conv.user.id === selectedConversation)?.user;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Messages</span>
            <Badge variant="secondary">{conversations?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversationsLoading ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations?.length > 0 ? (
              <div className="space-y-1">
                {conversations.map((conv: Conversation) => (
                  <div
                    key={conv.user.id}
                    className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.user.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => onConversationSelect?.(conv.user.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.user.profileImageUrl} />
                        <AvatarFallback>
                          {conv.user.firstName[0]}{conv.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {conv.unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium truncate">
                          {conv.user.firstName} {conv.user.lastName}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage.content}
                      </p>
                      {conv.user.userType && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {conv.user.userType}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Start chatting with nannies to see your conversations here</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2">
        {selectedConversation && selectedUser ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.profileImageUrl} />
                    <AvatarFallback>
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-500">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className="animate-pulse">
                          <div className={`h-12 bg-gray-200 rounded-lg w-48 ${i % 2 === 0 ? 'rounded-br-sm' : 'rounded-bl-sm'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : messages?.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            message.senderId === currentUser?.id
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}
                        >
                          {message.messageType === "booking_request" && (
                            <div className="mb-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">Booking Request</span>
                              </div>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-between mt-1 text-xs ${
                            message.senderId === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{formatMessageTime(message.createdAt)}</span>
                            {message.senderId === currentUser?.id && (
                              <div className="flex items-center">
                                {message.isRead ? (
                                  <CheckCheck className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <p>Start your conversation</p>
                      <p className="text-sm mt-2">Send a message to begin chatting</p>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[40px] max-h-[120px] resize-none pr-12"
                      rows={1}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                {selectedUser.userType === "nanny" && currentUser?.userType === "parent" && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => sendBookingRequest(selectedUser.id)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Request Booking
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}