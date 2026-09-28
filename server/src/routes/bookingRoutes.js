import express from 'express';
import { createBooking, getBookings, getBookingStats } from '../controllers/bookingController.js';

const router = express.Router();

router.route('/').post(createBooking).get(getBookings);
router.get('/stats', getBookingStats);

export default router;