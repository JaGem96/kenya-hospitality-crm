import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  type: { type: String, default: 'Standard' },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
});

const propertySchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['BnB', 'Hotel', 'Airbnb', 'Hostel', 'Resort'], required: true },
  location: {
    county: { type: String, required: true },
    town: { type: String, required: true },
    address: { type: String }
  },
  rooms: [roomSchema],
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);