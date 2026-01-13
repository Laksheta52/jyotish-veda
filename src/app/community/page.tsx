'use client';

import { useState } from 'react';
import { MessageCircle, ThumbsUp, Clock, Send, User } from 'lucide-react';
import clsx from 'clsx';

const mockThreads = [
    {
        id: 1,
        title: 'Understanding Saturn Return - Need Guidance',
        author: 'Priya Sharma',
        replies: 12,
        likes: 24,
        time: '2 hours ago',
        preview: 'I am going through my first Saturn return and feeling overwhelmed. Can someone explain what to expect?',
    },
    {
        id: 2,
        title: 'Best approach to learn Navamsa chart interpretation?',
        author: 'Rahul Verma',
        replies: 8,
        likes: 18,
        time: '5 hours ago',
        preview: 'I have completed beginner level and want to dive deeper into Navamsa. What resources do you recommend?',
    },
    {
        id: 3,
        title: 'Difference between North and South Indian chart styles',
        author: 'Meera Krishnan',
        replies: 15,
        likes: 32,
        time: '1 day ago',
        preview: 'Can someone explain the practical differences in using North vs South Indian chart formats?',
    },
];

export default function CommunityPage() {
    const [newPost, setNewPost] = useState('');

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="text-white" size={28} />
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Community Forum</h1>
                </div>
                <p className="text-purple-200">Ask questions, share insights, and learn together</p>
            </div>

            {/* New Post */}
            <div className="bg-white dark:bg-[#1a1025] rounded-xl p-4 shadow-lg border border-gray-100 dark:border-purple-900/30 mb-6">
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Start a new discussion..."
                    className="w-full bg-transparent border-0 resize-none text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none min-h-[80px]"
                />
                <div className="flex justify-end">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <Send size={16} />
                        Post
                    </button>
                </div>
            </div>

            {/* Threads */}
            <div className="space-y-4">
                {mockThreads.map((thread) => (
                    <div
                        key={thread.id}
                        className="bg-white dark:bg-[#1a1025] rounded-xl p-5 shadow-lg border border-gray-100 dark:border-purple-900/30 hover:shadow-xl transition-all cursor-pointer"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-purple-600 transition-colors">
                            {thread.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {thread.preview}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <User size={14} />
                                {thread.author}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                {thread.replies} replies
                            </span>
                            <span className="flex items-center gap-1">
                                <ThumbsUp size={14} />
                                {thread.likes}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {thread.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
