"use server";
import { connectToDb } from '../mongoose';
import { User } from '@/model';

interface iUser {
  userId: string;
  password: string;
}



export async function loginUser(data: iUser):Promise<string> {
  try {
    await connectToDb();
    const { userId, password } = data;
    
   
    const user = await User.findOne({ userId, password }).lean().exec();
    console.log("this is user : ", typeof user);
    if (!user) {
      throw new Error("Invalid userId or password");
    }

    
    const obj= { id:user._id,userId: user?.userId, role: user?.role, createdAt: user?.createdAt };

    return JSON.stringify(obj);

  } catch (error) {
    console.error("The error while logging in the user:", error);
    throw new Error("Login error");
  }
}
