// Payment utilities for Lemon Squeezy (International) and Razorpay (India)

interface PaymentPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'monthly' | 'yearly';
}

export const plans: Record<string, PaymentPlan> = {
    intermediate: {
        id: 'intermediate',
        name: 'Intermediate Access',
        price: 1.99,
        currency: 'USD',
        interval: 'monthly',
    },
    advanced: {
        id: 'advanced',
        name: 'Advanced Access',
        price: 2.99,
        currency: 'USD',
        interval: 'monthly',
    },
};

// Detect if user is in India for Razorpay
export function detectIndianUser(): boolean {
    if (typeof window === 'undefined') return false;

    // Check timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Kolkata') || timezone.includes('Calcutta')) {
        return true;
    }

    // Check navigator language
    const language = navigator.language || '';
    if (language.includes('hi') || language.includes('IN')) {
        return true;
    }

    return false;
}

// Convert USD to INR
export function convertToINR(usdAmount: number): number {
    const exchangeRate = 83; // Approximate USD to INR
    return Math.round(usdAmount * exchangeRate);
}

// Lemon Squeezy checkout
export async function createLemonSqueezyCheckout(planId: string): Promise<string> {
    const plan = plans[planId];
    if (!plan) throw new Error('Invalid plan');

    // In production, this would call your API endpoint which uses Lemon Squeezy SDK
    // For now, return a placeholder
    const variantId = planId === 'intermediate'
        ? process.env.LEMONSQUEEZY_INTERMEDIATE_VARIANT_ID
        : process.env.LEMONSQUEEZY_ADVANCED_VARIANT_ID;

    // This URL format is used by Lemon Squeezy
    return `https://your-store.lemonsqueezy.com/checkout/buy/${variantId}`;
}

// Razorpay checkout
export async function createRazorpayOrder(planId: string): Promise<{
    orderId: string;
    amount: number;
    currency: string;
}> {
    const plan = plans[planId];
    if (!plan) throw new Error('Invalid plan');

    const amountInPaise = convertToINR(plan.price) * 100; // Razorpay uses paise

    // In production, this would call your API to create a Razorpay order
    // For now, return mock data
    return {
        orderId: 'order_' + Date.now(),
        amount: amountInPaise,
        currency: 'INR',
    };
}

// Load Razorpay script
export function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(false);
            return;
        }

        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// Initialize Razorpay payment
export async function initiateRazorpayPayment(
    orderId: string,
    amount: number,
    planName: string,
    userEmail: string,
    userName: string,
    onSuccess: (paymentId: string) => void,
    onFailure: (error: any) => void
) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
        onFailure(new Error('Failed to load Razorpay'));
        return;
    }

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'Jyotish Veda',
        description: planName,
        order_id: orderId,
        handler: function (response: any) {
            onSuccess(response.razorpay_payment_id);
        },
        prefill: {
            name: userName,
            email: userEmail,
        },
        theme: {
            color: '#7c3aed', // Purple
        },
        modal: {
            ondismiss: function () {
                onFailure(new Error('Payment cancelled'));
            },
        },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
}
