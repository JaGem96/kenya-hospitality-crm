import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { propertyId, guestName, guestEmail, guestPhone, checkIn, checkOut } = req.body;

    // Find property to get price
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Calculate price (Simple logic: Price per night * number of nights)
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const pricePerNight = property.rooms[0]?.pricePerNight || 0;
    const totalPrice = diffDays * pricePerNight;

    const booking = await Booking.create({
      property: propertyId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      totalPrice,
      createdBy: req.body.ownerId // Assuming ownerId is passed
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for a user
export const getBookings = async (req, res) => {
  try {
    // In a real app, we would filter by the property IDs owned by this user
    // For now, we just get all bookings (or filter by createdBy if passed)
    const bookings = await Booking.find({ createdBy: req.query.ownerId }).populate('property', 'name location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dashboard Stats for Bookings
export const getBookingStats = async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const bookings = await Booking.find({ createdBy: ownerId });
    
    const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({ activeBookings, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};