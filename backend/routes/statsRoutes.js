import express from 'express';
const router = express.Router();
import { getDashboardStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, getDashboardStats);

export default router;
