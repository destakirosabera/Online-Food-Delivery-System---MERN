
import { GoogleGenAI } from '@google/genai';
import Order from '../models/Order.js';

/**
 * @desc    Generate a logistical report for the admin dashboard
 * @access  Private/Admin
 */
export const generateOrderReport = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const orders = await Order.find({}).limit(20).populate('user', 'name');
    
    const prompt = `
      You are a Senior Logistics Analyst for a high-growth food delivery enterprise.
      Analyze the following operational data: ${JSON.stringify(orders)}
      
      Produce a professional business intelligence summary including:
      1. Operational throughput (Active vs. Completed orders).
      2. Identification of logistical friction points in the delivery pipeline.
      3. One actionable recommendation to improve delivery latency or resource allocation.
      
      Tone: Professional, analytical, and executive-ready.
      Constraint: Do not mention specific technical tools or AI models.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    res.status(200).json({ report: result.text });
  } catch (error) {
    console.error('Business Analytics Error:', error);
    res.status(500).json({ message: 'Analytics Module Offline', error: error.message });
  }
};
