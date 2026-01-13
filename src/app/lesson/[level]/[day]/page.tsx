'use client';

import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getLesson, type Lesson } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LessonPage() {
    const params = useParams();
    const level = params.level as string;
    const day = parseInt(params.day as string);
    const { user } = useAuth();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        async function fetchLesson() {
            setLoading(true);
            const data = await getLesson(level, day);
            setLesson(data);
            setLoading(false);
        }
        fetchLesson();
    }, [level, day]);

    const handleComplete = async () => {
        setCompleted(true);
        // Update user progress in Firestore
        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    currentDay: day + 1
                });
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }
    };

    const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="p-6 lg:p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lesson Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">This lesson content is not yet available in the database.</p>
                <Link href={`/syllabus/${level}`} className="text-purple-600 hover:text-purple-700">
                    ← Back to Syllabus
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/syllabus/${level}`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Day {day}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{levelLabel} • {lesson.duration}</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    {day > 1 && (
                        <Link
                            href={`/lesson/${level}/${day - 1}`}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                            Previous
                        </Link>
                    )}
                    <Link
                        href={`/lesson/${level}/${day + 1}`}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors flex items-center gap-1"
                    >
                        Next
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 lg:p-8 shadow-lg border border-gray-100 dark:border-purple-900/30">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
                    <BookOpen size={16} />
                    {levelLabel.toUpperCase()}
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {lesson.title}
                </h2>

                {lesson.titleHi && (
                    <p className="text-lg text-purple-600 dark:text-purple-400 mb-6">{lesson.titleHi}</p>
                )}

                <div className="prose dark:prose-invert max-w-none mb-8">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                        {lesson.content}
                    </p>

                    {lesson.contentHi && (
                        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                                {lesson.contentHi}
                            </p>
                        </div>
                    )}
                </div>

                {/* Completion Status */}
                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${completed
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                >
                    <CheckCircle size={18} className={completed ? 'fill-current' : ''} />
                    {completed ? 'Lesson Complete' : 'Mark as Complete'}
                </button>
            </div>
        </div>
    );
}
