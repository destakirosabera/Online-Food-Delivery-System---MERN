
import Food from '../models/Food.js';

// @desc    Get all food items
// @route   GET /api/food
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving menu' });
  }
};

// @desc    Add new food item (Admin only)
// @route   POST /api/food
export const addFood = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const food = new Food({ name, description, price, imageUrl, category });
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (err) {
    res.status(400).json({ message: 'Invalid food data' });
  }
};
