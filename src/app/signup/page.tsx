'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'sa', name: 'Sanskrit' },
];

export default function SignUpPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('en');
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, name);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setLoading(true);

        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up with Google');
        } finally {
            setLoading(false);
        }
    };

    const selectedLang = languages.find(l => l.code === language);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-700 to-purple-600 p-8 text-center relative">
                        {/* Language Selector */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                    className="bg-purple-500/50 hover:bg-purple-500/70 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors"
                                >
                                    {selectedLang?.name}
                                    <ChevronDown size={14} />
                                </button>

                                {langDropdownOpen && (
                                    <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[120px]">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setLangDropdownOpen(false);
                                                }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-purple-50 transition-colors flex items-center gap-2 ${language === lang.code
                                                        ? 'bg-purple-100 text-purple-700 font-medium'
                                                        : 'text-gray-700'
                                                    }`}
                                            >
                                                {language === lang.code && <span className="text-purple-600">✓</span>}
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                Change
                            </button>
                        </div>

                        {/* Sun Icon */}
                        <div className="inline-flex items-center justify-center mb-4">
                            <svg className="w-16 h-16 text-amber-400" viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="32" r="12" fill="currentColor" />
                                <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                    <line x1="32" y1="4" x2="32" y2="12" />
                                    <line x1="32" y1="52" x2="32" y2="60" />
                                    <line x1="4" y1="32" x2="12" y2="32" />
                                    <line x1="52" y1="32" x2="60" y2="32" />
                                    <line x1="12.2" y1="12.2" x2="17.9" y2="17.9" />
                                    <line x1="46.1" y1="46.1" x2="51.8" y2="51.8" />
                                    <line x1="12.2" y1="51.8" x2="17.9" y2="46.1" />
                                    <line x1="46.1" y1="17.9" x2="51.8" y2="12.2" />
                                </g>
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">Jyotish Veda</h1>
                        <p className="text-purple-200">Create your account</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignUp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>

                        {/* Admin Login */}
                        <button
                            onClick={() => router.push('/admin/login')}
                            className="w-full mt-4 py-3 bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Settings size={18} />
                            Login as App Owner (Admin)
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-gray-400 text-sm">Or continue with</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Google Button */}
                        <button
                            onClick={handleGoogleSignUp}
                            disabled={loading}
                            className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>

                        {/* Sign In Link */}
                        <p className="mt-6 text-center text-gray-600 text-sm">
                            Already have an account?{' '}
                            <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium underline">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
