import mongoose from "mongoose";
import "@/model/index";

let isConnected: boolean = false;

export const connectToDb = async () => {
    mongoose.set("strictQuery", true);
    if (!process.env.DATABASE_URI) {
      return console.log("Missing Mongodb URL");
    }
    if (isConnected) {
      return console.log("Mongodb is already connected");
    }
    try {
      await mongoose.connect(process.env.DATABASE_URI, {
        dbName: "CU_database",
      
      serverSelectionTimeoutMS: 30000, 
      });
      isConnected = true;
      console.log("Mongodb is connected");
    } catch (e) {
      console.log(e);
    }
  };
  