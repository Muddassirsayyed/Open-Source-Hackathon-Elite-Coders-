import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Professional from '../models/Professional.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

dotenv.config();

const services = [
  {
    title: 'Plumber',
    description: 'Expert pipe fixing, leak repairs, bathroom fittings, and drain cleaning.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
    price: 250
  },
  {
    title: 'Electrician',
    description: 'Short circuit fixes, wiring, switchboards, and fan/light installations.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
    price: 250
  },
  {
    title: 'Mechanic',
    description: 'On-road breakdown assistance, engine check, battery replacement, and general car repair.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400',
    price: 399
  },
  {
    title: 'Carpenter',
    description: 'Furniture repair, door/window fixing, custom cabinets, and drawer alignment.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400',
    price: 300
  },
  {
    title: 'Painter',
    description: 'Interior & exterior painting, wall patching, and designer wallpapers.',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400',
    price: 500
  },
  {
    title: 'Home Cleaner',
    description: 'Deep house cleaning, kitchen cleaning, sofa dry cleaning, and sanitization.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400',
    price: 499
  },
  {
    title: 'AC Repair',
    description: 'AC gas filling, servicing, filter cleaning, and compressor diagnostics.',
    image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=400',
    price: 399
  },
  {
    title: 'Appliance Repair',
    description: 'Washing machine, refrigerator, microwave, and TV fixing.',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400',
    price: 349
  },
  {
    title: 'Water Purifier',
    description: 'Filter replacement, membrane service, TDS tuning, and water testing.',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400',
    price: 299
  },
  {
    title: 'Internet Technician',
    description: 'Wi-Fi configuration, router setup, LAN cabling, and broadband diagnostics.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400',
    price: 199
  }
];

const professionals = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@fixmate.com',
    phone: '+91 9876543210',
    profession: 'Plumber',
    experience: 8,
    rating: 4.8,
    reviewsCount: 24,
    location: {
      latitude: 19.0790,
      longitude: 72.8820,
      address: 'Kurla West, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Leak Detection', 'Pipe Welding', 'Drain Jetting', 'Faucet Assembly']
  },
  {
    name: 'Amit Sharma',
    email: 'amit@fixmate.com',
    phone: '+91 9876543211',
    profession: 'Electrician',
    experience: 5,
    rating: 4.6,
    reviewsCount: 18,
    location: {
      latitude: 19.0720,
      longitude: 72.8710,
      address: 'Sion East, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['House Wiring', 'DB Dressing', 'Appliance Installation', 'Inverter Setup']
  },
  {
    name: 'Vijay Patil',
    email: 'vijay@fixmate.com',
    phone: '+91 9876543212',
    profession: 'Mechanic',
    experience: 12,
    rating: 4.9,
    reviewsCount: 42,
    location: {
      latitude: 19.0850,
      longitude: 72.8900,
      address: 'Ghatkopar West, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Engine Overhauling', 'Brake Tuning', 'Car Scan Diagnostics', 'Battery Jumpstart']
  },
  {
    name: 'Sanjay Viswakarma',
    email: 'sanjay@fixmate.com',
    phone: '+91 9876543213',
    profession: 'Carpenter',
    experience: 7,
    rating: 4.5,
    reviewsCount: 15,
    location: {
      latitude: 19.0600,
      longitude: 72.8600,
      address: 'Bandra East, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Modular Furniture', 'Hinge Adjustment', 'Polishing', 'Door Latch Fixing']
  },
  {
    name: 'Ramesh Sawant',
    email: 'ramesh@fixmate.com',
    phone: '+91 9876543214',
    profession: 'Painter',
    experience: 10,
    rating: 4.7,
    reviewsCount: 22,
    location: {
      latitude: 19.0980,
      longitude: 72.8650,
      address: 'Santacruz East, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Wall Putty Coating', 'Texture Painting', 'Waterproofing Paint', 'Stencil Design']
  },
  {
    name: 'Sunita Rao',
    email: 'sunita@fixmate.com',
    phone: '+91 9876543215',
    profession: 'Home Cleaner',
    experience: 4,
    rating: 4.9,
    reviewsCount: 30,
    location: {
      latitude: 19.0550,
      longitude: 72.8770,
      address: 'Dharavi, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Deep Home Cleaning', 'Kitchen Degreasing', 'Sofa Sanitization', 'Bathroom Scrubbing']
  },
  {
    name: 'Karan Malhotra',
    email: 'karan@fixmate.com',
    phone: '+91 9876543216',
    profession: 'AC Repair',
    experience: 6,
    rating: 4.4,
    reviewsCount: 16,
    location: {
      latitude: 19.0700,
      longitude: 72.8800,
      address: 'Chembur, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Gas Recharging', 'Filter Washing', 'Compressor Check', 'Leak Fixing']
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@fixmate.com',
    phone: '+91 9876543217',
    profession: 'Appliance Repair',
    experience: 9,
    rating: 4.5,
    reviewsCount: 20,
    location: {
      latitude: 19.0900,
      longitude: 72.8500,
      address: 'Vile Parle West, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Washing Machine PCB', 'Refrigerator Defrosting', 'Microwave Magnetron', 'TV Backlight']
  },
  {
    name: 'Anil Deshmukh',
    email: 'anil@fixmate.com',
    phone: '+91 9876543218',
    profession: 'Water Purifier',
    experience: 5,
    rating: 4.7,
    reviewsCount: 13,
    location: {
      latitude: 19.0800,
      longitude: 72.8680,
      address: 'Kalina, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['RO Membrane Swap', 'Sediment Filter Cleaning', 'TDS Calibration', 'UV Lamp Fix']
  },
  {
    name: 'Sneha Gokhale',
    email: 'sneha@fixmate.com',
    phone: '+91 9876543219',
    profession: 'Internet Technician',
    experience: 3,
    rating: 4.8,
    reviewsCount: 11,
    location: {
      latitude: 19.0650,
      longitude: 72.8950,
      address: 'Mankhurd, Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Fiber Cable Splicing', 'Router Setup', 'Port Forwarding', 'Wi-Fi Extenders']
  },
  // Extra Plumber for map variety
  {
    name: 'Harish Patel',
    email: 'harish@fixmate.com',
    phone: '+91 9876543220',
    profession: 'Plumber',
    experience: 11,
    rating: 4.9,
    reviewsCount: 38,
    location: {
      latitude: 19.0670,
      longitude: 72.8750,
      address: 'Bandra Kurla Complex (BKC), Mumbai, India'
    },
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    availability: true,
    skills: ['Hydro-jetting', 'Water Heater Setup', 'Sump Pump Repairs', 'Underground Leaks']
  }
];

const seedDB = async () => {
  await connectDB();

  try {
    // Clear existing collections
    await User.deleteMany();
    await Professional.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Database collections cleared.');

    // Seed Services
    await Service.insertMany(services);
    console.log('Services seeded successfully.');

    // Seed Professionals
    await Professional.insertMany(professionals);
    console.log('Professionals seeded successfully.');

    // Seed default Admin User (hashed password is 'admin123')
    const adminUser = new User({
      name: 'Admin FixMate',
      email: 'admin@fixmate.com',
      phone: '+91 9999999999',
      password: 'admin123', // Will be hashed by userSchema.pre('save')
      role: 'admin',
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
        address: 'BKC Center, Mumbai, India'
      }
    });
    
    // Seed default Standard User (hashed password is 'user123')
    const standardUser = new User({
      name: 'John Doe',
      email: 'john@gmail.com',
      phone: '+91 8888888888',
      password: 'user123', // Will be hashed
      role: 'user',
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
        address: 'Bandra West, Mumbai, India'
      }
    });

    await adminUser.save();
    await standardUser.save();
    console.log('Users seeded successfully. Default logins:');
    console.log('Admin: admin@fixmate.com / admin123');
    console.log('User: john@gmail.com / user123');

    // Create a mock review to seed professional data aggregates
    const rajesh = await Professional.findOne({ name: 'Rajesh Kumar' });
    if (rajesh) {
      await Review.create({
        userId: standardUser._id,
        professionalId: rajesh._id,
        rating: 5,
        comment: 'Rajesh fixed our kitchen leakage in 15 minutes! Great service.'
      });
      console.log('Initial Reviews seeded.');
    }

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
