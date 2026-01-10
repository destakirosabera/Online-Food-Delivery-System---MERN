
import Order from '../models/Order.js';
import { GoogleGenAI } from '@google/genai';

/**
 * @desc    Create new order with payment details
 * @access  Private
 */
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentMethod, paymentReceipt } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
      orderItems,
      user: req.user._id,
      totalPrice,
      paymentMethod,
      paymentReceipt,
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
      const allowedStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
      const newStatus = req.body.status;

      if (newStatus && allowedStatuses.includes(newStatus)) {
        order.status = newStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(400).json({ message: 'Invalid order status transition requested.' });
      }
    } else {
      res.status(404).json({ message: 'Asset identification failure. Record not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Logistics Internal Sync Error', error: err.message });
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
      You are a Senior Systems Analyst for a Food Logistics & Dispatch Portal.
      Review the current dispatch queue: ${JSON.stringify(orders)}.
      
      Generate a professional executive summary covering:
      1. Overall fulfillment performance.
      2. Status distribution analysis.
      3. Critical bottlenecks identified in the current transmission cycle.
      
      Maintain a highly professional, technical, and analytical tone suitable for a Computer Science Senior Final Year Project.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    res.status(200).json({ report: response.text });
  } catch (error) {
    console.error('Gemini Intelligence Failure:', error);
    res.status(500).json({ message: 'Intelligence Module Core Unavailable', error: error.message });
  }
};
