import Property from '../models/Property.js';

// Create a new property
export const createProperty = async (req, res) => {
  try {
    const { name, type, location, rooms, description, ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }

    const property = await Property.create({
      owner: ownerId,
      name,
      type,
      location,
      rooms,
      description
    });

    res.status(201).json(property);
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all properties for a specific owner
export const getProperties = async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const properties = await Property.find({ owner: ownerId });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const properties = await Property.find({ owner: ownerId });

    const totalProperties = properties.length;
    
    // Calculate total capacity and potential revenue
    let totalCapacity = 0;
    let potentialRevenue = 0;

    properties.forEach(prop => {
      if (prop.rooms && prop.rooms.length > 0) {
        const room = prop.rooms[0]; // Using first room for simple stats
        totalCapacity += room.capacity || 0;
        // Mock calculation: Price * Capacity * 30 days * 70% occupancy
        potentialRevenue += (room.pricePerNight || 0) * (room.capacity || 0) * 30 * 0.7; 
      }
    });

    res.json({
      totalProperties,
      totalCapacity,
      potentialRevenue: Math.round(potentialRevenue),
      activeBookings: 0 // We will build bookings next!
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};