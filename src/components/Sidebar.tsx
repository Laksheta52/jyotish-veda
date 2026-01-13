'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  MessageCircle,
  HelpCircle,
  Star,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

const studentLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/daily-wisdom', label: 'Daily Wisdom', icon: BookOpen },
  { href: '/challenge', label: 'Challenge', icon: Trophy },
  { href: '/community', label: 'Community', icon: MessageCircle },
  { href: '/ask-guru', label: 'Ask Guru', icon: HelpCircle },
  { href: '/resources', label: 'Resources', icon: Star },
];

const adminLinks = [
  { href: '/guru-panel', label: 'Guru Panel', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userType, setUserType] = useState<string>('student');
  const [userName, setUserName] = useState<string>('Student');

  useEffect(() => {
    // Get from localStorage as fallback, or from userData
    const type = userData?.role || localStorage.getItem('userType') || 'student';
    const name = user?.displayName || localStorage.getItem('userName') || 'Student';
    setUserType(type);
    setUserName(name);
  }, [user, userData]);

  const isAdmin = userType === 'admin';
  const navLinks = isAdmin ? adminLinks : studentLinks;

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback
      localStorage.removeItem('userType');
      localStorage.removeItem('userName');
      router.push('/login');
    }
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-purple-700/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✧</span>
          <span className="text-xl font-bold text-white">Jyotish Veda</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-purple-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{userName}</p>
            <p className="text-purple-300 text-sm">{isAdmin ? 'Administrator' : 'Student'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'text-purple-200 hover:bg-purple-700/40 hover:text-white'
              )}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-purple-700/30">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 text-purple-300 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-900 to-purple-800 z-40 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xl">✧</span>
          <span className="text-lg font-bold text-white">Jyotish Veda</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={clsx(
        'lg:hidden fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 z-50 transform transition-transform duration-300 flex flex-col',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          <X size={24} />
        </button>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 flex-col shadow-2xl">
        <NavContent />
      </aside>
    </>
  );
}
