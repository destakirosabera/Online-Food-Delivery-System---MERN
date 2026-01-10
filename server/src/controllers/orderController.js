
import Order from '../models/Order.js';
import { GoogleGenAI } from '@google/genai';

/**
 * @desc    Create new order
 * @access  Private
 */
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
      orderItems,
      user: req.user._id,
      totalPrice,
      status: 'Pending'
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Update order status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      // Validate incoming status against allowed transitions (optional, but good for production)
      const allowedStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
      const newStatus = req.body.status;

      if (newStatus && allowedStatuses.includes(newStatus)) {
        order.status = newStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(400).json({ message: 'Invalid order status transition provided' });
      }
    } else {
      res.status(404).json({ message: 'Order identification failure. Asset not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Logistics Core Sync Error', error: err.message });
  }
};

/**
 * @desc    Generate AI Report for Admins using Gemini
 * @access  Private/Admin
 */
export const generateOrderReport = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const orders = await Order.find({}).limit(20).populate('user', 'name');
    
    const prompt = `
      You are a Senior Logistics Consultant for In-N-Out Delivery at Admas University.
      Perform a deep-dive analysis on the following operational data: ${JSON.stringify(orders)}.
      
      Requirements for the report:
      1. Analyze the throughput and current backlog (Pending orders).
      2. Identify merchant performance trends if applicable.
      3. Provide a high-level executive summary for the University Logistics Dept.
      4. Use a professional, analytical tone. Do not use AI-generated disclaimers.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    res.status(200).json({ report: result.text });
  } catch (error) {
    console.error('Gemini Intelligence Failure:', error);
    res.status(500).json({ message: 'Logistics Intelligence Core Unavailable', error: error.message });
  }
};
