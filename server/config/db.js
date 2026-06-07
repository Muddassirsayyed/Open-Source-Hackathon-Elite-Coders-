import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Explicitly import models to register them in mongoose.models
import User from '../models/User.js';
import Professional from '../models/Professional.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

dotenv.config();

// In-Memory Database Store
export const mockStore = {
  users: [],
  professionals: [],
  services: [],
  bookings: [],
  reviews: []
};

// Initial Seed Data
const defaultServices = [
  { title: 'Plumber', description: 'Expert pipe fixing, leak repairs, bathroom fittings, and drain cleaning.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400', price: 250 },
  { title: 'Electrician', description: 'Short circuit fixes, wiring, switchboards, and fan/light installations.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', price: 250 },
  { title: 'Mechanic', description: 'On-road breakdown assistance, engine check, battery replacement, and general car repair.', image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400', price: 399 },
  { title: 'Carpenter', description: 'Furniture repair, door/window fixing, custom cabinets, and drawer alignment.', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400', price: 300 },
  { title: 'Painter', description: 'Interior & exterior painting, wall patching, and designer wallpapers.', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400', price: 500 },
  { title: 'Home Cleaner', description: 'Deep house cleaning, kitchen cleaning, sofa dry cleaning, and sanitization.', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400', price: 499 },
  { title: 'AC Repair', description: 'AC gas filling, servicing, filter cleaning, and compressor diagnostics.', image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=400', price: 399 },
  { title: 'Appliance Repair', description: 'Washing machine, refrigerator, microwave, and TV fixing.', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400', price: 349 },
  { title: 'Water Purifier', description: 'Filter replacement, membrane service, TDS tuning, and water testing.', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400', price: 299 },
  { title: 'Internet Technician', description: 'Wi-Fi configuration, router setup, LAN cabling, and broadband diagnostics.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400', price: 199 }
];

const defaultProfessionals = [
  { name: 'Rajesh Kumar', email: 'rajesh@fixmate.com', phone: '+91 9876543210', profession: 'Plumber', experience: 8, rating: 4.8, reviewsCount: 24, location: { latitude: 19.0790, longitude: 72.8820, address: 'Kurla West, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Leak Detection', 'Pipe Welding', 'Drain Jetting', 'Faucet Assembly'] },
  { name: 'Amit Sharma', email: 'amit@fixmate.com', phone: '+91 9876543211', profession: 'Electrician', experience: 5, rating: 4.6, reviewsCount: 18, location: { latitude: 19.0720, longitude: 72.8710, address: 'Sion East, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['House Wiring', 'DB Dressing', 'Appliance Installation', 'Inverter Setup'] },
  { name: 'Vijay Patil', email: 'vijay@fixmate.com', phone: '+91 9876543212', profession: 'Mechanic', experience: 12, rating: 4.9, reviewsCount: 42, location: { latitude: 19.0850, longitude: 72.8900, address: 'Ghatkopar West, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Engine Overhauling', 'Brake Tuning', 'Car Scan Diagnostics', 'Battery Jumpstart'] },
  { name: 'Sanjay Viswakarma', email: 'sanjay@fixmate.com', phone: '+91 9876543213', profession: 'Carpenter', experience: 7, rating: 4.5, reviewsCount: 15, location: { latitude: 19.0600, longitude: 72.8600, address: 'Bandra East, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Modular Furniture', 'Hinge Adjustment', 'Polishing', 'Door Latch Fixing'] },
  { name: 'Ramesh Sawant', email: 'ramesh@fixmate.com', phone: '+91 9876543214', profession: 'Painter', experience: 10, rating: 4.7, reviewsCount: 22, location: { latitude: 19.0980, longitude: 72.8650, address: 'Santacruz East, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Wall Putty Coating', 'Texture Painting', 'Waterproofing Paint', 'Stencil Design'] },
  { name: 'Sunita Rao', email: 'sunita@fixmate.com', phone: '+91 9876543215', profession: 'Home Cleaner', experience: 4, rating: 4.9, reviewsCount: 30, location: { latitude: 19.0550, longitude: 72.8770, address: 'Dharavi, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Deep Home Cleaning', 'Kitchen Degreasing', 'Sofa Sanitization', 'Bathroom Scrubbing'] },
  { name: 'Karan Malhotra', email: 'karan@fixmate.com', phone: '+91 9876543216', profession: 'AC Repair', experience: 6, rating: 4.4, reviewsCount: 16, location: { latitude: 19.0700, longitude: 72.8800, address: 'Chembur, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Gas Recharging', 'Filter Washing', 'Compressor Check', 'Leak Fixing'] },
  { name: 'Vikram Singh', email: 'vikram@fixmate.com', phone: '+91 9876543217', profession: 'Appliance Repair', experience: 9, rating: 4.5, reviewsCount: 20, location: { latitude: 19.0900, longitude: 72.8500, address: 'Vile Parle West, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Washing Machine PCB', 'Refrigerator Defrosting', 'Microwave Magnetron', 'TV Backlight'] },
  { name: 'Anil Deshmukh', email: 'anil@fixmate.com', phone: '+91 9876543218', profession: 'Water Purifier', experience: 5, rating: 4.7, reviewsCount: 13, location: { latitude: 19.0800, longitude: 72.8680, address: 'Kalina, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['RO Membrane Swap', 'Sediment Filter Cleaning', 'TDS Calibration', 'UV Lamp Fix'] },
  { name: 'Sneha Gokhale', email: 'sneha@fixmate.com', phone: '+91 9876543219', profession: 'Internet Technician', experience: 3, rating: 4.8, reviewsCount: 11, location: { latitude: 19.0650, longitude: 72.8950, address: 'Mankhurd, Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Fiber Cable Splicing', 'Router Setup', 'Port Forwarding', 'Wi-Fi Extenders'] },
  { name: 'Harish Patel', email: 'harish@fixmate.com', phone: '+91 9876543220', profession: 'Plumber', experience: 11, rating: 4.9, reviewsCount: 38, location: { latitude: 19.0670, longitude: 72.8750, address: 'Bandra Kurla Complex (BKC), Mumbai, India' }, profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', availability: true, skills: ['Hydro-jetting', 'Water Heater Setup', 'Sump Pump Repairs', 'Underground Leaks'] }
];

// Seed the In-Memory Mock Database
async function seedMockDB() {
  if (mockStore.services.length > 0) return; // Already seeded

  // Add services
  mockStore.services = defaultServices.map((s, index) => ({
    _id: new mongoose.Types.ObjectId(`00000000000000000000000${index}`.slice(-24)),
    ...s
  }));

  // Add professionals
  mockStore.professionals = defaultProfessionals.map((p, index) => ({
    _id: new mongoose.Types.ObjectId(`10000000000000000000000${index}`.slice(-24)),
    ...p
  }));

  // Add default Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const userPassword = await bcrypt.hash('user123', salt);

  mockStore.users.push({
    _id: new mongoose.Types.ObjectId('200000000000000000000001'),
    name: 'Admin FixMate',
    email: 'admin@fixmate.com',
    phone: '+91 9999999999',
    password: adminPassword,
    role: 'admin',
    location: { latitude: 19.0760, longitude: 72.8777, address: 'BKC Center, Mumbai, India' },
    savedProfessionals: []
  });

  mockStore.users.push({
    _id: new mongoose.Types.ObjectId('200000000000000000000002'),
    name: 'John Doe',
    email: 'john@gmail.com',
    phone: '+91 8888888888',
    password: userPassword,
    role: 'user',
    location: { latitude: 19.0760, longitude: 72.8777, address: 'Bandra West, Mumbai, India' },
    savedProfessionals: []
  });

  console.log('🌱 In-Memory Database Fallback seeded successfully!');
}

// Custom Query Chain Builder
function createQueryChain(executeFn) {
  const chain = {
    populate() { return chain; },
    select() { return chain; },
    sort() { return chain; },
    limit() { return chain; },
    skip() { return chain; },
    lean() { return chain; },
    exec: async () => executeFn(),
    then(resolve, reject) {
      return Promise.resolve(executeFn()).then(resolve, reject);
    },
    catch(reject) {
      return Promise.resolve(executeFn()).catch(reject);
    }
  };
  return chain;
}

// Function to dynamically patch Mongoose Models to bypass actual DB operations
function patchMongooseForMocking() {
  const models = mongoose.models;

  // Intercept User Model
  if (models.User) {
    models.User.findOne = function(conditions) {
      return createQueryChain(async () => {
        const match = mockStore.users.find(u => {
          for (const key of Object.keys(conditions)) {
            let condVal = conditions[key];
            let userVal = u[key];
            if (key === 'email' && typeof condVal === 'string') {
              condVal = condVal.toLowerCase();
              userVal = userVal?.toLowerCase();
            }
            if (userVal?.toString() !== condVal?.toString()) {
              return false;
            }
          }
          return true;
        });
        if (!match) return null;
        return createDocInstance(models.User, match);
      });
    };

    models.User.findById = function(id) {
      return createQueryChain(async () => {
        if (!id) return null;
        const match = mockStore.users.find(u => u._id.toString() === id.toString());
        if (!match) return null;
        return createDocInstance(models.User, match);
      });
    };

    models.User.create = async function(data) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const newUser = {
        _id: new mongoose.Types.ObjectId(),
        ...data,
        password: hashedPassword,
        location: data.location || { latitude: 19.0760, longitude: 72.8777, address: 'Mumbai, India' },
        savedProfessionals: []
      };
      mockStore.users.push(newUser);
      return createDocInstance(models.User, newUser);
    };
  }

  // Intercept Professional Model
  if (models.Professional) {
    models.Professional.find = function(query) {
      return createQueryChain(async () => {
        let list = [...mockStore.professionals];
        if (query) {
          if (query.profession && query.profession !== 'All') {
            list = list.filter(p => p.profession === query.profession);
          }
          if (query.availability !== undefined) {
            list = list.filter(p => p.availability === !!query.availability);
          }
          if (query.name) {
            const regex = query.name.$regex ? new RegExp(query.name.$regex, query.name.$options || 'i') : new RegExp(query.name, 'i');
            list = list.filter(p => regex.test(p.name));
          }
        }
        return list.map(p => createDocInstance(models.Professional, p));
      });
    };

    models.Professional.findById = function(id) {
      return createQueryChain(async () => {
        if (!id) return null;
        const match = mockStore.professionals.find(p => p._id.toString() === id.toString());
        if (!match) return null;
        return createDocInstance(models.Professional, match);
      });
    };

    models.Professional.findOne = function(conditions) {
      return createQueryChain(async () => {
        const match = mockStore.professionals.find(p => {
          for (const key of Object.keys(conditions)) {
            if (p[key]?.toString() !== conditions[key]?.toString()) {
              return false;
            }
          }
          return true;
        });
        if (!match) return null;
        return createDocInstance(models.Professional, match);
      });
    };

    models.Professional.create = async function(data) {
      const newProf = {
        _id: new mongoose.Types.ObjectId(),
        ...data,
        rating: data.rating || 4.5,
        reviewsCount: data.reviewsCount || 0
      };
      mockStore.professionals.push(newProf);
      return createDocInstance(models.Professional, newProf);
    };

    models.Professional.findByIdAndUpdate = function(id, update, options) {
      return createQueryChain(async () => {
        const index = mockStore.professionals.findIndex(p => p._id.toString() === id.toString());
        if (index === -1) return null;
        mockStore.professionals[index] = { ...mockStore.professionals[index], ...update };
        return createDocInstance(models.Professional, mockStore.professionals[index]);
      });
    };

    models.Professional.findByIdAndDelete = function(id) {
      return createQueryChain(async () => {
        const index = mockStore.professionals.findIndex(p => p._id.toString() === id.toString());
        if (index === -1) return null;
        const deleted = mockStore.professionals.splice(index, 1)[0];
        return createDocInstance(models.Professional, deleted);
      });
    };
  }

  // Intercept Service Model
  if (models.Service) {
    models.Service.find = function(query) {
      return createQueryChain(async () => {
        return mockStore.services.map(s => createDocInstance(models.Service, s));
      });
    };

    models.Service.findById = function(id) {
      return createQueryChain(async () => {
        if (!id) return null;
        const match = mockStore.services.find(s => s._id.toString() === id.toString());
        if (!match) return null;
        return createDocInstance(models.Service, match);
      });
    };
  }

  // Intercept Booking Model
  if (models.Booking) {
    models.Booking.create = async function(data) {
      const newBooking = {
        _id: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        ...data,
        status: data.status || 'Pending'
      };
      mockStore.bookings.push(newBooking);

      // Populate manually
      const userObj = mockStore.users.find(u => u._id.toString() === data.userId.toString());
      const profObj = mockStore.professionals.find(p => p._id.toString() === data.professionalId.toString());

      const populatedBooking = {
        ...newBooking,
        userId: userObj || data.userId,
        professionalId: profObj || data.professionalId
      };

      return createDocInstance(models.Booking, populatedBooking);
    };

    models.Booking.find = function(query) {
      return createQueryChain(async () => {
        let list = [...mockStore.bookings];
        if (query && query.userId) {
          list = list.filter(b => b.userId.toString() === query.userId.toString());
        }
        
        // Map and populate
        const populatedList = list.map(b => {
          const userObj = mockStore.users.find(u => u._id.toString() === b.userId.toString());
          const profObj = mockStore.professionals.find(p => p._id.toString() === b.professionalId.toString());
          return {
            ...b,
            userId: userObj || b.userId,
            professionalId: profObj || b.professionalId
          };
        });

        return populatedList.map(b => createDocInstance(models.Booking, b));
      });
    };

    models.Booking.findById = function(id) {
      return createQueryChain(async () => {
        if (!id) return null;
        const match = mockStore.bookings.find(b => b._id.toString() === id.toString());
        if (!match) return null;
        
        const userObj = mockStore.users.find(u => u._id.toString() === match.userId.toString());
        const profObj = mockStore.professionals.find(p => p._id.toString() === match.professionalId.toString());

        const populated = {
          ...match,
          userId: userObj || match.userId,
          professionalId: profObj || match.professionalId
        };

        return createDocInstance(models.Booking, populated);
      });
    };
  }

  // Intercept Review Model
  if (models.Review) {
    models.Review.create = async function(data) {
      const newReview = {
        _id: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        ...data
      };
      mockStore.reviews.push(newReview);
      
      // Update professional rating
      const prof = mockStore.professionals.find(p => p._id.toString() === data.professionalId.toString());
      if (prof) {
        const profReviews = mockStore.reviews.filter(r => r.professionalId.toString() === data.professionalId.toString());
        const sum = profReviews.reduce((acc, curr) => acc + curr.rating, 0);
        prof.reviewsCount = profReviews.length;
        prof.rating = parseFloat((sum / profReviews.length).toFixed(1));
      }

      return createDocInstance(models.Review, newReview);
    };

    models.Review.find = function(query) {
      return createQueryChain(async () => {
        let list = [...mockStore.reviews];
        if (query && query.professionalId) {
          list = list.filter(r => r.professionalId.toString() === query.professionalId.toString());
        }
        return list.map(r => createDocInstance(models.Review, r));
      });
    };

    models.Review.findById = function(id) {
      return createQueryChain(async () => {
        if (!id) return null;
        const match = mockStore.reviews.find(r => r._id.toString() === id.toString());
        if (!match) return null;
        return createDocInstance(models.Review, match);
      });
    };
  }

  console.log('🤖 Mongoose methods successfully patched with in-memory database handlers.');
}

// Helper to create a fake Mongoose Document-like object
function createDocInstance(modelClass, rawObj) {
  const doc = {
    ...rawObj,
    toObject() { return rawObj; },
    toJSON() { return rawObj; },
    save: async function() {
      // Copy all fields from this (doc) back to rawObj, except for the helper methods
      for (const key of Object.keys(this)) {
        if (typeof this[key] !== 'function') {
          rawObj[key] = this[key];
        }
      }
      const collectionName = modelClass.modelName.toLowerCase() + 's';
      const list = mockStore[collectionName] || [];
      const index = list.findIndex(item => item._id.toString() === rawObj._id.toString());
      if (index !== -1) {
        list[index] = rawObj;
      } else {
        list.push(rawObj);
      }
      return this;
    },
    comparePassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, rawObj.password);
    }
  };
  return doc;
}

const connectDB = async () => {
  // Always seed the mock db first in case we need it
  await seedMockDB();

  try {
    const connUri = process.env.MONGODB_URI;

    // Detect mock connection strings or missing connections to bypass and use in-memory database directly
    if (!connUri || connUri.includes('cluster0.p7d8e.mongodb.net') || connUri.includes('127.0.0.1:27017')) {
      console.log('⚠️ Valid cloud database MONGODB_URI not provided. Launching in In-Memory Mock Database Mode...');
      patchMongooseForMocking();
      return;
    }

    console.log(`🔌 Connecting to MongoDB Atlas at: ${connUri.replace(/:[^:]*@/, ':***@')}`);
    
    // Set low timeout so we don't block boot process
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log('⚠️ Falling back to In-Memory Mock Database Mode...');
    patchMongooseForMocking();
  }
};

export default connectDB;
