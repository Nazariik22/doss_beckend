import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://nazariik20:fV8OCCXsW2W31VgN@cluster0.loblygb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    } catch (error) {
        console.error("Помилка підключення до MongoDB:", error.message);
        process.exit(1); 
    }
};

export default connectDB;
