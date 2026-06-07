'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { MapPin, Phone, MessageSquare, Star, Sparkles, Navigation, ListFilter, Check, Loader2, ArrowRight } from 'lucide-react';

interface Professional {
  _id: string;
  name: string;
  profession: string;
  phone: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  profileImage: string;
  availability: boolean;
  skills: string[];
  distance?: number;
  recommendationScore?: number;
}

function ProfessionalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, updateLocation } = useAuth();

  const professionParam = searchParams.get('profession') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [profession, setProfession] = useState(professionParam);
  const [searchVal, setSearchVal] = useState(searchParam);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [useAIRecommendation, setUseAIRecommendation] = useState(false);
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null);

  // User location coordinate center (default BKC Mumbai if no geolocation)
  const [mapCenter, setMapCenter] = useState({
    lat: 19.0760,
    lng: 72.8777,
    address: 'Mumbai, Maharashtra, India'
  });

  const categories = [
    'All', 'Plumber', 'Electrician', 'Mechanic', 'Carpenter', 'Painter',
    'Home Cleaner', 'AC Repair', 'Appliance Repair', 'Water Purifier', 'Internet Technician'
  ];

  const fetchProfessionals = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/professionals?lat=${lat}&lng=${lng}`;
      if (profession !== 'All') {
        url += `&profession=${encodeURIComponent(profession)}`;
      }
      if (searchVal) {
        url += `&search=${encodeURIComponent(searchVal)}`;
      }
      if (useAIRecommendation) {
        url += `&recommend=true`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setProfessionals(data.data);
        if (data.data.length > 0) {
          setSelectedProf(data.data[0]);
        } else {
          setSelectedProf(null);
        }
      }
    } catch (err) {
      console.error('Error fetching professionals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Sync query parameters on load
    setProfession(professionParam);
    setSearchVal(searchParam);
  }, [professionParam, searchParam]);

  // Initial fetch based on location
  useEffect(() => {
    const activeLat = user?.location?.latitude || mapCenter.lat;
    const activeLng = user?.location?.longitude || mapCenter.lng;
    setMapCenter({
      lat: activeLat,
      lng: activeLng,
      address: user?.location?.address || mapCenter.address
    });
    fetchProfessionals(activeLat, activeLng);
  }, [profession, searchVal, useAIRecommendation, user]);

  // Handle Geolocation detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newAddress = `Sector Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        
        setMapCenter({
          lat: latitude,
          lng: longitude,
          address: newAddress
        });

        if (token) {
          await updateLocation(latitude, longitude, newAddress);
        }
        
        setIsDetectingLoc(false);
        fetchProfessionals(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not retrieve your location. Falling back to Mumbai center.');
        setIsDetectingLoc(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Ribbon */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative shrink-0">
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ListFilter size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* AI Recommendation Toggle */}
            <button
              onClick={() => setUseAIRecommendation(!useAIRecommendation)}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all border border-blue-500/20 cursor-pointer ${
                useAIRecommendation
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sparkles size={14} className={useAIRecommendation ? 'animate-pulse text-yellow-300' : ''} />
              Smart AI Recommendation
            </button>
          </div>

          {/* Search Value */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by worker name..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none w-full md:w-56"
            />
            {/* Geolocation Trigger */}
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLoc}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-100 disabled:opacity-50 cursor-pointer shrink-0"
              title="Get Current Location"
            >
              {isDetectingLoc ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Navigation size={14} className="rotate-45" />
              )}
              <span>GPS</span>
            </button>
          </div>
        </div>

        {/* Search Results Summary */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
          <p>
            Showing {professionals.length} active {profession === 'All' ? 'professionals' : profession + 's'} found near: <span className="font-semibold text-slate-800 dark:text-slate-200">{mapCenter.address}</span>
          </p>
        </div>

        {/* Dashboard Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Professionals Listing */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm">
                <Loader2 size={32} className="animate-spin text-blue-600 mb-4" />
                <p className="text-xs text-slate-500">Scanning sector maps for active workers...</p>
              </div>
            ) : professionals.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
                <MapPin className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={40} />
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-200">No Professionals Found</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                  We currently don&apos;t have any active workers in this category near this coordinate sector. Try choosing a different service or resetting filters.
                </p>
              </div>
            ) : (
              professionals.map((prof) => {
                const isSelected = selectedProf?._id === prof._id;
                return (
                  <div
                    key={prof._id}
                    onClick={() => setSelectedProf(prof)}
                    className={`p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm transition-all duration-300 flex flex-col sm:flex-row gap-5 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/10 scale-[1.01]'
                        : 'border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300'
                    }`}
                  >
                    {/* Selected Left Stripe Accent */}
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500" />
                    )}

                    {/* Left: Avatar & Rating */}
                    <div className="flex sm:flex-col items-center gap-3 shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                        <img
                          src={prof.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${prof.name}`}
                          alt={prof.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-full text-[10px] font-bold text-yellow-600">
                        <Star size={10} className="fill-current" />
                        <span>{prof.rating}</span>
                      </div>
                    </div>

                    {/* Middle details */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">{prof.name}</h3>
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold">
                            {prof.profession}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{prof.experience} years experience</p>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <p className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span>{prof.location.address}</span>
                        </p>
                        {prof.distance !== undefined && (
                          <p className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                            <Navigation size={10} className="text-slate-400 shrink-0 rotate-45" />
                            <span>Distance: {prof.distance} km away</span>
                          </p>
                        )}
                      </div>

                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prof.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[9px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex sm:flex-col justify-end items-end gap-2.5 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="flex gap-2">
                        {/* Phone call CTA */}
                        <a
                          href={`tel:${prof.phone}`}
                          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                          title="Call worker"
                        >
                          <Phone size={14} />
                        </a>
                        {/* Whatsapp chat CTA */}
                        <a
                          href={`https://wa.me/${prof.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all cursor-pointer"
                          title="WhatsApp chat"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </div>

                      {/* Direct Booking */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/booking?professionalId=${prof._id}&profession=${prof.profession}`);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Book
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Side: Interactive Visual Mapping Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm sticky top-20 backdrop-blur-xl">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Navigation size={16} className="text-blue-500 rotate-45 animate-pulse" />
              Live Radar View
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-5">
              Displays positions of online workers relative to your center.
            </p>

            {/* Custom Interactive SVG Radar Grid Map */}
            <div className="aspect-square w-full bg-slate-950 dark:bg-slate-950/90 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-850">
              {/* Radar circular lines */}
              <div className="absolute w-5/6 h-5/6 rounded-full border border-slate-800/60 flex items-center justify-center">
                <div className="w-4/6 h-4/6 rounded-full border border-slate-800/60 flex items-center justify-center">
                  <div className="w-2/6 h-2/6 rounded-full border border-slate-800/60" />
                </div>
              </div>
              
              {/* Radar sweep light overlay line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-800/40" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-800/40" />

              {/* User Center Pulse Marker */}
              <div className="absolute z-20 flex flex-col items-center">
                <span className="w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative">
                  <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></span>
                </span>
                <span className="text-[8px] bg-slate-900 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-500/20 mt-1 shadow">
                  YOU
                </span>
              </div>

              {/* Nearby Professional Markers (Simulated Mapping offsets) */}
              {!isLoading && professionals.map((prof, idx) => {
                // Calculate pseudo-offset coordinates based on coordinates distance
                const latDiff = prof.location.latitude - mapCenter.lat;
                const lngDiff = prof.location.longitude - mapCenter.lng;
                
                // Scale coordinate difference to map grid percentage (-40% to 40%)
                const scale = 3000; // coordinate delta scalar
                const xOffset = Math.max(-42, Math.min(42, lngDiff * scale));
                const yOffset = Math.max(-42, Math.min(42, -latDiff * scale)); // negative because SVG top is Y=0

                const isSelected = selectedProf?._id === prof._id;

                return (
                  <button
                    key={prof._id}
                    onClick={() => setSelectedProf(prof)}
                    className="absolute z-10 hover:z-30 group flex flex-col items-center cursor-pointer transition-transform duration-200"
                    style={{
                      transform: `translate(${xOffset}vw, ${yOffset}vw)`
                    }}
                  >
                    {/* Pulsing Pin */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-md ${
                      isSelected
                        ? 'bg-blue-600 border-white text-white scale-110 z-40'
                        : 'bg-white border-blue-500 text-slate-800 hover:scale-105'
                    }`}>
                      <span className="text-[10px] font-bold">
                        {prof.profession === 'Plumber' ? '🔧' : prof.profession === 'Electrician' ? '⚡' : '👤'}
                      </span>
                    </span>
                    {/* Tooltip Label */}
                    <span className={`text-[7px] font-bold px-1 py-0.5 rounded border mt-0.5 opacity-80 group-hover:opacity-100 shadow transition-opacity ${
                      isSelected
                        ? 'bg-blue-900 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}>
                      {prof.name.split(' ')[0]} ({prof.distance}km)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Professional preview box */}
            {selectedProf && (
              <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img
                      src={selectedProf.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProf.name}`}
                      alt={selectedProf.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{selectedProf.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {selectedProf.profession} &bull; {selectedProf.experience} yrs exp
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Skills:</span> {selectedProf.skills.join(', ')}</p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Ratings:</span> ⭐ {selectedProf.rating} ({selectedProf.reviewsCount} reviews)</p>
                </div>

                <button
                  onClick={() => router.push(`/booking?professionalId=${selectedProf._id}&profession=${selectedProf.profession}`)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Confirm Booking with {selectedProf.name.split(' ')[0]}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <ProfessionalsContent />
    </Suspense>
  );
}
