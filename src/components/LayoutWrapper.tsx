'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Auth pages - no sidebar
    const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/admin/login';

    if (isAuthPage) {
        return <>{children}</>;
    }

    // Main app pages - with sidebar
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                {children}
            </main>
        </div>
    );
}
