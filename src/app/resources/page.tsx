'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Video, FileText, Wrench, Loader2 } from 'lucide-react';
import { getResources, type Resource } from '@/lib/database';

const typeIcons = {
    pdf: FileText,
    video: Video,
    article: BookOpen,
    tool: Wrench,
};

const typeColors = {
    pdf: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    video: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    article: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    tool: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
};

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResources() {
            setLoading(true);
            const data = await getResources();
            setResources(data);
            setLoading(false);
        }
        fetchResources();
    }, []);

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
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Learning Resources</h1>
                <p className="text-gray-600 dark:text-gray-400">Curated external links, PDFs, and tools.</p>
            </div>

            {resources.length === 0 ? (
                <div className="text-center py-10">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">No resources available yet.</p>
                    <p className="text-sm text-gray-400">Resources will be added by the Guru from the admin panel.</p>
                </div>
            ) : (
                /* Resource Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => {
                        const Icon = typeIcons[resource.type] || BookOpen;
                        const colorClass = typeColors[resource.type] || typeColors.article;

                        return (
                            <div
                                key={resource.id}
                                className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30 hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded uppercase ${colorClass}`}>
                                        {resource.type}
                                    </span>
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}
