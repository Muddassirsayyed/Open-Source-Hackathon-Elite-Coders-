'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';
import { Sun, Moon, Globe, Menu, X, User as UserIcon, LogOut, Flame } from 'lucide-react';
import { Locale } from '@/context/translations';

interface NavbarProps {
  onOpenEmergency?: () => void;
}

export default function Navbar({ onOpenEmergency }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/services', label: t('nav_services') },
    { href: '/how-it-works', label: t('nav_how_it_works') },
    ...(isAuthenticated ? [{ href: '/dashboard', label: t('nav_dashboard') }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                FixMate
              </span>
              <span className="px-1.5 py-0.5 text-xs font-semibold text-white bg-blue-600 dark:bg-blue-500 rounded-md animate-pulse">
                AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons (Right) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Emergency Mode Button */}
            <button
              onClick={onOpenEmergency || (() => router.push('/booking?emergency=true'))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-full shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-200 animate-bounce cursor-pointer"
            >
              <Flame size={14} className="animate-pulse" />
              {t('emergency_btn')}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors"
                title="Change Language"
              >
                <Globe size={18} />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 z-50">
                  {(['en', 'hi', 'mr'] as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocale(loc);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        locale === loc
                          ? 'font-bold text-blue-600 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {loc === 'en' ? 'English' : loc === 'hi' ? 'हिन्दी' : 'मराठी'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Session Links */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-500 font-medium"
                >
                  <UserIcon size={16} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title={t('nav_logout')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Selection */}
            <button
              onClick={() => {
                const nextLoc: Locale = locale === 'en' ? 'hi' : locale === 'hi' ? 'mr' : 'en';
                setLocale(nextLoc);
              }}
              className="p-1.5 text-xs text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-800 rounded"
            >
              {locale.toUpperCase()}
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-slate-300 rounded-full"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full px-4 pt-2 pb-4 space-y-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {/* Mobile Emergency Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEmergency) onOpenEmergency();
                else router.push('/booking?emergency=true');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-md shadow-md animate-pulse"
            >
              <Flame size={16} />
              {t('emergency_btn')}
            </button>

            {isAuthenticated && user ? (
              <div className="space-y-1 pt-1">
                <div className="px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Logged in as: <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-md"
                >
                  <LogOut size={16} />
                  {t('nav_logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-md"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
