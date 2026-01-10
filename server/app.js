import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/reportRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/report', reportRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', authRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

// 404 Handler
app.use((req, res) => res.status(404).json({ message: 'API Endpoint Not Found' }));

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

export default app;