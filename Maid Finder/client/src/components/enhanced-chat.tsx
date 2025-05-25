import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

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
    userType: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

interface EnhancedChatProps {
  selectedConversation?: string;
  onConversationSelect?: (userId: string) => void;
}

export default function EnhancedChat({ selectedConversation, onConversationSelect }: EnhancedChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['/api/messages/conversations'],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Fetch messages for selected conversation
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/messages/conversation', selectedConversation],
    enabled: !!selectedConversation,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time chat
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: string; content: string }) => {
      return apiRequest('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversation', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (senderId: string) => {
      return apiRequest('/api/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations'] });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    sendMessageMutation.mutate({
      receiverId: selectedConversation,
      content: newMessage.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConversation && user) {
      markAsReadMutation.mutate(selectedConversation);
    }
  }, [selectedConversation, user]);

  const selectedUser = conversations.find(conv => conv.user.id === selectedConversation)?.user;

  const filteredConversations = conversations.filter(conv =>
    `${conv.user.firstName} ${conv.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-900 rounded-lg border">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No conversations yet
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.user.id}
                onClick={() => onConversationSelect?.(conv.user.id)}
                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedConversation === conv.user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.user.profileImageUrl} alt={conv.user.firstName} />
                      <AvatarFallback>
                        {conv.user.firstName?.[0]}{conv.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conv.user.firstName} {conv.user.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            {conv.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {conv.lastMessage.content}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {conv.user.userType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.profileImageUrl} alt={selectedUser.firstName} />
                    <AvatarFallback>
                      {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedUser.userType === 'nanny' ? 'Professional Nanny' : 'Parent'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Block User</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedUser.profileImageUrl} alt={selectedUser.firstName} />
                            <AvatarFallback className="text-xs">
                              {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`rounded-lg px-4 py-2 ${
                          isOwnMessage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}