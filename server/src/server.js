
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        
        app.listen(PORT, () => {
            console.log(`
            ================================================
            ADMAS UNIVERSITY - LOGISTICS SERVER ACTIVE
            ================================================
            Status: OPERATIONAL
            Port: ${PORT}
            Architecture: MERN (Decoupled)
            AI Core: Gemini 3 Pro
            ================================================
            `);
        });
    } catch (err) {
        console.error('Critical Database Failure:', err);
        process.exit(1);
    }
};

startServer();
