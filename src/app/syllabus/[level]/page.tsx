'use client';

import { ChevronLeft, Lock, Unlock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getLessons, type Lesson } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

export default function SyllabusPage() {
    const params = useParams();
    const level = (params.level as string) || 'beginner';
    const { userData } = useAuth();
    const currentDay = userData?.currentDay || 1;

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLessons() {
            setLoading(true);
            const data = await getLessons(level);
            setLessons(data);
            setLoading(false);
        }
        fetchLessons();
    }, [level]);

    const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                >
                    <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{levelLabel} Syllabus</h1>
                    <p className="text-gray-600 dark:text-gray-400">{lessons.length} lessons available</p>
                </div>
            </div>

            {lessons.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No lessons found for this level.</p>
                    <p className="text-sm text-gray-400">Content will be added by the Guru from the admin panel.</p>
                </div>
            ) : (
                /* Lessons Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessons.map((lesson) => {
                        const isUnlocked = lesson.day <= currentDay;
                        const isCurrent = lesson.day === currentDay;

                        return (
                            <div
                                key={lesson.id}
                                className={`bg-white dark:bg-[#1a1025] rounded-xl p-5 shadow-lg border transition-all ${isCurrent
                                        ? 'border-2 border-amber-400 hover:shadow-xl'
                                        : 'border-gray-100 dark:border-purple-900/30'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${isUnlocked
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        DAY {lesson.day}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{lesson.duration}</span>
                                        {isUnlocked ? (
                                            <Unlock className="text-purple-500" size={16} />
                                        ) : (
                                            <Lock className="text-gray-400" size={16} />
                                        )}
                                    </div>
                                </div>

                                <h3 className={`font-semibold mb-1 ${isUnlocked
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {lesson.title}
                                </h3>

                                {lesson.titleHi && (
                                    <p className="text-sm text-purple-500 dark:text-purple-400 mb-3">{lesson.titleHi}</p>
                                )}

                                {isUnlocked && (
                                    <Link
                                        href={`/lesson/${level}/${lesson.day}`}
                                        className="text-purple-600 dark:text-purple-400 font-medium text-sm flex items-center gap-1 hover:text-purple-700 dark:hover:text-purple-300"
                                    >
                                        {isCurrent ? 'Continue' : 'Review'}
                                        <ArrowRight size={14} />
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
