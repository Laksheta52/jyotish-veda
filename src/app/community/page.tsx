'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Smile } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: Timestamp | null;
}

export default function CommunityPage() {
    const { user, userData } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userName = userData?.name || user?.displayName || localStorage.getItem('userName') || 'Anonymous';

    // Real-time listener for messages
    useEffect(() => {
        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'asc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList: Message[] = [];
            snapshot.forEach((doc) => {
                messageList.push({
                    id: doc.id,
                    ...doc.data()
                } as Message);
            });
            setMessages(messageList);
        });

        return () => unsubscribe();
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await addDoc(collection(db, 'messages'), {
                text: newMessage.trim(),
                userId: user?.uid || 'anonymous',
                userName: userName,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp: Timestamp | null) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const isMyMessage = (msg: Message) => {
        return msg.userId === user?.uid || msg.userName === userName;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                    <MessageCircle className="text-white" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-white">Community Chat</h1>
                        <p className="text-purple-200 text-sm">{messages.length} messages • Real-time</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-300 text-sm">Live</span>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#0f0a1a]">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <Smile size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-md ${isMyMessage(msg)
                                    ? 'bg-purple-600 text-white rounded-br-sm'
                                    : 'bg-white dark:bg-[#1a1025] text-gray-900 dark:text-white rounded-bl-sm border border-gray-100 dark:border-purple-900/30'
                                }`}
                        >
                            {!isMyMessage(msg) && (
                                <p className="text-xs font-semibold text-purple-500 dark:text-purple-400 mb-1 flex items-center gap-1">
                                    <User size={12} />
                                    {msg.userName}
                                </p>
                            )}
                            <p className="text-sm break-words">{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${isMyMessage(msg) ? 'text-purple-200' : 'text-gray-400'}`}>
                                {formatTime(msg.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-[#1a1025] border-t border-gray-200 dark:border-purple-900/30">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 dark:bg-[#0f0a1a] border-0 rounded-full px-5 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-12 h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
