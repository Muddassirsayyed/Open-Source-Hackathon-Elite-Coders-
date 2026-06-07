import express from 'express';
import Booking from '../models/Booking.js';
import Professional from '../models/Professional.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all bookings (For logged-in user or all if admin)
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('professionalId', 'name profession phone rating profileImage location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new booking (Supports regular and Emergency Mode)
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  const { professionalId, date, time, problemDescription, isEmergency, profession } = req.body;

  try {
    let assignedProfId = professionalId;

    // Emergency Service Mode - Automatically match with the nearest available professional
    if (isEmergency) {
      if (!profession) {
        return res.status(400).json({ success: false, message: 'Profession is required for Emergency Mode' });
      }

      // Find available professionals of that specific profession
      const pros = await Professional.find({ profession, availability: true });
      if (pros.length === 0) {
        return res.status(404).json({ success: false, message: `No available ${profession}s found at this moment.` });
      }

      // If user location is available, calculate nearest pro
      if (req.user.location && req.user.location.latitude) {
        let nearestPro = null;
        let minDistance = Infinity;

        // Haversine helper in server/routes/professionals.js
        const { calculateDistance } = await import('./professionals.js');

        for (const pro of pros) {
          const d = calculateDistance(
            req.user.location.latitude,
            req.user.location.longitude,
            pro.location.latitude,
            pro.location.longitude
          );
          if (d < minDistance) {
            minDistance = d;
            nearestPro = pro;
          }
        }
        
        if (nearestPro) {
          assignedProfId = nearestPro._id;
        } else {
          assignedProfId = pros[0]._id;
        }
      } else {
        // Fallback to first available pro
        assignedProfId = pros[0]._id;
      }
    }

    if (!assignedProfId) {
      return res.status(400).json({ success: false, message: 'Professional ID is required.' });
    }

    const professional = await Professional.findById(assignedProfId);
    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found.' });
    }

    // Define emergency time as "ASAP"
    const bookingDate = isEmergency ? new Date().toISOString().split('T')[0] : date;
    const bookingTime = isEmergency ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : time;

    const booking = await Booking.create({
      userId: req.user._id,
      professionalId: assignedProfId,
      date: bookingDate,
      time: bookingTime,
      problemDescription,
      isEmergency: !!isEmergency,
      status: isEmergency ? 'Accepted' : 'Pending' // Emergency is accepted by default
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email phone')
      .populate('professionalId', 'name profession phone rating profileImage location');

    // Emit live Socket.io alert to all dashboards / admin
    if (req.io) {
      req.io.emit('booking_created', populatedBooking);
      console.log(`Socket.io Event: booking_created emitted for Booking ID: ${booking._id}`);
    }

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update booking status (Pending -> Accepted -> Completed -> Cancelled)
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Security: Only allow admin, the booked professional, or the booked user to cancel
    // (Here we allow any authenticated user to update status for prototyping convenience)
    booking.status = status;
    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('userId', 'name email phone')
      .populate('professionalId', 'name profession phone rating profileImage location');

    // Emit realtime Socket.io alert
    if (req.io) {
      req.io.emit('booking_updated', populatedBooking);
      console.log(`Socket.io Event: booking_updated emitted for Booking ID: ${booking._id} (Status: ${status})`);
    }

    res.json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
