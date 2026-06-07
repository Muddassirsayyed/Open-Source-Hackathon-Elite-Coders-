'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';
import { Heart, Star } from 'lucide-react';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Tagline */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                FixMate
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-600 dark:bg-blue-500 rounded">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {t('tagline')}. Bridging the gap between active local service providers and home owners.
            </p>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                React/Next.js 15
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Node/Express
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                MongoDB
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-500 transition-colors">
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-500 transition-colors">
                  {t('nav_services')}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-500 transition-colors">
                  {t('nav_how_it_works')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-500 transition-colors">
                  {t('nav_dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Github */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Hackathon Project
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://github.com/Muddassirsayyed/Open-Source-Hackathon-Elite-Coders-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                >
                  <GithubIcon size={14} />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Star size={14} className="text-yellow-500" />
                <span>Rate this project</span>
              </li>
              <li>
                <span className="text-slate-400">Team Elite Coders</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} FixMate AI. All rights reserved. Open Source under MIT License.
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span>Made with</span>
            <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by Team Elite Coders</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
