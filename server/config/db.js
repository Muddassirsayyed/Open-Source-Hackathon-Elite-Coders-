import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixmate_ai';
    console.log(`Connecting to MongoDB at: ${connUri.replace(/:[^:]*@/, ':***@')}`); // Hide passwords if any
    
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Ensure MongoDB service is running locally, or verify MONGODB_URI in the environment variables.');
    // Do not crash the process in hackathon dev/test modes; allow running with mock data
  }
};

export default connectDB;
