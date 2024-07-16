"use server"

import mongoose from 'mongoose';
import {connectToDb} from '../mongoose';
import { Club } from '@/model';
import Event from '@/model/event.model';


export async function fetchEventsToApproveByFacultyAdvisor(id:mongoose.Types.ObjectId){
    try{
        await connectToDb();
        const club=await Club.findOne({facultyAdvId:id});
         
        const clubId=club._id;
        
        const requiredEvents=await Event.find({club:clubId,approved:false});
    
        return JSON.stringify(requiredEvents);
     
    
    }
    catch(error){
      
        console.log("there was an error in fetching event : ",error);
    
    }
    
    }