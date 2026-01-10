
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      food: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Food',
      },
      config: { type: Object }
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  deliveryLocation: {
    type: String,
    required: true,
    default: 'Point of Interest'
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    required: false,
  },
  paymentReceipt: {
    type: String, // Store base64 or image URL
    required: false,
  }
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
