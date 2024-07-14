"use server";

import {connectToDb} from '../mongoose';
import { User } from '@/model';

interface iUser {
  userId: string;
  password?: string;
  role: string;
}

export async function createUser(data:iUser){
  try{
    await connectToDb();
    const newUser=new User(data);
    const findUser=await User.findOne({userId:data.userId});

    if(findUser){
       
            throw new Error("User is already a member");
        
    }
    await newUser.save();

    return JSON.stringify(newUser);

  }
  catch(error){
   console.log("an error occured while creating user",error);
   throw new Error("error in creating user");

  }

}