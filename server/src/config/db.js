import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed: ${error.message}`);
    console.warn('🔧 Server will continue running without database...');
    // Don't exit - let the server keep running
  }
};

export default connectDB;