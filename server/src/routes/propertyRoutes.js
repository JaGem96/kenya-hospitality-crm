import express from 'express';
import { createProperty, getProperties, getDashboardStats } from '../controllers/propertyController.js';

const router = express.Router();

router.route('/').post(createProperty).get(getProperties);
router.get('/stats', getDashboardStats); // <-- Added this

export default router;