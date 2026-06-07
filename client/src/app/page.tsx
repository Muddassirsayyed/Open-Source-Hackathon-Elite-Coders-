'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/I18nContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Search, Flame, Shield, Award, MapPin, Users, CheckCircle, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/professionals?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/services');
    }
  };

  const serviceCategories = [
    { name: 'Plumber', icon: '🔧', count: '12 Pros Online' },
    { name: 'Electrician', icon: '⚡', count: '8 Pros Online' },
    { name: 'Mechanic', icon: '🚗', count: '15 Pros Online' },
    { name: 'Carpenter', icon: '🪚', count: '6 Pros Online' },
    { name: 'Painter', icon: '🎨', count: '9 Pros Online' },
    { name: 'AC Repair', icon: '❄️', count: '14 Pros Online' },
    { name: 'Home Cleaner', icon: '🧹', count: '10 Pros Online' },
    { name: 'Appliance Repair', icon: '🔌', count: '11 Pros Online' }
  ];

  const stats = [
    { label: t('stats_workers'), value: '150+', icon: <Users className="text-blue-500" /> },
    { label: t('stats_bookings'), value: '4,800+', icon: <CheckCircle className="text-emerald-500" /> },
    { label: t('stats_rating'), value: '4.85 / 5', icon: <Star className="text-yellow-500 fill-yellow-400" /> },
    { label: t('stats_coverage'), value: '25+ Cities', icon: <MapPin className="text-indigo-500" /> }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-blue-50/50 via-slate-50 to-white dark:from-slate-900/30 dark:via-slate-950 dark:to-slate-950">
        {/* Decorative Blurred Circles */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-600/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/10 w-96 h-96 rounded-full bg-indigo-400/10 dark:bg-indigo-600/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6">
            <SparklesIcon className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('brand')} - Smart Assistant App</span>
          </div>

          {/* Hero Typography */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t('hero_title')}
          </h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('hero_sub')}
          </p>

          {/* Search Box Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto p-2 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none flex flex-col sm:flex-row gap-2 mb-12 backdrop-blur-md"
          >
            <div className="flex-1 flex items-center px-4 gap-2">
              <Search className="text-slate-400 shrink-0" size={18} />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              {t('search_btn')}
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/services"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              Explore Services
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => router.push('/booking?emergency=true')}
              className="px-6 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-950/20 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <Flame size={16} />
              {t('emergency_btn')}
            </button>
          </div>
        </div>
      </header>

      {/* Trust Badges */}
      <section className="bg-slate-50 dark:bg-slate-950/60 border-y border-slate-200/50 dark:border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <div className="flex items-center gap-1.5"><Shield size={16} className="text-blue-500" /> 100% Verified Professionals</div>
          <div className="flex items-center gap-1.5"><Award size={16} className="text-blue-500" /> Satisfaction Guarantee</div>
          <div className="flex items-center gap-1.5"><Flame size={16} className="text-red-500 animate-pulse" /> 30-Minute Emergency Dispatch</div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-16 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Popular Services
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Browse top service categories and book reliable solutions in clicks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {serviceCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/professionals?profession=${encodeURIComponent(cat.name)}`)}
                className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{cat.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{cat.count}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1 hover:underline"
            >
              View All 10+ Categories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-2 p-6 bg-white/5 dark:bg-slate-800/20 backdrop-blur border border-white/10 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mx-auto text-lg shadow">
                  {stat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold">{stat.value}</h3>
                <p className="text-xs text-blue-100 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('testimonials_title')}
            </h2>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Thousands of happy home owners trust FixMate AI every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <p className="text-xs italic text-slate-600 dark:text-slate-300">
                &quot;The emergency mode is a lifesaver! My kitchen pipe burst at 9 PM and a plumber arrived within 25 minutes. Recommended to everyone.&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600">SM</div>
                <div>
                  <h4 className="text-xs font-bold">Sameer Mehta</h4>
                  <p className="text-[10px] text-slate-400">Mumbai User</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <p className="text-xs italic text-slate-600 dark:text-slate-300">
                &quot;I booked a technician to fix my internet router. He was professional, verified, and fixed the configuration in 10 minutes. Transparent pricing was a big plus!&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600">PD</div>
                <div>
                  <h4 className="text-xs font-bold">Pooja Deshmukh</h4>
                  <p className="text-[10px] text-slate-400">Pune User</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <p className="text-xs italic text-slate-600 dark:text-slate-300">
                &quot;The AI assistant guided me perfectly. I typed &apos;AC is not cooling&apos; and it showed me 3 active professionals immediately with ratings and distance. Super smart.&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-600">AR</div>
                <div>
                  <h4 className="text-xs font-bold">Aman Roy</h4>
                  <p className="text-[10px] text-slate-400">Delhi User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chatbot */}
      <Chatbot />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.071 4.929L18.5 8L17.929 4.929L15 4.357L17.929 3.786L18.5 1L19.071 3.786L22 4.357L19.071 4.929Z"
      />
    </svg>
  );
}
