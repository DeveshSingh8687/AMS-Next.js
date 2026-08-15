'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  Users,
  ClipboardList,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Fingerprint,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { logOut } from '@/client/loginClient'
import  useCustomSession  from '../hooks/useCustomSession'

const adminLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'User Management', icon: Users },
  { href: '/attendance', label: 'Attendance', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const employeeLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/history', label: 'Attendance History', icon: Clock },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }) {
  const {userInfo} = useCustomSession()
  const role = userInfo?.role
  const pathname = usePathname();
  const links = role === 'admin' || role === 'superadmin' ? adminLinks : employeeLinks;

  const handleLogout = async () => {
    try {
      await logOut()
    }
    finally {
      await signOut({
        callbackUrl: '/login',
      });
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 bg-[#0F766E] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AttendEase</h1>
            <p className="text-[11px] text-white/60 uppercase tracking-wider">
              {role}
            </p>
          </div>
          <button className="ml-auto lg:hidden" onClick={onToggle} type="button">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
            type="button"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b z-30 flex items-center px-4">
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-gray-100" type="button">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <Fingerprint className="w-5 h-5 text-[#0F766E]" />
          <span className="font-semibold text-[#0F766E]">AttendEase</span>
        </div>
      </div>
    </>
  );
}