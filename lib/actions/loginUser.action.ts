"use server";
import { connectToDb } from '../mongoose';
import { User } from '@/model';

interface iUser {
  userId: string;
  password: string;
}

interface returnlogin{
    userId: string;
  role: string;
  createdAt:Date;
}

export async function loginUser(data: iUser):Promise<returnlogin> {
  try {
    await connectToDb();
    const { userId, password } = data;
    
   
    const user = await User.findOne({ userId, password }).lean().exec();
    console.log("this is user : ",user);
    if (!user) {
      throw new Error("Invalid userId or password");
    }


    return { userId: user.userId, role: user.role, createdAt: user.createdAt };
  } catch (error) {
    console.error("The error while logging in the user:", error);
    throw new Error("Login error");
  }
}
