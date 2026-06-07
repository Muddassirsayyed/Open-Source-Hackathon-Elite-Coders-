import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true }
}, { _id: false });

const professionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: true,
    enum: [
      'Plumber',
      'Electrician',
      'Mechanic',
      'Carpenter',
      'Painter',
      'AC Repair',
      'Appliance Repair',
      'Home Cleaner',
      'Water Purifier',
      'Internet Technician'
    ]
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  location: {
    type: locationSchema,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  availability: {
    type: Boolean,
    default: true
  },
  skills: [{
    type: String
  }]
}, {
  timestamps: true
});

const Professional = mongoose.model('Professional', professionalSchema);
export default Professional;
