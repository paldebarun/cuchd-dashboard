"use server";

import mongoose from "mongoose";
import { connectToDb } from "../mongoose";
import { Club, User } from "@/model";
import Event from "@/model/event.model";

interface IFacultyAdv {
    facultyAdvUid: string;
    facultyAdvName: string;
    facultyAdvId:string;
}

const generateRandomPassword = () => {
    const specialChars = "!@#$%^&*()_+{}:\"<>?|[];',./";
    const numbers = "0123456789";
    const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const allChars = specialChars + numbers + alphabets;

    let password = "";
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += alphabets[Math.floor(Math.random() * alphabets.length)];

    for (let i = 0; i < 5; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => 0.5 - Math.random()).join('');
}


export async function fetchEventsToApproveByFacultyAdvisor(
  id: mongoose.Types.ObjectId
) {
  try {
    await connectToDb();
    const club = await Club.findOne({ facultyAdvId: id });

    const clubId = club._id;

    const requiredEvents = await Event.find({ club: clubId, approved: false });

    return JSON.stringify(requiredEvents);
  } catch (error) {
    console.log("there was an error in fetching event : ", error);
  }
}

export async function deleteFacultyAdvisor(id: mongoose.Types.ObjectId) {
  try {
    console.log("faculty id: ",id);
    const requireClub = await Club.findOne({ facultyAdvId: id });
    console.log("this is required club : ",requireClub);
   
    if (requireClub) {
     const res= await Club.findByIdAndUpdate(
        { _id: requireClub._id,new:true },
        {
          facultyAdvUid: "not created",
          facultyAdvId: null,

          facultyAdvName: "not created",
        }
      ).exec();
    
      console.log("Club updated successfully",res);
    } else {
      console.log("No club found with the provided faculty advisor ID");
    }

    const deleteResponse = await User.findByIdAndDelete(id);
    
    return JSON.stringify(deleteResponse);
  } catch (error) {
    console.log("this is the error while deleting faculty Advisor : ", error);
  }
}

export async function fetchFacultyAdvisorById(id:mongoose.Types.ObjectId){
    try{
     
        const requiredData=await User.findById(id);

        const club=await Club.findOne({facultyAdvId:id});

        const obj={
            facultyAdvUid:  club.facultyAdvUid,
            facultyAdvName:  club.facultyAdvName
        }

        return JSON.stringify(obj);


    }
    catch(error){
      console.log("error : ",error);
    }

}





export async function updateFacultyAdvisor(data: IFacultyAdv) {
    try {
        console.log("Received data: ", data);

        const isUserPresent = await User.findOne({ userId: data.facultyAdvUid });
        console.log("User present: ", isUserPresent);

        const club = await Club.findOne({ facultyAdvId: data.facultyAdvId });
        if (!club) {
            throw new Error("Club not found");
        }

        let updatedClub;
        if (isUserPresent) {
            updatedClub = await Club.findByIdAndUpdate(
                club._id,
                {
                    facultyAdvId: isUserPresent._id,
                    facultyAdvUid: data.facultyAdvUid,
                    facultyAdvName: data.facultyAdvName
                },
                { new: true }
            ).exec();
            console.log("Updated existing user in club: ", updatedClub);
        } else {
            const password = generateRandomPassword();
            const newUser = new User({
                userId: data.facultyAdvUid,
                password: password,
                role:"Faculty_Advisor"
            });

            const user = await newUser.save();
            console.log("Created new user: ", user);

            updatedClub = await Club.findByIdAndUpdate(
                club._id,
                {
                    facultyAdvId: user._id,
                    facultyAdvUid: data.facultyAdvUid,
                    facultyAdvName: data.facultyAdvName
                },
                { new: true }
            ).exec();
            console.log("Updated club with new user: ", updatedClub);
        }

        if (updatedClub) {
            console.log("Club updated successfully", updatedClub);
        } else {
            console.log("Failed to update club");
        }
    } catch (error) {
        console.error("Error updating faculty advisor: ", error);
    }
}
