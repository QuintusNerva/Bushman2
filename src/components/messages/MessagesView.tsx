import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export function MessagesView() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // Sample conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      participantId: 'user1',
      participantName: 'Jane Doe',
      participantAvatar: 'JD',
      lastMessage: 'When will you arrive for the water softener installation?',
      lastMessageTime: new Date('2023-06-15T14:30:00'),
      unreadCount: 2
    },
    {
      id: '2',
      participantId: 'user2',
      participantName: 'Bob Johnson',
      participantAvatar: 'BJ',
      lastMessage: 'Thanks for the quick service!',
      lastMessageTime: new Date('2023-06-14T10:15:00'),
      unreadCount: 0
    },
    {
      id: '3',
      participantId: 'user3',
      participantName: 'Sarah Williams',
      participantAvatar: 'SW',
      lastMessage: 'Do you have any availability next week?',
      lastMessageTime: new Date('2023-06-13T16:45:00'),
      unreadCount: 0
    }
  ];
  
  // Sample messages for the active conversation
  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: 'm1',
        senderId: 'user1',
        text: 'Hi there! I was wondering when you will arrive for the water softener installation?',
        timestamp: new Date('2023-06-15T14:30:00'),
        read: true
      },
      {
        id: 'm2',
        senderId: 'currentUser',
        text: 'Hello! I should be there around 2 PM tomorrow. Does that work for you?',
        timestamp: new Date('2023-06-15T14:35:00'),
        read: true
      },
      {
        id: 'm3',
        senderId: 'user1',
        text: 'Yes, that works perfectly. Do I need to prepare anything before you arrive?',
        timestamp: new Date('2023-06-15T14:40:00'),
        read: false
      },
      {
        id: 'm4',
        senderId: 'user1',
        text: 'Also, how long do you think the installation will take?',
        timestamp: new Date('2023-06-15T14:41:00'),
        read: false
      }
    ],
    '2': [
      {
        id: 'm5',
        senderId: 'currentUser',
        text: 'How is the RO system working for you?',
        timestamp: new Date('2023-06-14T10:00:00'),
        read: true
      },
      {
        id: 'm6',
        senderId: 'user2',
        text: 'It\'s working great! The water tastes so much better now.',
        timestamp: new Date('2023-06-14T10:10:00'),
        read: true
      },
      {
        id: 'm7',
        senderId: 'user2',
        text: 'Thanks for the quick service!',
        timestamp: new Date('2023-06-14T10:15:00'),
        read: true
      }
    ],
    '3': [
      {
        id: 'm8',
        senderId: 'user3',
        text: 'I\'m interested in getting a water softener installed.',
        timestamp: new Date('2023-06-13T16:30:00'),
        read: true
      },
      {
        id: 'm9',
        senderId: 'currentUser',
        text: 'Great! I\'d be happy to help with that. What\'s your address so I can check if we service your area?',
        timestamp: new Date('2023-06-13T16:35:00'),
        read: true
      },
      {
        id: 'm10',
        senderId: 'user3',
        text: '123 Pine St, Orlando, FL',
        timestamp: new Date('2023-06-13T16:40:00'),
        read: true
      },
      {
        id: 'm11',
        senderId: 'user3',
        text: 'Do you have any availability next week?',
        timestamp: new Date('2023-06-13T16:45:00'),
        read: true
      }
    ]
  };
  
  // Format timestamp
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format conversation timestamp
  const formatConversationTime = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return formatMessageTime(date);
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;
    
    // In a real app, you would send the message to the server here
    console.log('Sending message:', messageText);
    
    // Clear the input
    setMessageText('');
  };
  
  // Get the active conversation's messages
  const activeMessages = activeConversation ? messages[activeConversation] || [] : [];
  
  // Get the active conversation's participant
  const activeParticipant = activeConversation 
    ? conversations.find(conv => conv.id === activeConversation) 
    : null;
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations list */}
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    activeConversation === conversation.id 
                      ? 'bg-blue-50' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{conversation.participantAvatar}</AvatarFallback>
                      </Avatar>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.participantName}</h3>
                        <span className="text-xs text-slate-500">
                          {formatConversationTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 
                          ? 'font-medium text-slate-900' 
                          : 'text-slate-500'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Message thread */}
        <Card className="md:col-span-2 overflow-hidden flex flex-col">
          {activeConversation ? (
            <>
              {/* Conversation header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{activeParticipant?.participantAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{activeParticipant?.participantName}</CardTitle>
                      <p className="text-xs text-slate-500">Online now</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeMessages.map((message) => {
                  const isCurrentUser = message.senderId === 'currentUser';
                  
                  return (
                    <div 
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          isCurrentUser 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-slate-100 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <p>{message.text}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Message input */}
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-medium mb-1">No conversation selected</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Select a conversation from the list to start messaging or create a new conversation.
              </p>
              <Button className="mt-4">New Message</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
