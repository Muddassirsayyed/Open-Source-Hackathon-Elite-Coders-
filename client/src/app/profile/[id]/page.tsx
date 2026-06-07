'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Star, MapPin, Phone, MessageSquare, Shield, Clock, AlertCircle, Loader2, Check } from 'lucide-react';

interface Professional {
  _id: string;
  name: string;
  profession: string;
  email: string;
  phone: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  location: {
    address: string;
  };
  skills: string[];
  availability: boolean;
  profileImage: string;
}

interface Review {
  _id: string;
  userId: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProfessionalProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const { t } = useI18n();

  const profId = params.id as string;

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfileDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch Professional info
      const profRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/professionals/${profId}`);
      const profData = await profRes.json();
      if (profData.success) {
        setProfessional(profData.data);
      }

      // Fetch Reviews
      const revRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews?professionalId=${profId}`);
      const revData = await revRes.json();
      if (revData.success) {
        setReviews(revData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profId) {
      fetchProfileDetails();
    }
  }, [profId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setReviewSuccess(false);

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Please write a review comment.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          professionalId: profId,
          rating,
          comment
        })
      });
      const data = await res.json();
      setIsSubmittingReview(false);

      if (data.success) {
        setReviewSuccess(true);
        setComment('');
        // Reload details to update rating averages and listing
        fetchProfileDetails();
      } else {
        setErrorMsg(data.message || 'Failed to submit review.');
      }
    } catch (err: any) {
      setIsSubmittingReview(false);
      setErrorMsg(err.message || 'Server connection error.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="py-20 text-center space-y-4">
          <AlertCircle className="mx-auto text-red-500" size={36} />
          <h1 className="text-xl font-bold">Professional Not Found</h1>
          <button onClick={() => router.push('/services')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow">
            Return to Services
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Profile Cards, Skills, Portfolio, and Reviews */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Bio Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0">
                <img
                  src={professional.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.name}`}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">{professional.name}</h1>
                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold">
                      {professional.profession}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{professional.experience} years experience &bull; Verified Partner</p>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                  <p className="flex items-center justify-center sm:justify-start gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{professional.location?.address}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-400" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">⭐ {professional.rating} ({professional.reviewsCount} reviews)</span>
                  </p>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                  {professional.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability tag */}
              <span className={`absolute top-4 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                professional.availability
                  ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 border-green-200'
                  : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 border-red-200'
              }`}>
                {professional.availability ? 'Online & Available' : 'Offline'}
              </span>
            </div>

            {/* Portfolio / Projects mock grid */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-extrabold mb-4 text-slate-950 dark:text-white uppercase tracking-wider">
                Portfolio & Showcase
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square bg-slate-100 dark:bg-slate-850 rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="work" />
                </div>
                <div className="aspect-square bg-slate-100 dark:bg-slate-850 rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="work" />
                </div>
                <div className="aspect-square bg-slate-100 dark:bg-slate-850 rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="work" />
                </div>
              </div>
            </div>

            {/* Reviews list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-extrabold mb-5 text-slate-950 dark:text-white uppercase tracking-wider">
                Reviews Logs ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No reviews posted yet. Be the first to leave a feedback!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.userId?.name}</p>
                        <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                          <Star size={10} className="fill-current" />
                          <span className="font-bold">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leave a review Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-extrabold mb-4 text-slate-950 dark:text-white uppercase tracking-wider">
                {t('submit_review')}
              </h2>

              {reviewSuccess && (
                <div className="mb-4 p-3 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-1.5">
                  <Check size={14} className="shrink-0" />
                  <span>{t('review_success')}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('rating_label')}
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>⭐ {num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('comment_label')}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your experience with this professional..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingReview ? <Loader2 size={12} className="animate-spin" /> : null}
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Quick Action Sidebar (Booking CTA card) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm sticky top-20 text-center space-y-4">
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Book service</h3>
            <p className="text-xs text-slate-400">Need help from {professional.name.split(' ')[0]}? Book an appointment now.</p>
            
            <div className="border-t border-b border-slate-100 dark:border-slate-800 py-3 text-[10px] text-slate-500 text-left space-y-2">
              <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
                <Clock size={12} />
                <span>Base Rate: ₹250 / visit</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Shield size={12} />
                <span>FixMate Safety Verified</span>
              </p>
            </div>

            <button
              onClick={() => router.push(`/booking?professionalId=${professional._id}&profession=${professional.profession}`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Configure Schedule
            </button>

            {/* Quick Contacts */}
            <div className="flex gap-2 justify-center pt-2">
              <a
                href={`tel:${professional.phone}`}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Phone size={14} />
              </a>
              <a
                href={`https://wa.me/${professional.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <MessageSquare size={14} />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}
