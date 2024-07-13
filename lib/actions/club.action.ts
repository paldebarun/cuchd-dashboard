"use server"

import {connectToDb} from '../mongoose';
import Club from '@/model/club.model';
import mongoose from 'mongoose';

interface IClub  {
    clubName: string;
    studentRepName: string;
    studentRepEmail: string;
    studentRepUid: string;
}


export async function createClub(data:IClub){
  
    try{
        await connectToDb();
        const newClub=new Club(data);
        await newClub.save();

        return JSON.stringify(newClub);
    }
    catch(error){
        console.log("the internal server error is : ",error);

    }
}


export async function fetchClubDetails(){
  try{
    
    const response =await Club.find();

    return JSON.stringify(response);

  }catch(error){
    console.log("error fetching club details : ",error);
  }

}

export async function deleteClubById(_id:mongoose.Types.ObjectId){
  try{
   await connectToDb();

   const deletedClub=await Club.findByIdAndDelete(_id).exec();


   return JSON.stringify(deletedClub);


  }
  catch(error){
    console.log("error occured while deleting the club",error);
  }
}