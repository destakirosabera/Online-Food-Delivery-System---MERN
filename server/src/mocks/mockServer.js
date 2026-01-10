
import Food from '../models/Food.js';
import User from '../models/User.js';

const seedDatabase = async () => {
  try {
    await Food.deleteMany();
    await User.deleteMany();

    await Food.insertMany([
      { name: 'Admas Special Platter', description: 'Student favorite mix.', price: 15.00, category: 'Healthy' },
      { name: 'Campus Burger', description: 'Double beef with cheese.', price: 8.50, category: 'Burgers' }
    ]);

    console.log('Database seeded for Admas FYP demonstration.');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
};

export default seedDatabase;
