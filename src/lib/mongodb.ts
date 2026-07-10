import mongoose from "mongoose";

export const connectDB = () => {
    const MONGODB_URI = process.env.MONGODB_URI!
    try {
        const conn = mongoose.connect(MONGODB_URI)
        console.log("Database Connected Succesfully");
        
    } catch (error) {
        console.log("Issue in Database Conn")
        
    }
}