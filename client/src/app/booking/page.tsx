'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { useSocket } from '@/context/SocketContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Calendar as CalendarIcon, Clock, AlignLeft, AlertCircle, Loader2, CheckCircle, Flame, Star, ShieldCheck } from 'lucide-react';

interface Professional {
  _id: string;
  name: string;
  profession: string;
  rating: number;
  profileImage: string;
  experience: number;
  phone: string;
}

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { addNotification } = useSocket();

  const urlProfId = searchParams.get('professionalId');
  const urlProfession = searchParams.get('profession') || 'Plumber';
  const urlEmergency = searchParams.get('emergency') === 'true';

  const [professionalId, setProfessionalId] = useState(urlProfId || '');
  const [profession, setProfession] = useState(urlProfession);
  const [isEmergency, setIsEmergency] = useState(urlEmergency);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isFetchingProf, setIsFetchingProf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const professions = [
    'Plumber', 'Electrician', 'Mechanic', 'Carpenter', 'Painter',
    'Home Cleaner', 'AC Repair', 'Appliance Repair', 'Water Purifier', 'Internet Technician'
  ];

  // Fetch professional details if ID exists
  useEffect(() => {
    if (professionalId) {
      const fetchProf = async () => {
        setIsFetchingProf(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/professionals/${professionalId}`);
          const data = await res.json();
          if (data.success && data.data) {
            setProfessional(data.data);
            setProfession(data.data.profession);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetchingProf(false);
        }
      };
      fetchProf();
    } else {
      setProfessional(null);
    }
  }, [professionalId]);

  // Sync Emergency Mode Toggle
  useEffect(() => {
    setIsEmergency(urlEmergency);
  }, [urlEmergency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      router.push(`/login?redirect=booking`);
      return;
    }

    if (!isEmergency && (!date || !time)) {
      setErrorMsg('Please select a date and time for booking.');
      return;
    }

    if (!problemDescription.trim()) {
      setErrorMsg('Please provide a short description of the problem.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          professionalId: isEmergency ? undefined : professionalId, // Server finds closest in emergency
          profession: isEmergency ? profession : undefined,
          date,
          time,
          problemDescription,
          isEmergency
        })
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setSuccess(true);
        addNotification(
          isEmergency ? '🚨 Emergency Dispatch Activated!' : '📅 Service Scheduled!',
          `Booking has been recorded. Status: ${data.data.status}`,
          'success'
        );
        setTimeout(() => {
          router.push('/dashboard');
        }, 2500);
      } else {
        setErrorMsg(data.message || 'Failed to complete booking. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Server connection failed.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16">
        {success ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-10 text-center shadow-xl space-y-6 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500" />
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isEmergency ? 'Emergency Request Active!' : 'Booking Requested Successfully!'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {isEmergency
                ? 'FixMate AI has matched and notified the closest active technician near your coordinates. They will arrive within 30 minutes.'
                : 'Your scheduled appointment has been sent to the professional for acceptance. Check live updates in your dashboard.'}
            </p>
            <div className="text-[10px] text-slate-400">
              Redirecting you to dashboard...
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${isEmergency ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`} />

            {/* Header */}
            <div className="text-center mb-8">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isEmergency
                  ? 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
              }`}>
                {isEmergency ? 'Emergency 30-Min Request' : 'Standard Service Booking'}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white mt-2">
                Configure Appointment
              </h1>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-6 p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Professional Preview (If booking specific pro) */}
            {!isEmergency && professional && (
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-250/50 dark:border-slate-800/50 rounded-2xl flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={professional.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name}`}
                    alt={professional.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">{professional.name}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{professional.profession} &bull; {professional.experience} yrs exp</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-yellow-600">
                  <Star size={10} className="fill-current" />
                  <span>{professional.rating}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selector if no Professional selected */}
              {!professional && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Service Category
                  </label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    {professions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Emergency toggle details */}
              <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                isEmergency
                  ? 'bg-red-50/50 dark:bg-red-950/10 border-red-500/20 text-red-700 dark:text-red-300'
                  : 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 accent-red-500 rounded focus:ring-red-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Flame size={14} className={isEmergency ? 'animate-pulse text-red-500' : ''} />
                    <span>Emergency Mode dispatch (arrives in 30 minutes)</span>
                  </div>
                </label>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 ml-6">
                  {isEmergency
                    ? 'Active coordinates will be used to locate the closest technician. Date and scheduling selections will be bypassed.'
                    : 'Uncheck this option to schedule a specific date and time slot for service.'}
                </p>
              </div>

              {/* Date & Time slots (Only if not Emergency Mode) */}
              {!isEmergency && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('select_date')}
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        required={!isEmergency}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('select_time')}
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        required={!isEmergency}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Problem description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('problem_desc')}
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder={t('problem_desc_placeholder')}
                    rows={4}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-xs ${
                  isEmergency
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 shadow-red-500/20'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 shadow-blue-500/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing Request...
                  </>
                ) : (
                  <>
                    {isEmergency ? '🚨 Activate Emergency Dispatch' : t('confirm_booking')}
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
