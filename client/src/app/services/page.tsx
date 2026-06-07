'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Star, ShieldCheck, Flame, ChevronRight, Loader2, ArrowRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  count: number;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Core Service categories data
  const staticServices = [
    {
      id: '1',
      title: 'Plumber',
      description: 'Expert pipe fixing, leak repairs, bathroom fittings, and drain cleaning.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
      price: 250,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Electrician',
      description: 'Short circuit fixes, wiring, switchboards, and fan/light installations.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
      price: 250,
      rating: 4.7
    },
    {
      id: '3',
      title: 'Mechanic',
      description: 'On-road breakdown assistance, engine check, battery replacement, and general car repair.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400',
      price: 399,
      rating: 4.9
    },
    {
      id: '4',
      title: 'Carpenter',
      description: 'Furniture repair, door/window fixing, custom cabinets, and drawer alignment.',
      image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400',
      price: 300,
      rating: 4.6
    },
    {
      id: '5',
      title: 'Painter',
      description: 'Interior & exterior painting, wall patching, and designer wallpapers.',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400',
      price: 500,
      rating: 4.7
    },
    {
      id: '6',
      title: 'Home Cleaner',
      description: 'Deep house cleaning, kitchen cleaning, sofa dry cleaning, and sanitization.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400',
      price: 499,
      rating: 4.9
    },
    {
      id: '7',
      title: 'AC Repair',
      description: 'AC gas filling, servicing, filter cleaning, and compressor diagnostics.',
      image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=400',
      price: 399,
      rating: 4.5
    },
    {
      id: '8',
      title: 'Appliance Repair',
      description: 'Washing machine, refrigerator, microwave, and TV fixing.',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400',
      price: 349,
      rating: 4.6
    },
    {
      id: '9',
      title: 'Water Purifier',
      description: 'Filter replacement, membrane service, TDS tuning, and water testing.',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400',
      price: 299,
      rating: 4.7
    },
    {
      id: '10',
      title: 'Internet Technician',
      description: 'Wi-Fi configuration, router setup, LAN cabling, and broadband diagnostics.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400',
      price: 199,
      rating: 4.8
    }
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/professionals`);
        const data = await res.json();
        
        if (data.success && data.data) {
          const list = staticServices.map(service => {
            const count = data.data.filter((p: any) => p.profession === service.title).length;
            return {
              ...service,
              count: count || Math.floor(Math.random() * 5) + 2 // Mock count if database has 0
            };
          });
          setServices(list);
        } else {
          setServices(staticServices.map(s => ({ ...s, count: 3 })));
        }
      } catch (err) {
        setServices(staticServices.map(s => ({ ...s, count: 3 })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-16 px-4 max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4 inline-block">
            Professional Catalog
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Our Services
          </h1>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Book certified, verified local service professionals for plumbing, electrical wiring, home appliance repair, and technical maintenance.
          </p>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600 mb-4" />
            <p className="text-xs text-slate-500">Loading catalog categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image Wrap */}
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category tag */}
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {service.count} Active Pros
                  </span>
                </div>

                {/* Body details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <Star size={14} className="fill-current" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{service.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Starting from</p>
                      <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">₹{service.price}</p>
                    </div>

                    <button
                      onClick={() => router.push(`/professionals?profession=${encodeURIComponent(service.title)}`)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center gap-1 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      Book Now
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}
