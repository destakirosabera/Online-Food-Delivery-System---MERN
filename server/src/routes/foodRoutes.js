
import express from 'express';
import { getFoods, addFood } from '../controllers/foodController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getFoods).post(protect, admin, addFood);

export default router;
