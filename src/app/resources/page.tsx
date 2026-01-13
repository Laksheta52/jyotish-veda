'use client';

import { BookOpen, ExternalLink } from 'lucide-react';

const resources = [
    {
        id: 1,
        title: 'Brihat Parashara Hora Shastra (PDF)',
        description: 'The foundational text of Vedic Astrology. Essential reading for all students.',
        url: '#',
    },
    {
        id: 2,
        title: 'Jagannatha Hora Software',
        description: 'Free and comprehensive chart calculation software for Windows.',
        url: '#',
    },
    {
        id: 3,
        title: 'Phaladeepika Online Text',
        description: 'Mantreswaras classic text on predictive astrology.',
        url: '#',
    },
    {
        id: 4,
        title: 'Saravali - Complete Text',
        description: 'Kalyanavarman\'s comprehensive treatise on horoscopy.',
        url: '#',
    },
];

export default function ResourcesPage() {
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Learning Resources</h1>
                <p className="text-gray-600 dark:text-gray-400">Curated external links, PDFs, and tools.</p>
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30 hover:shadow-xl transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <BookOpen className="text-purple-600 dark:text-purple-400" size={24} />
                            </div>
                            <ExternalLink className="text-gray-400" size={16} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{resource.description}</p>
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors w-full justify-center"
                        >
                            Open Link
                            <ExternalLink size={14} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
