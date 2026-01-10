
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Load Environment Configuration
dotenv.config();

// Ensure DB is connected before listening
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        
        app.listen(PORT, () => {
            console.log(`
            ================================================
            ADMAS UNIVERSITY LOGISTICS SYSTEM
            ================================================
            Status: ONLINE
            Port: ${PORT}
            Intelligence Core: Gemini 3 Pro
            Architecture: MERN (Decoupled)
            ================================================
            `);
        });
    } catch (err) {
        console.error('Critical Failure: Database Connection', err);
        process.exit(1);
    }
};

startServer();
