'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, Import } from 'lucide-react';
import clsx from 'clsx';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
const languages = ['English', 'Hindi', 'Tamil', 'Sanskrit'];

// Mock content
const mockContent: Record<string, Record<string, Record<string, { title: string; content: string }>>> = {
    Beginner: {
        'Day 1': {
            English: {
                title: 'The 12 Zodiac Signs (Rashis) per Saravali',
                content: 'According to Saravali, an ancient text by Kalyanavarman, the 12 signs represent the celestial circle divided into 12 equal parts. Aries (Mesha), Taurus (Vrishabha), Gemini (Mithuna), Cancer (Karka), Leo (Simha), Virgo (Kanya), Libra (Tula), Scorpio (Vrishchika), Sagittarius (Dhanu), Capricorn (Makara), Aquarius (Kumbha), and Pisces (Meena) each carry unique characteristics and planetary rulerships.',
            },
            Hindi: {
                title: 'सारावली के अनुसार 12 राशियाँ',
                content: 'कल्याणवर्मन द्वारा रचित प्राचीन ग्रंथ सारावली के अनुसार, 12 राशियाँ आकाशीय वृत्त को 12 बराबर भागों में विभाजित करती हैं।',
            },
            Tamil: {
                title: 'சாராவளியின் படி 12 ராசிகள்',
                content: 'கல்யாணவர்மனால் எழுதப்பட்ட சாராவளியின் படி, 12 ராசிகள் கோடியமண்டலத்தை சமமானவாக 12 பாகங்களாக பிரிக்கின்றன. மேஷம் தலை, ரிஷபம் இடம், மிதுனம் காரிய, கடகம் சிம்மம் வாழ்து, கன்னியா துலாம், விருச்சிகம் மிருசுலைப், தனுசு மகரம், கும்பம் தூதிச்சை, மீனம் முதுகின்கள், ஆகும் தூதிக்கன்கள் மற்றும் பார்வைள் கூலைக்கள் ஆகும்.',
            },
            Sanskrit: {
                title: 'सारावल्यां द्वादशराशयः',
                content: 'कल्याणवर्मणा रचिते सारावल्यां द्वादशराशयः वर्णिताः।',
            },
        },
    },
};

export default function DailyWisdomPage() {
    const [level, setLevel] = useState('Beginner');
    const [day, setDay] = useState('Day 1');
    const [activeLanguage, setActiveLanguage] = useState('English');

    const content = mockContent[level]?.[day]?.[activeLanguage] || { title: '', content: '' };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="text-white" size={28} />
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Daily Wisdom</h1>
                </div>
                <p className="text-purple-200">Structured lessons organized by level and day</p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Level</label>
                    <div className="relative">
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {levels.map((l) => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Day</label>
                    <div className="relative">
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {languages.map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setActiveLanguage(lang)}
                        className={clsx(
                            'px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2',
                            activeLanguage === lang
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-white dark:bg-[#1a1025] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-purple-900/30 hover:bg-gray-50 dark:hover:bg-purple-900/20'
                        )}
                    >
                        {lang}
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    </button>
                ))}
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {level} - {day} ({activeLanguage})
                    </h2>
                    <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium">
                        <Import size={16} />
                        Import
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Title</label>
                        <div className="w-full bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white">
                            {content.title || 'No content available'}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Content</label>
                        <div className="w-full min-h-[200px] bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white leading-relaxed">
                            {content.content || 'No content available for this selection.'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
