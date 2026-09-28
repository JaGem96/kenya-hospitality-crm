import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
   import authRoutes from './routes/authRoutes.js';
   import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
 app.use('/api/auth', authRoutes);
 app.use('/api/properties', propertyRoutes);
 app.use('/api/bookings', bookingRoutes);


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Kenya Hospitality CRM API is running 🇰🇪' 
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB (non-blocking)
connectDB();

// Start server regardless of DB connection
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});