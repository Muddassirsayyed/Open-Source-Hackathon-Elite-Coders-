import express from 'express';
import Professional from '../models/Professional.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(2));
}

// @desc    Get all professionals or filter by profession & proximity
// @route   GET /api/professionals
// @access  Public
router.get('/', async (req, res) => {
  const { profession, lat, lng, search, recommend } = req.query;

  try {
    let query = {};
    if (profession && profession !== 'All') {
      query.profession = profession;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let professionals = await Professional.find(query);

    // If user coordinates are provided, calculate distance and sort
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      professionals = professionals.map(prof => {
        const distance = calculateDistance(
          userLat,
          userLng,
          prof.location.latitude,
          prof.location.longitude
        );
        return { ...prof.toObject(), distance };
      });

      // Filter within a reasonable distance (e.g., 50km) for nearby, or sort
      // If AI smart recommendation is requested: Score = (0.6 * Rating) + (0.4 * (10 / (Distance + 1)))
      if (recommend === 'true') {
        professionals = professionals.map(prof => {
          const distanceScore = 10 / (prof.distance + 1);
          const recommendationScore = (0.6 * prof.rating) + (0.4 * distanceScore);
          return { ...prof, recommendationScore };
        });
        professionals.sort((a, b) => b.recommendationScore - a.recommendationScore);
      } else {
        // Default sort by distance
        professionals.sort((a, b) => a.distance - b.distance);
      }
    } else {
      // Default sort by rating
      professionals.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: professionals.length, data: professionals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get professional by ID
// @route   GET /api/professionals/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found' });
    }
    res.json({ success: true, data: professional });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new professional (Admin only)
// @route   POST /api/professionals
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const professional = await Professional.create(req.body);
    res.status(201).json({ success: true, data: professional });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update professional availability/details (Admin only)
// @route   PUT /api/professionals/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const professional = await Professional.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found' });
    }
    res.json({ success: true, data: professional });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete professional (Admin only)
// @route   DELETE /api/professionals/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const professional = await Professional.findByIdAndDelete(req.params.id);
    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found' });
    }
    res.json({ success: true, message: 'Professional deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
export { calculateDistance };
