import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'], 
    default: 'Confirmed' 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);