import React, { useState } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface MessagesProps {
  onBack: () => void;
}

export function Messages({ onBack }: MessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      lastMessage: 'Yes, the apartment is still available',
      time: '10:30 AM',
      unread: 2,
    },
    {
      id: '2',
      name: 'Sara Mohammed',
      lastMessage: 'Thank you for your interest',
      time: 'Yesterday',
      unread: 0,
    },
    {
      id: '3',
      name: 'Khaled Omar',
      lastMessage: 'Can we schedule a viewing?',
      time: 'Dec 14',
      unread: 1,
    },
  ];

  const messages: Record<string, Message[]> = {
    '1': [
      { id: '1', sender: 'other', text: 'Hi! I saw your inquiry about the apartment in Al Remal.', time: '10:15 AM' },
      { id: '2', sender: 'user', text: 'Yes, I\'m very interested. Is it still available?', time: '10:20 AM' },
      { id: '3', sender: 'other', text: 'Yes, the apartment is still available', time: '10:30 AM' },
      { id: '4', sender: 'other', text: 'Would you like to schedule a viewing?', time: '10:30 AM' },
    ],
    '2': [
      { id: '1', sender: 'user', text: 'Hello, I\'m interested in your 2-bedroom house', time: '9:00 AM' },
      { id: '2', sender: 'other', text: 'Thank you for your interest', time: '9:15 AM' },
    ],
    '3': [
      { id: '1', sender: 'other', text: 'Can we schedule a viewing?', time: '2:00 PM' },
    ],
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // In real app, this would send the message
      setMessageText('');
    }
  };

  return (
    <div className="h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8DA87A] to-[#A5B88A] px-4 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white">Messages</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Conversations List */}
            <Card className="border-0 shadow-lg md:col-span-1">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-2">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 rounded-lg mb-2 transition-colors text-left ${
                        selectedConversation === conversation.id
                          ? 'bg-[#8DA87A]/10 border border-[#8DA87A]'
                          : 'hover:bg-[#C8D1B0]/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#8DA87A] flex items-center justify-center text-white flex-shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[#333333] truncate">{conversation.name}</p>
                            <span className="text-[#999999]">{conversation.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[#666666] truncate">{conversation.lastMessage}</p>
                            {conversation.unread > 0 && (
                              <span className="bg-[#8DA87A] text-white rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Message Thread */}
            <Card className="border-0 shadow-lg md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="border-b border-[#C8D1B0]/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8DA87A] flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[#333333]">
                          {conversations.find(c => c.id === selectedConversation)?.name}
                        </p>
                        <p className="text-[#666666]">Active now</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages[selectedConversation]?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.sender === 'user'
                                ? 'bg-[#8DA87A] text-white'
                                : 'bg-[#C8D1B0]/30 text-[#333333]'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className={`mt-1 ${
                              message.sender === 'user' ? 'text-white/70' : 'text-[#666666]'
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t border-[#C8D1B0]/30 p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="border-[#C8D1B0] focus:border-[#8DA87A]"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-[#8DA87A] hover:bg-[#7a9569] text-white"
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-[#666666]">
                  Select a conversation to start messaging
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
