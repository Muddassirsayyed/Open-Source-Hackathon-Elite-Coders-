import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fixmate_ai_super_secret_key_123_hackathon_elite', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'user',
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
        address: 'Mumbai, Maharashtra, India'
      }
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update user location
// @route   PUT /api/auth/location
// @access  Private
router.put('/location', protect, async (req, res) => {
  const { latitude, longitude, address } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.location = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        address: address || user.location.address
      };

      const updatedUser = await user.save();
      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          location: updatedUser.location
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user saved professionals
// @route   GET /api/auth/saved-professionals
// @access  Private
router.get('/saved-professionals', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProfessionals');
    res.json({ success: true, savedProfessionals: user.savedProfessionals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Save/unsave professional
// @route   POST /api/auth/saved-professionals/:id
// @access  Private
router.post('/saved-professionals/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const profId = req.params.id;

    if (user.savedProfessionals.includes(profId)) {
      user.savedProfessionals = user.savedProfessionals.filter(id => id.toString() !== profId);
      await user.save();
      return res.json({ success: true, message: 'Professional removed from saved list', saved: false });
    } else {
      user.savedProfessionals.push(profId);
      await user.save();
      return res.json({ success: true, message: 'Professional added to saved list', saved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
