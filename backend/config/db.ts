import 'dotenv/config';
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI!) {
            throw new Error("MONGO_URI not found")
        }
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB;