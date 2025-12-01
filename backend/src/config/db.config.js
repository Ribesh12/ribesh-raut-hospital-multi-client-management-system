import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

const connect = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/hmt'
    );
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    throw error;
  }
};

export default connect;
