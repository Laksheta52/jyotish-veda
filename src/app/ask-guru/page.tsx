'use client';

import { useState, useEffect, useRef } from 'react';
import { HelpCircle, Send, Sparkles, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface Query {
    id: string;
    userId: string;
    userName: string;
    question: string;
    answer?: string;
    status: 'pending' | 'answered';
    createdAt: Timestamp | null;
}

export default function AskGuruPage() {
    const { user, userData } = useAuth();
    const [queries, setQueries] = useState<Query[]>([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userName = userData?.name || user?.displayName || localStorage.getItem('userName') || 'Student';
    const userId = user?.uid || 'anonymous';

    // Real-time listener for user's queries
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, 'queries'),
            where('userId', '==', userId),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const queryList: Query[] = [];
            snapshot.forEach((doc) => {
                queryList.push({
                    id: doc.id,
                    ...doc.data()
                } as Query);
            });
            setQueries(queryList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching queries:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [queries]);

    const handleSendQuestion = async () => {
        if (!newQuestion.trim() || sending) return;

        setSending(true);
        try {
            await addDoc(collection(db, 'queries'), {
                userId,
                userName,
                question: newQuestion.trim(),
                status: 'pending',
                createdAt: serverTimestamp()
            });
            setNewQuestion('');
        } catch (error) {
            console.error('Error submitting query:', error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendQuestion();
        }
    };

    const formatTime = (timestamp: Timestamp | null) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-4 lg:p-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <HelpCircle className="text-amber-400" size={28} />
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-white">Ask the Guru</h1>
                        <p className="text-purple-200 text-sm">Get personalized guidance from your mentor</p>
                    </div>
                </div>
            </div>

            {/* Queries List */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-gray-50 dark:bg-[#0f0a1a]">
                {queries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                            <Sparkles className="text-purple-500" size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Ask Your First Question
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            Submit any question about Vedic astrology. The Guru will review and respond to guide your learning.
                        </p>
                    </div>
                ) : (
                    queries.map((q) => (
                        <div key={q.id} className="space-y-3">
                            {/* Question */}
                            <div className="flex justify-end">
                                <div className="max-w-[80%] bg-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                                    <p className="text-sm lg:text-base">{q.question}</p>
                                    <div className="flex items-center gap-2 mt-2 text-purple-200 text-xs">
                                        <span>{formatTime(q.createdAt)}</span>
                                        {q.status === 'pending' ? (
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> Pending
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Answered
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Answer */}
                            {q.answer && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[80%]">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center">
                                            <Sparkles className="text-white" size={18} />
                                        </div>
                                        <div className="bg-white dark:bg-[#1a1025] rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg border border-gray-100 dark:border-purple-900/30">
                                            <p className="text-gray-900 dark:text-white text-sm lg:text-base whitespace-pre-line">
                                                {q.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Question Input */}
            <div className="p-4 bg-white dark:bg-[#1a1025] border-t border-gray-200 dark:border-purple-900/30">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question..."
                        className="flex-1 bg-gray-100 dark:bg-purple-900/20 border-0 rounded-full px-5 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleSendQuestion}
                        disabled={!newQuestion.trim() || sending}
                        className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white flex items-center justify-center transition-colors"
                    >
                        {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
