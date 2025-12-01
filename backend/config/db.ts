import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config()

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI not found")
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB;