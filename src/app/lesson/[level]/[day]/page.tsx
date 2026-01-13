'use client';

import { ChevronLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const lessonContent: Record<string, Record<number, { title: string; content: string }>> = {
    beginner: {
        1: {
            title: 'The 12 Zodiac Signs (Rashis) per Saravali',
            content: "According to Kalyanavarma's Saravali, the 12 signs are the limbs of the Kalapurusha. Aries is the head, Taurus the face, Gemini the chest, Cancer the heart, Leo the stomach, Virgo the hip, Libra the lower abdomen, Scorpio the private parts, Sagittarius the thighs, Capricorn the knees, Aquarius the ankles, and Pisces the feet.",
        },
        2: {
            title: 'The 12 Bhavas (Houses) in Phaladeepika',
            content: "The 12 houses represent different aspects of life. The 1st house (Tanu) represents the self, 2nd (Dhana) represents wealth, 3rd (Sahaja) represents siblings, and so on. Each house has specific significations that are crucial for chart interpretation.",
        },
    },
};

export default function LessonPage() {
    const params = useParams();
    const level = params.level as string;
    const day = parseInt(params.day as string);
    const [completed, setCompleted] = useState(false);

    const lesson = lessonContent[level]?.[day] || {
        title: 'Lesson Not Found',
        content: 'This lesson content is not yet available.'
    };

    const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

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
                        <p className="text-gray-600 dark:text-gray-400">{levelLabel}</p>
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

                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {lesson.title}
                </h2>

                <div className="prose dark:prose-invert max-w-none mb-8">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        {lesson.content}
                    </p>
                </div>

                {/* Completion Status */}
                <button
                    onClick={() => setCompleted(!completed)}
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
