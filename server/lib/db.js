import mongoose from "mongoose";

// Function to connect to MongoDB database
export const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONOGDB_URI}/chat-app`);
        } catch (error) {
            console.log(error);
        } 
}