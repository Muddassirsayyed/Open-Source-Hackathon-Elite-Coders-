import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all reviews or reviews for a professional
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
  const { professionalId } = req.query;

  try {
    let query = {};
    if (professionalId) {
      query.professionalId = professionalId;
    }

    const reviews = await Review.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add a review for a professional
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
  const { professionalId, rating, comment } = req.body;

  try {
    if (!professionalId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const review = await Review.create({
      userId: req.user._id,
      professionalId,
      rating: Number(rating),
      comment
    });

    const populatedReview = await Review.findById(review._id).populate('userId', 'name');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
