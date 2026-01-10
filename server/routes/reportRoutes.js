
import express from 'express';
import { generateOrderReport } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Generate an AI-powered intelligence report on orders
// @route   POST /api/report/generate
// @access  Private/Admin
router.route('/generate').post(protect, admin, generateOrderReport);

export default router;