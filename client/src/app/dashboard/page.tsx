'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import {
  Calendar, Clock, User as UserIcon, Shield, RefreshCw, Star,
  Phone, Trash2, Plus, Users, Award, CheckSquare, Settings, LayoutDashboard, Globe
} from 'lucide-react';

interface Booking {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  professionalId: {
    _id: string;
    name: string;
    profession: string;
    phone: string;
    rating: number;
    profileImage: string;
    location: {
      address: string;
    }
  };
  date: string;
  time: string;
  problemDescription: string;
  isEmergency: boolean;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
  createdAt: string;
}

interface Professional {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  experience: number;
  rating: number;
  availability: boolean;
  location: { address: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuth();
  const { notifications } = useSocket();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New worker form fields (for admins)
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerProfession, setWorkerProfession] = useState('Plumber');
  const [workerExp, setWorkerExp] = useState(5);
  const [workerAddress, setWorkerAddress] = useState('Bandra West, Mumbai');
  const [workerSkills, setWorkerSkills] = useState('General fixing, diagnostics');

  const fetchDashboardData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // Fetch bookings
      const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }

      // If admin, fetch all professionals to manage
      if (user?.role === 'admin') {
        const prosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/professionals`);
        const prosData = await prosRes.json();
        if (prosData.success) {
          setProfessionals(prosData.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.push('/login');
      return;
    }
    
    if (user) {
      setIsAdminView(user.role === 'admin');
      fetchDashboardData();
    }
  }, [user, isAuthenticated, token]);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: data.data.status } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/professionals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: workerName,
          email: workerEmail,
          phone: workerPhone,
          profession: workerProfession,
          experience: Number(workerExp),
          location: {
            latitude: 19.0760 + (Math.random() - 0.5) * 0.05,
            longitude: 72.8777 + (Math.random() - 0.5) * 0.05,
            address: workerAddress
          },
          skills: workerSkills.split(',').map(s => s.trim()),
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${workerName}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfessionals(prev => [data.data, ...prev]);
        setShowAddWorker(false);
        // Clear fields
        setWorkerName('');
        setWorkerEmail('');
        setWorkerPhone('');
        setWorkerAddress('');
        setWorkerSkills('');
      } else {
        alert(data.message || 'Failed to add professional');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWorker = async (id: string) => {
    if (!confirm('Are you sure you want to delete this professional?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/professionals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfessionals(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-250',
    Accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border-blue-250',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border-green-250',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border-red-250'
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        {/* Portal Switching Ribbon */}
        {user?.role === 'admin' && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-slate-900 dark:to-slate-900 rounded-2xl p-4.5 mb-8 flex flex-col sm:flex-row items-center justify-between text-white shadow shadow-blue-500/10">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-yellow-400" />
              <div>
                <h2 className="text-sm font-bold">Administrator Session Active</h2>
                <p className="text-[10px] text-blue-100 dark:text-slate-400">Manage site statistics, bookings, and professionals.</p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className="mt-3 sm:mt-0 px-4 py-2 bg-white text-blue-600 dark:bg-slate-800 dark:text-blue-400 rounded-xl text-xs font-bold shadow hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LayoutDashboard size={14} />
              Switch to {isAdminView ? 'User View' : 'Admin View'}
            </button>
          </div>
        )}

        {/* Dashboard Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white">
              {isAdminView ? 'Admin Dashboard' : 'User Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* ADMIN VIEW LAYOUT */}
        {isAdminView && user?.role === 'admin' ? (
          <div className="space-y-8">
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl flex items-center justify-center text-lg shadow">
                  <Calendar />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Bookings</p>
                  <p className="text-xl font-black">{bookings.length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-xl flex items-center justify-center text-lg shadow">
                  <Users />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Workers</p>
                  <p className="text-xl font-black">{professionals.length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl flex items-center justify-center text-lg shadow">
                  <CheckSquare />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pending Requests</p>
                  <p className="text-xl font-black">{bookings.filter(b => b.status === 'Pending').length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl flex items-center justify-center text-lg shadow">
                  <Award />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Emergency Tasks</p>
                  <p className="text-xl font-black text-red-500">{bookings.filter(b => b.isEmergency).length}</p>
                </div>
              </div>
            </div>

            {/* Bookings Management */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <h2 className="text-base font-extrabold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <span>Manage Client Bookings</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                  {bookings.length}
                </span>
              </h2>

              {bookings.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-10">No bookings logged yet.</p>
              ) : (
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Professional</th>
                      <th className="pb-3">Schedule</th>
                      <th className="pb-3">Mode</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-950/30">
                        <td className="py-3">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{booking.userId?.name}</p>
                          <p className="text-[10px] text-slate-400">{booking.userId?.phone}</p>
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{booking.professionalId?.name}</p>
                          <p className="text-[10px] text-blue-500 font-bold">{booking.professionalId?.profession}</p>
                        </td>
                        <td className="py-3">
                          <p className="font-medium">{booking.date}</p>
                          <p className="text-[10px] text-slate-400">{booking.time}</p>
                        </td>
                        <td className="py-3">
                          {booking.isEmergency ? (
                            <span className="text-[9px] font-bold text-red-600 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded border border-red-200/50">Emergency</span>
                          ) : (
                            <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Standard</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            {booking.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, 'Accepted')}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-750 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Accept
                              </button>
                            )}
                            {booking.status === 'Accepted' && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                                className="px-2.5 py-1 bg-green-600 hover:bg-green-750 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                            {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                                className="px-2.5 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-[10px] font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Professionals Management */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Manage Professionals Directory</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    {professionals.length}
                  </span>
                </h2>

                <button
                  onClick={() => setShowAddWorker(!showAddWorker)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  Register Professional
                </button>
              </div>

              {/* Add Professional Form Box */}
              {showAddWorker && (
                <form onSubmit={handleAddWorkerSubmit} className="mb-6 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Add New Worker Profile</h3>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={workerEmail}
                      onChange={(e) => setWorkerEmail(e.target.value)}
                      placeholder="rajesh@fixmate.com"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={workerPhone}
                      onChange={(e) => setWorkerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Profession</label>
                    <select
                      value={workerProfession}
                      onChange={(e) => setWorkerProfession(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                    >
                      {['Plumber', 'Electrician', 'Mechanic', 'Carpenter', 'Painter', 'AC Repair', 'Appliance Repair', 'Home Cleaner', 'Water Purifier', 'Internet Technician'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Experience (years)</label>
                    <input
                      type="number"
                      value={workerExp}
                      onChange={(e) => setWorkerExp(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Address / Center location</label>
                    <input
                      type="text"
                      value={workerAddress}
                      onChange={(e) => setWorkerAddress(e.target.value)}
                      placeholder="BKC, Mumbai"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={workerSkills}
                      onChange={(e) => setWorkerSkills(e.target.value)}
                      placeholder="Leak fixing, pipe installation"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddWorker(false)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Submit Registration
                    </button>
                  </div>
                </form>
              )}

              {/* Workers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {professionals.map((prof) => (
                  <div key={prof._id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl relative">
                    <button
                      onClick={() => handleDeleteWorker(prof._id)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove worker"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {prof.name.split(' ')[0][0]}
                        {prof.name.split(' ')[1]?.[0]}
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-950 dark:text-white">{prof.name}</h3>
                        <span className="text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/20 px-1.5 py-0.5 rounded">
                          {prof.profession}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> {prof.email}</p>
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span> {prof.phone}</p>
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">Exp:</span> {prof.experience} yrs &bull; ⭐ {prof.rating}</p>
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">Location:</span> {prof.location?.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* USER VIEW LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Active bookings and history */}
            <div className="lg:col-span-8 space-y-6">
              {/* Active Bookings Banner */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
                <h2 className="text-base font-extrabold mb-4 text-slate-950 dark:text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                  Active & Scheduled Jobs
                </h2>

                {bookings.filter(b => b.status === 'Pending' || b.status === 'Accepted').length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No active service appointments. Explore services to book a professional.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'Pending' || b.status === 'Accepted').map((booking) => (
                      <div key={booking._id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between relative overflow-hidden">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shrink-0">
                            <img
                              src={booking.professionalId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.professionalId?.name}`}
                              alt={booking.professionalId?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-xs font-bold text-slate-900 dark:text-white">{booking.professionalId?.name}</h3>
                              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-[9px] font-bold">
                                {booking.professionalId?.profession}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                              <span className="flex items-center gap-0.5"><Calendar size={10} /> {booking.date}</span>
                              <span className="flex items-center gap-0.5"><Clock size={10} /> {booking.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800/40">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Details:</span> {booking.problemDescription}
                            </p>
                          </div>
                        </div>

                        {/* Status tag & Cancel action */}
                        <div className="flex sm:flex-col justify-between sm:justify-start items-end gap-3 shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                          
                          {booking.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                              className="px-2.5 py-1 text-[9px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded transition-colors cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking History */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
                <h2 className="text-base font-extrabold mb-4 text-slate-950 dark:text-white">
                  Past Appointments
                </h2>

                {bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled').length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No past bookings record.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled').map((booking) => (
                      <div key={booking._id} className="p-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {booking.professionalId?.profession === 'Plumber' ? '🔧' : booking.professionalId?.profession === 'Electrician' ? '⚡' : '👤'}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{booking.professionalId?.name}</h4>
                            <p className="text-[9px] text-slate-400">{booking.professionalId?.profession} &bull; {booking.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Profile and Notification logs */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white mt-3">{user?.name}</h3>
                <p className="text-[10px] text-slate-400">{user?.email}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 text-left space-y-2">
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span> {user?.phone}</p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Sector:</span> {user?.location?.address}</p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Latitude:</span> {user?.location?.latitude.toFixed(4)}</p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Longitude:</span> {user?.location?.longitude.toFixed(4)}</p>
                </div>

                <button
                  onClick={logout}
                  className="w-full mt-5 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Log Out Session
                </button>
              </div>

              {/* WebSocket Notification Center */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-extrabold text-slate-950 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  Realtime Activity Logs
                </h3>

                {notifications.length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-6">No notifications yet. Alerts will appear in real-time when bookings update.</p>
                ) : (
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-[10px] space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{notif.title}</p>
                          <span className="text-[8px] text-slate-400">
                            {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">{notif.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}
