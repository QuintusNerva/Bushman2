import { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, Send } from 'lucide-react';

interface Message {
  id: string;
  senderId: 'customer' | 'contractor';
  text?: string;
  image?: string;
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
  timestamp: Date;
}

type MessageTab = 'support' | 'customer' | 'team';

export function MessagesView() {
  const [activeTab, setActiveTab] = useState<MessageTab>('customer');
  const [messageText, setMessageText] = useState('');

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'customer',
      text: "Hi, I'm having trouble with the installation. Can you help?",
      timestamp: new Date('2024-10-03T09:00:00')
    },
    {
      id: '2',
      senderId: 'contractor',
      text: 'Of course! Can you send me some photos of the install site?',
      timestamp: new Date('2024-10-03T09:05:00')
    },
    {
      id: '3',
      senderId: 'customer',
      text: 'Sure, here are a few.',
      timestamp: new Date('2024-10-03T09:10:00')
    },
    {
      id: '4',
      senderId: 'customer',
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=600',
      timestamp: new Date('2024-10-03T09:11:00')
    },
    {
      id: '5',
      senderId: 'contractor',
      text: "Thanks! I see the issue. It looks like the wiring is incorrect. Please refer to the catalog link I'm sending for the correct wiring diagram.",
      timestamp: new Date('2024-10-03T09:15:00')
    },
    {
      id: '6',
      senderId: 'contractor',
      attachment: {
        name: 'Wiring Diagram',
        type: 'document',
        url: '#'
      },
      timestamp: new Date('2024-10-03T09:16:00')
    }
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const customerAvatar = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100';
  const contractorAvatar = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Messages</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex border-b max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'support'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Bushman Support
            {activeTab === 'support' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'customer'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Customer
            {activeTab === 'customer' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'team'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Team
            {activeTab === 'team' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCustomer = message.senderId === 'customer';
            const avatar = isCustomer ? customerAvatar : contractorAvatar;
            const senderLabel = isCustomer ? 'Customer' : 'Contractor';

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCustomer ? '' : 'flex-row-reverse'}`}
              >
                <div className="flex-shrink-0">
                  <img
                    src={avatar}
                    alt={senderLabel}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                <div className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} max-w-[75%]`}>
                  <span className="text-xs text-slate-500 mb-1 px-1">{senderLabel}</span>

                  {message.text && (
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isCustomer
                          ? 'bg-white text-slate-900 rounded-tl-sm shadow-sm'
                          : 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  )}

                  {message.image && (
                    <div className="rounded-2xl overflow-hidden shadow-md mt-2">
                      <img
                        src={message.image}
                        alt="Shared image"
                        className="max-w-full h-auto max-h-64 object-cover"
                      />
                    </div>
                  )}

                  {message.attachment && (
                    <div className="bg-white rounded-2xl p-4 shadow-md mt-2 flex items-center gap-3 min-w-[200px]">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-8 h-8 bg-slate-200 rounded"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">
                          {message.attachment.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full pl-4 pr-24 py-3 bg-slate-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <ImageIcon className="w-5 h-5 text-slate-500" />
                </button>
                <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <LinkIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
