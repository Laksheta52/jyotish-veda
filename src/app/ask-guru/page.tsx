'use client';

import { useState, useEffect, useRef } from 'react';
import { HelpCircle, Send, User, Sparkles, Bell } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'guru';
    text: string;
    timestamp: Date;
    read: boolean;
}

// Simulated chat storage (would be Firebase in production)
const getStoredMessages = (): Message[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('askGuruMessages');
    return stored ? JSON.parse(stored) : [];
};

const storeMessages = (messages: Message[]) => {
    localStorage.setItem('askGuruMessages', JSON.stringify(messages));
};

export default function AskGuruPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState('Student');
    const [notifications, setNotifications] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const name = localStorage.getItem('userName') || 'Student';
        setUserName(name);

        // Load messages
        const storedMessages = getStoredMessages();
        setMessages(storedMessages);

        // Count unread notifications
        const unread = storedMessages.filter(m => m.sender === 'guru' && !m.read).length;
        setNotifications(unread);

        // Mark all as read when viewing
        const updatedMessages = storedMessages.map(m => ({ ...m, read: true }));
        storeMessages(updatedMessages);
        setMessages(updatedMessages);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: newMessage.trim(),
            timestamp: new Date(),
            read: true,
        };

        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);
        storeMessages(updatedMessages);
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-4 lg:p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="text-amber-400" size={28} />
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-white">Ask the Guru</h1>
                            <p className="text-purple-200 text-sm">Get personalized guidance</p>
                        </div>
                    </div>
                    {notifications > 0 && (
                        <div className="flex items-center gap-2 bg-amber-500 px-3 py-1.5 rounded-full">
                            <Bell size={16} className="text-white" />
                            <span className="text-white text-sm font-medium">{notifications} new</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-gray-50 dark:bg-[#0f0a1a]">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                            <Sparkles className="text-purple-500" size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Start a conversation
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            Ask any question about Vedic astrology. The Guru will respond to guide your learning journey.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${message.sender === 'user'
                                        ? 'bg-purple-600'
                                        : 'bg-gradient-to-br from-amber-400 to-orange-500'
                                    }`}>
                                    {message.sender === 'user' ? (
                                        <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
                                    ) : (
                                        <Sparkles className="text-white" size={18} />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user'
                                        ? 'bg-purple-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-[#1a1025] text-gray-900 dark:text-white rounded-tl-none shadow-lg border border-gray-100 dark:border-purple-900/30'
                                    }`}>
                                    <p className="text-sm lg:text-base">{message.text}</p>
                                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                                        }`}>
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white dark:bg-[#1a1025] border-t border-gray-200 dark:border-purple-900/30">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question..."
                        className="flex-1 bg-gray-100 dark:bg-purple-900/20 border-0 rounded-full px-5 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white flex items-center justify-center transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
