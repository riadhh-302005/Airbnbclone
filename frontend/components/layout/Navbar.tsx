'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Globe,
  Menu,
  Heart,
  Briefcase,
  Building2,
  UserCheck,
  Globe2,
  Home,
  Compass,
  ConciergeBell,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  activeNavTab = 'Homes',
  onSelectNavTab,
}) => {
  const { user, activeRole, switchRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NAV_TABS = [
    { label: 'All', icon: Globe2 },
    { label: 'Homes', icon: Home },
    { label: 'Experiences', icon: Compass },
    { label: 'Services', icon: ConciergeBell },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              className="w-9 h-9 text-[#FF385C] transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.308-3.327 7.806-7.5 7.806-3.155 0-6.071-1.996-7.1-4.887l-.1-.295-.1.295C13.571 30.004 10.655 32 7.5 32 3.327 32 0 28.502 0 24.194c0-.924.243-1.805.71-3.396l.145-.353c.986-2.297 5.146-11.007 7.1-14.836l.533-1.025C9.768 1.963 11.223 1 13.231 1H16zm0 3h-2.769c-1.077 0-1.848.471-2.88 2.399l-.49.943C7.994 10.978 4.088 19.144 3.09 21.467l-.132.317c-.454 1.08-.658 1.696-.658 2.41 0 2.825 2.148 5.12 4.7 5.12 2.222 0 4.331-1.579 5.093-3.79l.237-.732h7.34l.237.732c.762 2.211 2.871 3.79 5.093 3.79 2.552 0 4.7-2.295 4.7-5.12 0-.714-.204-1.33-.658-2.41l-.132-.317c-.998-2.323-4.904-10.489-6.771-14.125l-.49-.943C19.848 4.471 19.077 4 18 4H16zm0 13a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
            <span className="text-xl font-extrabold tracking-tight text-[#FF385C] hidden sm:inline">
              airbnb
            </span>
          </Link>

          {/* Navigation Categories Row (All / Homes / Experiences / Services) */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeNavTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => onSelectNavTab && onSelectNavTab(tab.label)}
                  className={`flex items-center gap-2 pb-1 text-sm font-semibold transition border-b-2 ${
                    isSelected
                      ? 'text-neutral-900 border-neutral-900 font-bold'
                      : 'text-neutral-500 border-transparent hover:text-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF385C]' : 'text-neutral-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/host"
              className="hidden lg:block font-bold text-xs text-neutral-800 hover:bg-neutral-100 px-3.5 py-2.5 rounded-full transition"
            >
              Become a host
            </Link>

            <button
              onClick={() => switchRole(activeRole === 'guest' ? 'host' : 'guest')}
              className="p-2.5 hover:bg-neutral-100 rounded-full transition text-neutral-700"
              title="Switch Language / Role"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 border border-neutral-300 rounded-full p-1.5 pl-3.5 hover:shadow-md transition bg-white"
              >
                <Menu className="w-4 h-4 text-neutral-700" />
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                />
              </button>

              {/* Menu Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-[#FF385C]">
                      <UserCheck className="w-3 h-3" />
                      <span>{activeRole === 'guest' ? 'Demo Guest' : 'Demo Host'}</span>
                    </div>
                  </div>

                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Switch Role Mode
                    </p>
                    <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
                      <button
                        onClick={() => switchRole('guest')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                          activeRole === 'guest'
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600'
                        }`}
                      >
                        Guest
                      </button>
                      <button
                        onClick={() => switchRole('host')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                          activeRole === 'host'
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600'
                        }`}
                      >
                        Host
                      </button>
                    </div>
                  </div>

                  <Link
                    href="/trips"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <Briefcase className="w-4 h-4 text-neutral-500" />
                    <span>My Trips</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <Heart className="w-4 h-4 text-neutral-500" />
                    <span>Wishlists</span>
                  </Link>

                  <div className="border-t border-neutral-100 my-1" />

                  <Link
                    href="/host"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-extrabold text-[#FF385C] hover:bg-rose-50"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Host Dashboard</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Centered Expanded Search Pill (Where | When | Who) */}
        <div className="pb-4 pt-1 flex justify-center">
          <button
            onClick={onOpenSearch}
            className="w-full max-w-3xl flex items-center justify-between border border-neutral-200 rounded-full px-6 py-2.5 shadow-md hover:shadow-lg transition duration-200 bg-white"
          >
            <div className="flex-1 text-left px-2 border-r border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-900 block">Where</span>
              <span className="text-xs text-neutral-400 font-medium">Search destinations</span>
            </div>

            <div className="flex-1 text-left px-4 border-r border-neutral-200 hidden sm:block">
              <span className="text-[11px] font-bold text-neutral-900 block">When</span>
              <span className="text-xs text-neutral-400 font-medium">Add dates</span>
            </div>

            <div className="flex-1 text-left px-4 hidden sm:block">
              <span className="text-[11px] font-bold text-neutral-900 block">Who</span>
              <span className="text-xs text-neutral-400 font-medium">Add guests</span>
            </div>

            <div className="bg-[#FF385C] hover:bg-rose-600 text-white p-3 rounded-full flex items-center justify-center shrink-0 transition shadow-sm">
              <Search className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
