import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Post-save hook to recalculate professional rating
reviewSchema.post('save', async function () {
  const Review = this.constructor;
  const Professional = mongoose.model('Professional');

  const stats = await Review.aggregate([
    { $match: { professionalId: this.professionalId } },
    {
      $group: {
        _id: '$professionalId',
        avgRating: { $avg: '$rating' },
        nRatings: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Professional.findByIdAndUpdate(this.professionalId, {
      rating: parseFloat(stats[0].avgRating.toFixed(1)),
      reviewsCount: stats[0].nRatings
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
