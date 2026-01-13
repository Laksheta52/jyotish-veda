'use client';

import { ChevronLeft, Lock, Unlock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const syllabusData = {
    beginner: {
        title: 'Syllabus',
        subtitle: 'Master the 30-day curriculum',
        lessons: [
            { day: 1, title: 'The 12 Zodiac Signs (Rashis) per Saravali', unlocked: true },
            { day: 2, title: 'The 12 Bhavas (Houses) in Phaladeepika', unlocked: false },
            { day: 3, title: 'The Planetary Cabinet (Brihat Jataka)', unlocked: false },
            { day: 4, title: 'Natural Benefics and Malefics', unlocked: false },
            { day: 5, title: 'The Five Elements (Pancha Tattvas)', unlocked: false },
            { day: 6, title: 'Tithis in Jathakabaranam', unlocked: false },
            { day: 7, title: 'The 27 Nakshatras', unlocked: false },
            { day: 8, title: 'Lagna - The Ascendant', unlocked: false },
            { day: 9, title: 'Exaltation and Debilitation', unlocked: false },
            { day: 10, title: 'Planetary Friendships', unlocked: false },
            { day: 11, title: 'Combustion and Retrograde (Saravali)', unlocked: false },
            { day: 12, title: 'Planetary Strengths (Shadbala Intro)', unlocked: false },
            { day: 13, title: 'Aspects (Drishti) in BPHS', unlocked: false },
            { day: 14, title: 'Karakas - Significators', unlocked: false },
            { day: 15, title: 'House Significations Part 1', unlocked: false },
            { day: 16, title: 'House Significations Part 2', unlocked: false },
            { day: 17, title: 'Yogas Introduction', unlocked: false },
            { day: 18, title: 'Pancha Mahapurusha Yogas', unlocked: false },
            { day: 19, title: 'Dhana Yogas', unlocked: false },
            { day: 20, title: 'Raja Yogas Basics', unlocked: false },
            { day: 21, title: 'Arishta Yogas', unlocked: false },
            { day: 22, title: 'Vimshottari Dasha System', unlocked: false },
            { day: 23, title: 'Dasha Interpretation Basics', unlocked: false },
            { day: 24, title: 'Transit (Gochara) Principles', unlocked: false },
            { day: 25, title: 'Ashtakavarga Introduction', unlocked: false },
            { day: 26, title: 'Navamsa Chart Basics', unlocked: false },
            { day: 27, title: 'D-Charts Overview', unlocked: false },
            { day: 28, title: 'Muhurta Basics', unlocked: false },
            { day: 29, title: 'Horary (Prashna) Introduction', unlocked: false },
            { day: 30, title: 'Putting It All Together', unlocked: false },
        ],
    },
};

export default function SyllabusPage() {
    const params = useParams();
    const level = (params.level as string) || 'beginner';
    const data = syllabusData[level as keyof typeof syllabusData] || syllabusData.beginner;

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
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{data.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{data.subtitle}</p>
                </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.lessons.map((lesson) => (
                    <div
                        key={lesson.day}
                        className={`bg-white dark:bg-[#1a1025] rounded-xl p-5 shadow-lg border transition-all ${lesson.unlocked && lesson.day === 1
                                ? 'border-2 border-amber-400 hover:shadow-xl'
                                : 'border-gray-100 dark:border-purple-900/30'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${lesson.unlocked
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                DAY {lesson.day}
                            </span>
                            {lesson.unlocked ? (
                                <Unlock className="text-purple-500" size={16} />
                            ) : (
                                <Lock className="text-gray-400" size={16} />
                            )}
                        </div>

                        <h3 className={`font-semibold mb-3 ${lesson.unlocked
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {lesson.title}
                        </h3>

                        {lesson.unlocked && lesson.day === 1 && (
                            <Link
                                href={`/lesson/${level}/${lesson.day}`}
                                className="text-purple-600 dark:text-purple-400 font-medium text-sm flex items-center gap-1 hover:text-purple-700 dark:hover:text-purple-300"
                            >
                                Start Lesson
                                <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
