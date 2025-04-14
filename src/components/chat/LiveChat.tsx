import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, X, Search, Send, ChevronLeft, ChevronRight, Home, HelpCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocket } from '@/contexts/SocketContext';
import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';
import { Home as HomeIcon, MessageCircle as MessageCircleIcon } from 'react-feather';

type ChatView = 'home' | 'messages' | 'help';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentView, setCurrentView] = useState<ChatView>('messages');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { 
    socket, 
    connected,
    joinRoom,
    leaveRoom,
    sendMessage
  } = useSocket();

  const supportAgents = [
    { 
      id: 1, 
      name: 'John', 
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      status: 'online'
    },
    { 
      id: 2, 
      name: 'Emma', 
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      status: 'online'
    },
    { 
      id: 3, 
      name: 'Alex', 
      avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
      status: 'online'
    }
  ];

  const helpTopics = [
    {
      title: 'What to do if you are unable to access your Two-Factor Authentication (2FA)?',
      preview: 'If you are unable to access your two-factor authentication code, please contact us to initiate the 2FA recovery process.',
      content: 'If you are unable to access your two-factor authentication (2FA) code, please contact us at recovery@elitemp.com using the email associated with your account. We\'ll then initiate the 2FA recovery process.\n\nTo verify your account ownership, we will request certain account-related information. Upon successful review and verification of the provided data, you will regain access to your account within 48 hours.',
      updatedAt: 'Updated over 6 months ago',
      relatedArticles: [
        'How does the purchase process work?',
        'What payment methods do you accept?',
        'What fees do you charge?'
      ]
    },
    {
      title: 'How does the purchase process work?',
      preview: 'When you purchase an account, the payment is held in escrow until the account has been successfully transferred to you.',
      content: 'When you purchase an account, the payment is held in escrow until the account has been successfully transferred to you. Once you confirm receipt of the account, the funds are released to the seller. This ensures a secure transaction for both parties.',
      updatedAt: 'Updated 3 months ago',
      relatedArticles: [
        'What to do if you are unable to access your Two-Factor Authentication (2FA)?',
        'What payment methods do you accept?',
        'What fees do you charge?'
      ]
    },
    {
      title: 'What payment methods do you accept?',
      preview: 'We currently accept cryptocurrency payments through our integration with NOWPayments.',
      content: 'We currently accept cryptocurrency payments through our integration with NOWPayments. This includes Bitcoin, Ethereum, and several other major cryptocurrencies, providing secure and anonymous transactions.',
      updatedAt: 'Updated 2 months ago',
      relatedArticles: [
        'How does the purchase process work?',
        'What fees do you charge?',
        'What to do if you are unable to access your Two-Factor Authentication (2FA)?'
      ]
    },
    {
      title: 'What fees do you charge?',
      preview: 'We charge a 10% commission fee on successful sales. No upfront costs or listing fees.',
      content: 'We charge a 10% commission fee on successful sales. This fee helps us maintain the platform, provide customer support, and ensure secure transactions through our escrow service. There are no listing fees or upfront costs.',
      updatedAt: 'Updated 1 month ago',
      relatedArticles: [
        'What payment methods do you accept?',
        'How does the purchase process work?',
        'What to do if you are unable to access your Two-Factor Authentication (2FA)?'
      ]
    }
  ];

  const socketRef = useRef(io('http://localhost:3000'));

  useEffect(() => {
    if (connected) {
      joinRoom('general');
    }

    return () => {
      if (connected) {
        leaveRoom('general');
      }
    };
  }, [connected]);

  useEffect(() => {
    const currentSocket = socketRef.current;

    currentSocket.emit('join_room', 'general');

    currentSocket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      currentSocket.emit('leave_room', 'general');
      currentSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    socketRef.current.emit('send_message', { ...message, room: 'general' });
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleTopicClick = (topicTitle: string) => {
    const topic = helpTopics.find(t => t.title === topicTitle);
    if (topic) {
      setSelectedTopic(topic.title);
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No messages</h3>
      <p className="text-gray-500 text-sm">Messages from the team will be shown here</p>
      <Button 
        className="mt-8 bg-[#4169E1] hover:bg-[#3154c4] text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 transition-colors"
        onClick={() => setCurrentView('messages')}
      >
        Send us a message
        <span className="ml-1">→</span>
      </Button>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <h2 className="text-xl font-semibold">Messages</h2>
      <button
        onClick={() => setIsOpen(false)}
        className="text-gray-500 hover:text-gray-700 transition-colors p-2"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const renderBottomNav = () => (
    <div className="flex items-center justify-around border-t py-3 px-4 bg-white">
      <button
        onClick={() => setCurrentView('home')}
        className={cn(
          "flex flex-col items-center gap-1 px-4",
          currentView === 'home' ? "text-[#4169E1]" : "text-gray-400"
        )}
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Home</span>
      </button>
      <button
        onClick={() => setCurrentView('messages')}
        className={cn(
          "flex flex-col items-center gap-1 px-4",
          currentView === 'messages' ? "text-[#4169E1]" : "text-gray-400"
        )}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="text-xs font-medium">Messages</span>
      </button>
      <button
        onClick={() => setCurrentView('help')}
        className={cn(
          "flex flex-col items-center gap-1 px-4",
          currentView === 'help' ? "text-[#4169E1]" : "text-gray-400"
        )}
      >
        <HelpCircle className="w-6 h-6" />
        <span className="text-xs font-medium">Help</span>
      </button>
    </div>
  );

  const renderMessages = () => (
    <div className="flex-1 overflow-auto p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-2",
              msg.sender === user?.username ? "justify-end" : "justify-start"
            )}
          >
            {msg.sender === user?.username && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/support-1.jpg" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-lg p-3 max-w-[80%]",
                msg.sender === user?.username ? "bg-gray-100" : "bg-yellow-500 text-white"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold mb-4">Welcome to ELITE Marketplace</h2>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <h4 className="font-medium text-yellow-600">How do I list an item?</h4>
                  <p className="text-gray-600 mt-1 text-sm">Click on the "List Item" button in the navigation bar and fill out the required details.</p>
                </div>
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <h4 className="font-medium text-yellow-600">How does payment work?</h4>
                  <p className="text-gray-600 mt-1 text-sm">We support various payment methods including credit cards and PayPal. All transactions are secure.</p>
                </div>
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <h4 className="font-medium text-yellow-600">What if I have issues with an order?</h4>
                  <p className="text-gray-600 mt-1 text-sm">Contact the seller directly through the messaging system or reach out to our support team.</p>
                </div>
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <h4 className="font-medium text-yellow-600">How long does shipping take?</h4>
                  <p className="text-gray-600 mt-1 text-sm">Shipping times vary by seller and location. Check the item listing for specific shipping details.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDistanceToNow(new Date(message.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        );

      case 'help':
        return selectedTopic ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{selectedTopic}</h2>
                <p className="text-sm text-gray-500">{helpTopics.find(t => t.title === selectedTopic)?.updatedAt}</p>
                <div className="prose prose-sm">
                  {helpTopics.find(t => t.title === selectedTopic)?.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-600">{paragraph}</p>
                  ))}
                </div>
                {helpTopics.find(t => t.title === selectedTopic)?.relatedArticles.length > 0 && (
                  <>
                    <h3 className="font-bold text-lg mt-8 mb-4">Related Articles</h3>
                    <div className="space-y-2">
                      {helpTopics.find(t => t.title === selectedTopic)?.relatedArticles.map((articleTitle, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTopicClick(articleTitle)}
                          className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group"
                        >
                          <span className="text-blue-600">{articleTitle}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-semibold">Help Center</h3>
                <p className="text-sm text-gray-500">Find answers to common questions</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for help"
                  className="pl-9 bg-gray-50"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {helpTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicClick(topic.title)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg",
                      "bg-gray-50 hover:bg-gray-100",
                      "transition-colors duration-200"
                    )}
                  >
                    <h4 className="font-medium mb-1">{topic.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{topic.preview}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#4169E1] hover:bg-[#3154c4] flex items-center justify-center shadow-lg transition-colors"
      >
        <MessageSquare className="w-7 h-7 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      <div className="bg-[#4169E1] text-white p-6 relative overflow-hidden">
        {/* Decorative background curve */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-[#5179F2] rounded-[100%] transform translate-y-12"
          style={{
            borderRadius: '100% 100% 0 0',
            width: '150%',
            marginLeft: '-25%'
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 
              className="text-3xl font-extrabold tracking-wide"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '0.05em'
              }}
            >
              ELITE MP
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-1 mb-4">
            {supportAgents.map((agent, index) => (
              <div key={agent.id} className="relative">
                <Avatar 
                  className={cn(
                    "w-10 h-10 border-2 border-white/90 shadow-md transition-transform hover:scale-105",
                    index > 0 && "-ml-3"
                  )}
                >
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback>{agent.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            Hey there <span className="wave">👋</span>
          </h2>
          <p className="text-lg text-white/90">How can we help?</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4">
          <Button 
            className="w-full mb-6 bg-white text-[#4169E1] border border-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-colors py-6 text-lg font-medium rounded-xl"
            onClick={() => {
              setCurrentView('messages');
              setIsOpen(true);
            }}
          >
            Send us a message
          </Button>

          <div className="space-y-4">
            {helpTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleTopicClick(topic.title)}
                className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-1">{topic.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{topic.preview}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {renderBottomNav()}
    </div>
  );
};

export default LiveChat; 