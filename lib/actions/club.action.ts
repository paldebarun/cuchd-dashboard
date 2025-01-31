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

interface IFaculty {

  facultyAdvName: string;
  facultyAdvUid: string;
  facultyAdvId: mongoose.Types.ObjectId;
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

export async function updateClub(id:mongoose.Types.ObjectId,data:IFaculty){
  
  try {
    await connectToDb();
    const updatedClub = await Club.findByIdAndUpdate(id, data, { new: true }).exec();
    return JSON.stringify(updatedClub);
} catch (error) {
    console.log("the internal server error is : ", error);
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

export async function deleteClubById(_id:string | unknown){
  try{
   await connectToDb();
   if (typeof _id !== "string") {
    throw new Error("Invalid type of id");
  }



   
   const deletedClub=await Club.findByIdAndDelete(new mongoose.Types.ObjectId(_id)).exec();


   return JSON.stringify(deletedClub);

   
  }
  catch(error){
    console.log("error occured while deleting the club",error);
  }
}


export async function fetchClubByStudentID(studentID:string){
  try{
   await connectToDb();

   const club=await Club.findOne({studentRepId: new mongoose.Types.ObjectId(studentID)});

   console.log("the club fetched by student id : ",club);
   return JSON.stringify(club);


  }
  catch(error){
    console.log("club couldn't be fetched due to an error : ",error);
  }
}
