'use client';

import { useState, useEffect } from 'react';
import { Lock, ArrowRight, Unlock, X, CreditCard, Check, Globe, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { detectIndianUser, convertToINR, plans, initiateRazorpayPayment, createRazorpayOrder } from '@/lib/payments';

const learningPaths = [
    {
        id: 'beginner',
        title: 'Beginner Path',
        subtitle: 'Basics of Rashis & Bhavas',
        isCurrent: true,
        price: null,
        priceValue: 0,
        locked: false,
    },
    {
        id: 'intermediate',
        title: 'Intermediate',
        subtitle: 'Planetary strengths & aspects',
        isCurrent: false,
        price: '$1.99/mo',
        priceValue: 1.99,
        locked: true,
    },
    {
        id: 'advanced',
        title: 'Advanced',
        subtitle: 'Predictive Dashas & Yogas',
        isCurrent: false,
        price: '$2.99/mo',
        priceValue: 2.99,
        locked: true,
    },
];

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: typeof learningPaths[0] | null;
    isIndian: boolean;
    userEmail: string;
    userName: string;
}

function PaymentModal({ isOpen, onClose, plan, isIndian, userEmail, userName }: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'lemon'>('razorpay');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setPaymentMethod(isIndian ? 'razorpay' : 'lemon');
    }, [isIndian]);

    if (!isOpen || !plan) return null;

    const inrPrice = convertToINR(plan.priceValue);
    const displayPrice = isIndian ? `₹${inrPrice}` : `$${plan.priceValue}`;
    const planName = plan.id === 'intermediate' ? 'Intermediate Access' : 'Advanced Access';

    const handleRazorpayPayment = async () => {
        setLoading(true);
        setError('');

        try {
            const order = await createRazorpayOrder(plan.id);

            await initiateRazorpayPayment(
                order.orderId,
                order.amount,
                planName,
                userEmail,
                userName,
                (paymentId) => {
                    console.log('Payment successful:', paymentId);
                    // TODO: Update user subscription in Firestore
                    onClose();
                    alert('Payment successful! Your subscription is now active.');
                },
                (err) => {
                    setError(err.message || 'Payment failed');
                }
            );
        } catch (err: any) {
            setError(err.message || 'Failed to initiate payment');
        } finally {
            setLoading(false);
        }
    };

    const handleLemonSqueezyPayment = async () => {
        setLoading(true);
        setError('');

        try {
            // In production, open Lemon Squeezy checkout
            const checkoutUrl = `https://jyotishveda.lemonsqueezy.com/checkout?variant=${plan.id}`;
            window.open(checkoutUrl, '_blank');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to open checkout');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = () => {
        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else {
            handleLemonSqueezyPayment();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-700 to-purple-600 p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-white">Secure Payment</h2>
                    <p className="text-purple-200 text-sm">Invest in your spiritual growth</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <p className="text-gray-500 text-sm">You are purchasing</p>
                        <h3 className="text-xl font-bold text-gray-900">{planName}</h3>
                        <p className="text-3xl font-bold text-amber-500">
                            {displayPrice}<span className="text-base font-normal text-gray-500">/month</span>
                        </p>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3 mb-6">
                        {/* Razorpay - India */}
                        <button
                            onClick={() => setPaymentMethod('razorpay')}
                            className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all ${paymentMethod === 'razorpay'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <IndianRupee className="text-blue-600" size={20} />
                                <div className="text-left">
                                    <span className="font-medium text-gray-900 block">Razorpay</span>
                                    <span className="text-xs text-gray-500">UPI, Cards, NetBanking (India)</span>
                                </div>
                            </div>
                            {paymentMethod === 'razorpay' && <Check className="text-purple-600" size={20} />}
                        </button>

                        {/* Lemon Squeezy - International */}
                        <button
                            onClick={() => setPaymentMethod('lemon')}
                            className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all ${paymentMethod === 'lemon'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="text-green-600" size={20} />
                                <div className="text-left">
                                    <span className="font-medium text-gray-900 block">International Cards</span>
                                    <span className="text-xs text-gray-500">Visa, Mastercard, PayPal</span>
                                </div>
                            </div>
                            {paymentMethod === 'lemon' && <Check className="text-purple-600" size={20} />}
                        </button>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold rounded-lg transition-colors"
                    >
                        {loading ? 'Processing...' : `Pay ${paymentMethod === 'razorpay' ? `₹${inrPrice}` : `$${plan.priceValue}`}`}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                        🔒 Secured by {paymentMethod === 'razorpay' ? 'Razorpay' : 'Lemon Squeezy'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { user, userData } = useAuth();
    const [userName, setUserName] = useState('Student');
    const [userEmail, setUserEmail] = useState('');
    const [currentDay, setCurrentDay] = useState(1);
    const [isIndian, setIsIndian] = useState(false);
    const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; plan: typeof learningPaths[0] | null }>({
        isOpen: false,
        plan: null,
    });

    useEffect(() => {
        const name = user?.displayName || localStorage.getItem('userName') || 'Student';
        const email = user?.email || '';
        setUserName(name);
        setUserEmail(email);
        setCurrentDay(userData?.currentDay || 1);
        setIsIndian(detectIndianUser());
    }, [user, userData]);

    const handleUpgrade = (plan: typeof learningPaths[0]) => {
        setPaymentModal({ isOpen: true, plan });
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Payment Modal */}
            <PaymentModal
                isOpen={paymentModal.isOpen}
                onClose={() => setPaymentModal({ isOpen: false, plan: null })}
                plan={paymentModal.plan}
                isIndian={isIndian}
                userEmail={userEmail}
                userName={userName}
            />

            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 right-20 w-20 h-20 bg-purple-400/20 rounded-full translate-y-1/2"></div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Namaste, {userName}</h1>
                <p className="text-purple-200">Day {currentDay} of your journey.</p>
            </div>

            {/* Learning Paths */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {learningPaths.map((path) => (
                    <div
                        key={path.id}
                        className={`bg-white dark:bg-[#1a1025] rounded-xl p-5 shadow-lg transition-all ${path.isCurrent
                            ? 'border-2 border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                            : 'border border-gray-100 dark:border-purple-900/30'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{path.title}</h3>
                            {path.locked && <Lock className="text-gray-400" size={18} />}
                            {!path.locked && path.isCurrent && <Unlock className="text-purple-500" size={18} />}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{path.subtitle}</p>

                        {path.isCurrent && (
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 mb-3">
                                <Unlock size={14} />
                                Current Plan
                            </p>
                        )}

                        {path.isCurrent ? (
                            <Link
                                href="/syllabus/beginner"
                                className="w-full py-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                            >
                                View Lessons
                                <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleUpgrade(path)}
                                className={`w-full py-2.5 rounded-lg font-medium transition-colors ${path.price === '$2.99/mo'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                                    }`}
                            >
                                Upgrade {isIndian ? `₹${convertToINR(path.priceValue)}` : path.price}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
