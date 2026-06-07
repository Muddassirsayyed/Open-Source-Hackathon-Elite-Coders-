'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { useI18n } from '@/context/I18nContext';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, CheckCircle, ArrowRight, ShieldCheck, Smile } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    {
      number: '01',
      title: t('step_1'),
      description: t('step_1_desc'),
      icon: <Search className="w-8 h-8 text-blue-500" />,
      color: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30'
    },
    {
      number: '02',
      title: t('step_2'),
      description: t('step_2_desc'),
      icon: <MapPin className="w-8 h-8 text-indigo-500" />,
      color: 'from-indigo-500/20 to-violet-500/20',
      border: 'border-indigo-500/30'
    },
    {
      number: '03',
      title: t('step_3'),
      description: t('step_3_desc'),
      icon: <Calendar className="w-8 h-8 text-purple-500" />,
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30'
    },
    {
      number: '04',
      title: t('step_4'),
      description: t('step_4_desc'),
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-16 px-4 max-w-7xl mx-auto w-full relative">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4 inline-block">
            Seamless Workflow
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            How FixMate AI Works
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-500 dark:text-slate-400">
            Get your home repairs and tech support solved in 4 simple steps. Verified professionals, transparent pricing, guaranteed.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between`}
            >
              {/* Step indicator */}
              <div className="absolute top-4 right-6 text-3xl font-extrabold bg-gradient-to-b from-blue-500/10 to-transparent bg-clip-text text-transparent dark:from-slate-700/20 group-hover:scale-110 transition-transform duration-300">
                {step.number}
              </div>

              <div>
                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} border ${step.border} flex items-center justify-center mb-6 shadow-inner`}>
                  {step.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connected Line (Desktop) */}
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-slate-300 dark:text-slate-700">
                  <ArrowRight size={20} className="animate-pulse" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <section className="mt-24 bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 md:p-12 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white">
                Why Choose FixMate AI?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                FixMate AI is built specifically for open-source speed and transparency. We remove the middleman and connect you directly with nearby pros using live coordinates.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Verified Credentials</h4>
                    <p className="text-[10px] text-slate-400">All registered service providers go through identity, background, and skill verification.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0">
                    <Smile size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Customer Satisfaction first</h4>
                    <p className="text-[10px] text-slate-400">Read verified reviews from other users in your neighbourhood before making a booking.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-slate-800 dark:to-slate-800 rounded-2xl text-white space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              
              <h3 className="text-lg font-bold">Ready to get started?</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Find online plumbers, electricians, cleaners, and technical experts located right inside your city sector. Check the live mapping view now.
              </p>
              
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-50 active:scale-95 transition-all shadow-md"
              >
                Browse Services Now
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}
