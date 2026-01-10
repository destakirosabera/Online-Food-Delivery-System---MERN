
import Order from '../models/Order.js';

export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice, deliveryLocation, deliveryFee, paymentMethod, paymentReceipt } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
      orderItems,
      user: req.user._id,
      totalPrice,
      deliveryLocation,
      deliveryFee,
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

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
