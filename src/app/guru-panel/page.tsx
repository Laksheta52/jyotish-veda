'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Settings, BookOpen, Star, ChevronDown, Plus, Trash2, Sparkles,
    MessageCircle, Send, User, LayoutDashboard, Users,
    Trophy, Check, X, Clock, Eye, EyeOff, Pin,
    CheckCircle, Circle, TrendingUp, FileText, HelpCircle,
    Save, Globe, Edit3, ExternalLink, MoreVertical
} from 'lucide-react';
import clsx from 'clsx';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
const languages = ['English', 'Hindi', 'Tamil', 'Sanskrit'];

type Tab = 'dashboard' | 'content' | 'resources' | 'community' | 'chats' | 'quizzes';

interface Message {
    id: string;
    sender: 'user' | 'guru';
    senderName?: string;
    text: string;
    timestamp: Date;
    read: boolean;
    status?: 'pending' | 'answered';
}

interface ForumThread {
    id: number;
    title: string;
    author: string;
    replies: number;
    likes: number;
    time: string;
    pinned?: boolean;
    status: 'active' | 'moderated';
}

interface Quiz {
    id: number;
    day: string;
    level: string;
    questions: number;
    enabled: boolean;
    attempts: number;
}

interface Resource {
    id: number;
    url: string;
    title: Record<string, string>;
    description: Record<string, string>;
}

interface LessonData {
    title: string;
    content: string;
    published: boolean;
}

// Simulated storage
const getStoredMessages = (): Message[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('askGuruMessages');
    return stored ? JSON.parse(stored) : [];
};

const storeMessages = (messages: Message[]) => {
    localStorage.setItem('askGuruMessages', JSON.stringify(messages));
};

export default function GuruPanelPage() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Dashboard Stats
    const [stats] = useState({
        totalLessons: 90,
        publishedLessons: 45,
        draftLessons: 45,
        pendingQueries: 3,
        answeredQueries: 28,
        forumPosts: 24,
        quizAttempts: 156,
        activeUsers: 42,
    });

    // Content Tab State
    const [level, setLevel] = useState('Beginner');
    const [day, setDay] = useState('Day 1');
    const [activeLanguage, setActiveLanguage] = useState('English');
    const [langStatus, setLangStatus] = useState<Record<string, boolean>>({
        English: true, Hindi: true, Tamil: false, Sanskrit: false,
    });
    const [contentData, setContentData] = useState<Record<string, LessonData>>({
        English: { title: 'The 12 Zodiac Signs (Rashis) per Saravali', content: "According to Kalyanavarma's Saravali, the 12 signs are the limbs of the Kalapurusha. Aries is the head, Taurus the face, Gemini the chest, Cancer the heart, Leo the stomach, Virgo the hip, Libra the lower abdomen, Scorpio the private parts, Sagittarius the thighs, Capricorn the knees, Aquarius the ankles, and Pisces the feet.", published: true },
        Hindi: { title: 'सरावली के अनुसार 12 राशियाँ', content: 'कल्याणवर्मा की सरावली के अनुसार...', published: true },
        Tamil: { title: '', content: '', published: false },
        Sanskrit: { title: '', content: '', published: false },
    });

    // Resources Tab State
    const [resourceUrl, setResourceUrl] = useState('');
    const [resourceLang, setResourceLang] = useState('English');
    const [resourceTitle, setResourceTitle] = useState('');
    const [resourceDesc, setResourceDesc] = useState('');
    const [resources, setResources] = useState<Resource[]>([
        { id: 1, url: 'https://archive.org/details/bphs', title: { English: 'Brihat Parashara Hora Shastra' }, description: { English: 'The foundational text of Vedic Astrology. Essential reading.' } },
        { id: 2, url: 'https://example.com/saravali.pdf', title: { English: 'Saravali by Kalyanavarma' }, description: { English: 'Classic text on planetary effects and predictions.' } },
    ]);

    // Community Tab State
    const [threads, setThreads] = useState<ForumThread[]>([
        { id: 1, title: 'Understanding Moon in different Nakshatras', author: 'VedicStudent', replies: 12, likes: 8, time: '2 hours ago', pinned: true, status: 'active' },
        { id: 2, title: 'How to interpret Dasha periods?', author: 'JyotishLearner', replies: 5, likes: 3, time: '5 hours ago', status: 'active' },
        { id: 3, title: 'Best books for beginners', author: 'NewLearner', replies: 18, likes: 15, time: '1 day ago', status: 'active' },
        { id: 4, title: 'Spam post removed', author: 'SpamUser', replies: 0, likes: 0, time: '2 days ago', status: 'moderated' },
    ]);

    // Chat Tab State
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyText, setReplyText] = useState('');
    const [pendingCount, setPendingCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Quiz Tab State
    const [quizzes, setQuizzes] = useState<Quiz[]>([
        { id: 1, day: 'Day 1', level: 'Beginner', questions: 5, enabled: true, attempts: 42 },
        { id: 2, day: 'Day 2', level: 'Beginner', questions: 5, enabled: true, attempts: 38 },
        { id: 3, day: 'Day 3', level: 'Beginner', questions: 5, enabled: true, attempts: 35 },
        { id: 4, day: 'Day 4', level: 'Beginner', questions: 5, enabled: false, attempts: 0 },
        { id: 5, day: 'Day 5', level: 'Beginner', questions: 5, enabled: false, attempts: 0 },
    ]);

    useEffect(() => {
        const storedMessages = getStoredMessages();
        setMessages(storedMessages);
        const pending = storedMessages.filter(m => m.sender === 'user').length;
        setPendingCount(pending);
    }, [activeTab]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleContentChange = (field: 'title' | 'content', value: string) => {
        setContentData(prev => ({
            ...prev,
            [activeLanguage]: { ...prev[activeLanguage], [field]: value },
        }));
        setSaved(false);
    };

    const handleSaveContent = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setLangStatus(prev => ({ ...prev, [activeLanguage]: true }));
            setTimeout(() => setSaved(false), 2000);
        }, 800);
    };

    const handleTogglePublish = () => {
        setContentData(prev => ({
            ...prev,
            [activeLanguage]: { ...prev[activeLanguage], published: !prev[activeLanguage].published },
        }));
    };

    const handleAddResource = () => {
        if (!resourceUrl || !resourceTitle) return;
        const newResource: Resource = {
            id: Date.now(),
            url: resourceUrl,
            title: { [resourceLang]: resourceTitle },
            description: { [resourceLang]: resourceDesc },
        };
        setResources([...resources, newResource]);
        setResourceUrl('');
        setResourceTitle('');
        setResourceDesc('');
    };

    const handleDeleteResource = (id: number) => {
        setResources(resources.filter(r => r.id !== id));
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        const reply: Message = {
            id: Date.now().toString(),
            sender: 'guru',
            senderName: 'Guru',
            text: replyText.trim(),
            timestamp: new Date(),
            read: false,
            status: 'answered',
        };
        const updatedMessages = [...messages, reply];
        setMessages(updatedMessages);
        storeMessages(updatedMessages);
        setReplyText('');
    };

    const togglePin = (id: number) => {
        setThreads(threads.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
    };

    const moderateThread = (id: number) => {
        setThreads(threads.map(t => t.id === id ? { ...t, status: 'moderated' as const } : t));
    };

    const restoreThread = (id: number) => {
        setThreads(threads.map(t => t.id === id ? { ...t, status: 'active' as const } : t));
    };

    const toggleQuiz = (id: number) => {
        setQuizzes(quizzes.map(q => q.id === id ? { ...q, enabled: !q.enabled } : q));
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'content', label: 'Content', icon: <BookOpen size={18} /> },
        { id: 'resources', label: 'Resources', icon: <Star size={18} /> },
        { id: 'community', label: 'Community', icon: <Users size={18} /> },
        { id: 'chats', label: 'Queries', icon: <MessageCircle size={18} />, badge: pendingCount },
        { id: 'quizzes', label: 'Quizzes', icon: <Trophy size={18} /> },
    ];

    return (
        <div className="p-4 lg:p-8 min-h-screen bg-gray-50 dark:bg-[#0f0a1a]">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl p-6 mb-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Settings className="text-amber-400" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">Guru Panel</h1>
                        <p className="text-purple-200 text-sm">Manage curriculum, resources & learner interactions</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-[#1a1025] rounded-xl p-2 mb-6 shadow-lg overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                'px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap relative',
                                activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.badge && tab.badge > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-red-500 rounded-full text-xs text-white">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Lessons', value: stats.totalLessons, sub: `${stats.publishedLessons} published`, icon: FileText, color: 'from-purple-500 to-violet-500' },
                            { label: 'Pending Queries', value: stats.pendingQueries, sub: `${stats.answeredQueries} answered`, icon: HelpCircle, color: 'from-amber-500 to-orange-500' },
                            { label: 'Forum Posts', value: stats.forumPosts, sub: 'Active discussions', icon: MessageCircle, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Active Learners', value: stats.activeUsers, sub: `${stats.quizAttempts} quiz attempts`, icon: Users, color: 'from-emerald-500 to-teal-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-[#1a1025] rounded-xl p-5 shadow-lg border border-gray-100 dark:border-purple-900/30">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                    <stat.icon size={24} className="text-white" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-purple-500" />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { label: 'Edit Content', action: () => setActiveTab('content'), icon: Edit3, color: 'text-purple-500' },
                                { label: 'Add Resource', action: () => setActiveTab('resources'), icon: Plus, color: 'text-blue-500' },
                                { label: 'Answer Queries', action: () => setActiveTab('chats'), icon: MessageCircle, color: 'text-amber-500' },
                                { label: 'Manage Quizzes', action: () => setActiveTab('quizzes'), icon: Trophy, color: 'text-emerald-500' },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={action.action}
                                    className="p-4 rounded-xl border-2 border-gray-200 dark:border-purple-900/30 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex flex-col items-center gap-2"
                                >
                                    <action.icon size={24} className={action.color} />
                                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Curriculum Overview */}
                    <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen size={18} className="text-purple-500" />
                            Curriculum Status
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {levels.map((lvl) => (
                                <div key={lvl} className="p-4 bg-gray-50 dark:bg-purple-900/20 rounded-lg">
                                    <p className="font-medium text-gray-900 dark:text-white mb-2">{lvl}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${lvl === 'Beginner' ? 'w-1/2 bg-emerald-500' : lvl === 'Intermediate' ? 'w-1/4 bg-amber-500' : 'w-0 bg-purple-500'}`}></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">{lvl === 'Beginner' ? '15/30 days' : lvl === 'Intermediate' ? '8/30 days' : '0/30 days'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
                <div className="space-y-6">
                    {/* Lesson Selector */}
                    <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Globe size={18} className="text-purple-500" />
                                Select Lesson
                            </h2>
                            <button
                                onClick={handleTogglePublish}
                                className={clsx(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                                    contentData[activeLanguage]?.published
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                )}
                            >
                                {contentData[activeLanguage]?.published ? <Eye size={16} /> : <EyeOff size={16} />}
                                {contentData[activeLanguage]?.published ? 'Published' : 'Draft'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Level</label>
                                <div className="relative">
                                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full appearance-none bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Day</label>
                                <div className="relative">
                                    <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full appearance-none bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        {days.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Language Tabs */}
                    <div className="bg-white dark:bg-[#1a1025] rounded-xl p-2 shadow-lg flex gap-1 overflow-x-auto">
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setActiveLanguage(lang)}
                                className={clsx(
                                    'px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2',
                                    activeLanguage === lang
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                                )}
                            >
                                {lang}
                                {langStatus[lang] ? (
                                    <CheckCircle size={14} className={activeLanguage === lang ? 'text-emerald-300' : 'text-emerald-500'} />
                                ) : (
                                    <Circle size={14} className="text-gray-400" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-900 dark:text-white">
                                {level} → {day} → {activeLanguage}
                            </h2>
                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                <Sparkles size={14} />
                                Auto Translate
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Lesson Title</label>
                                <input
                                    type="text"
                                    value={contentData[activeLanguage]?.title || ''}
                                    onChange={(e) => handleContentChange('title', e.target.value)}
                                    placeholder="Enter lesson title..."
                                    className="w-full bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Lesson Content</label>
                                <textarea
                                    value={contentData[activeLanguage]?.content || ''}
                                    onChange={(e) => handleContentChange('content', e.target.value)}
                                    placeholder="Enter lesson content..."
                                    rows={8}
                                    className="w-full bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                />
                            </div>
                            <button
                                onClick={handleSaveContent}
                                disabled={saving}
                                className={clsx(
                                    'w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2',
                                    saved
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                                )}
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2"><Clock size={18} className="animate-spin" /> Saving...</span>
                                ) : saved ? (
                                    <span className="flex items-center gap-2"><Check size={18} /> Saved!</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Save size={18} /> Save Content</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Add Resource */}
                    <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Plus size={18} className="text-purple-500" />
                            Add New Resource
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Resource URL</label>
                                <input type="url" value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} placeholder="https://..." className="w-full bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Language</label>
                                <div className="flex gap-2">
                                    {languages.map((lang) => (
                                        <button key={lang} onClick={() => setResourceLang(lang)} className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', resourceLang === lang ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-purple-900/20 text-gray-600 dark:text-gray-400')}>
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Title</label>
                                <input type="text" value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} placeholder="Resource title..." className="w-full bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</label>
                                <textarea value={resourceDesc} onChange={(e) => setResourceDesc(e.target.value)} placeholder="Brief description..." rows={3} className="w-full bg-gray-50 dark:bg-purple-900/20 border border-gray-200 dark:border-purple-900/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                            </div>
                            <button onClick={handleAddResource} disabled={!resourceUrl || !resourceTitle} className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                <Plus size={18} />
                                Add Resource
                            </button>
                        </div>
                    </div>

                    {/* Resource List */}
                    <div className="bg-white dark:bg-[#1a1025] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-purple-900/30">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Star size={18} className="text-amber-500" />
                            Existing Resources ({resources.length})
                        </h2>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {resources.map((resource) => (
                                <div key={resource.id} className="p-4 bg-gray-50 dark:bg-purple-900/20 rounded-lg group hover:bg-gray-100 dark:hover:bg-purple-900/30 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">{Object.values(resource.title)[0]}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{Object.values(resource.description)[0]}</p>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-500 hover:text-purple-600 flex items-center gap-1 mt-2">
                                                <ExternalLink size={12} />
                                                Open Link
                                            </a>
                                        </div>
                                        <button onClick={() => handleDeleteResource(resource.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Community Tab */}
            {activeTab === 'community' && (
                <div className="bg-white dark:bg-[#1a1025] rounded-xl shadow-lg border border-gray-100 dark:border-purple-900/30 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-purple-900/30 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users size={18} className="text-purple-500" />
                            Forum Moderation
                        </h2>
                        <span className="text-sm text-gray-500">{threads.filter(t => t.status === 'active').length} active threads</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-purple-900/30">
                        {threads.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map((thread) => (
                            <div key={thread.id} className={clsx('p-4 flex items-center gap-4 transition-colors', thread.status === 'moderated' ? 'bg-red-50 dark:bg-red-900/10 opacity-60' : 'hover:bg-gray-50 dark:hover:bg-purple-900/20')}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {thread.pinned && <Pin size={14} className="text-amber-500 flex-shrink-0" />}
                                        <h3 className={clsx('font-medium truncate', thread.status === 'moderated' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white')}>{thread.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><User size={12} />{thread.author}</span>
                                        <span>{thread.replies} replies</span>
                                        <span>{thread.likes} likes</span>
                                        <span>{thread.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {thread.status === 'active' && (
                                        <>
                                            <button onClick={() => togglePin(thread.id)} className={clsx('p-2 rounded-lg transition-colors', thread.pinned ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'hover:bg-gray-100 dark:hover:bg-purple-900/30 text-gray-400')} title={thread.pinned ? 'Unpin' : 'Pin'}>
                                                <Pin size={16} />
                                            </button>
                                            <button onClick={() => moderateThread(thread.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors" title="Remove">
                                                <X size={16} />
                                            </button>
                                        </>
                                    )}
                                    {thread.status === 'moderated' && (
                                        <button onClick={() => restoreThread(thread.id)} className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-emerald-500 rounded-lg transition-colors" title="Restore">
                                            <Check size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Chats/Queries Tab */}
            {activeTab === 'chats' && (
                <div className="bg-white dark:bg-[#1a1025] rounded-xl shadow-lg border border-gray-100 dark:border-purple-900/30 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-purple-900/30 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <MessageCircle size={18} className="text-purple-500" />
                            Student Queries
                        </h2>
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Clock size={14} />
                            {pendingCount} pending
                        </span>
                    </div>
                    <div className="h-[450px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0f0a1a]">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                                    <MessageCircle className="text-purple-400" size={32} />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">No queries yet</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Student questions will appear here</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'guru' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'guru' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${message.sender === 'guru' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-purple-600'}`}>
                                            {message.sender === 'guru' ? <Sparkles className="text-white" size={18} /> : <User className="text-white" size={18} />}
                                        </div>
                                        <div className={`rounded-2xl px-4 py-3 ${message.sender === 'guru' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-tr-sm' : 'bg-white dark:bg-[#1a1025] text-gray-900 dark:text-white rounded-tl-sm shadow-lg border border-gray-100 dark:border-purple-900/30'}`}>
                                            <p className="text-sm lg:text-base">{message.text}</p>
                                            <p className={`text-xs mt-2 ${message.sender === 'guru' ? 'text-white/70' : 'text-gray-400'}`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-purple-900/30 bg-white dark:bg-[#1a1025]">
                        <div className="flex gap-3">
                            <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendReply()} placeholder="Type your response..." className="flex-1 bg-gray-100 dark:bg-purple-900/20 border-0 rounded-full px-5 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <button onClick={handleSendReply} disabled={!replyText.trim()} className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white flex items-center justify-center transition-colors">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
                <div className="bg-white dark:bg-[#1a1025] rounded-xl shadow-lg border border-gray-100 dark:border-purple-900/30 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-purple-900/30 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Trophy size={18} className="text-amber-500" />
                            Quiz Management
                        </h2>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm">
                            <Plus size={16} />
                            Create Quiz
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-purple-900/20">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Level</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Day</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Questions</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Attempts</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-purple-900/20">
                                {quizzes.map((quiz) => (
                                    <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-purple-900/10">
                                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{quiz.level}</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{quiz.day}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{quiz.questions}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{quiz.attempts}</td>
                                        <td className="py-3 px-4">
                                            <span className={clsx('px-2.5 py-1 rounded-full text-xs font-medium', quiz.enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400')}>
                                                {quiz.enabled ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => toggleQuiz(quiz.id)} className={clsx('p-2 rounded-lg transition-colors', quiz.enabled ? 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/20' : 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/20')} title={quiz.enabled ? 'Disable' : 'Enable'}>
                                                    {quiz.enabled ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                <button className="p-2 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg" title="Edit">
                                                    <Edit3 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
