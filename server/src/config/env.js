import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'API_KEY'];

requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.warn(`[WARNING] Missing environment variable: ${env}`);
  }
});

export default process.env;