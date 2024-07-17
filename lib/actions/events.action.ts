"use server"

import {connectToDb} from '../mongoose';
import Event from '@/model/event.model';
import mongoose from 'mongoose'

export interface iEvent{
    eventName: string;
    image: string;
    description: string;
    feature: boolean;
    club: mongoose.Schema.Types.ObjectId;
    organizer: string;
    approved: boolean;
    date: Date;
    seats: number;
    
}

export async function createEvent(data:iEvent){
try{
    await connectToDb();
    const eventResponse=new Event(data);
     
    await eventResponse.save();

    return JSON.stringify(eventResponse);
 

}
catch(error){
  
    console.log("there was an error in creating event : ",error);

}

}


export async function fetchEvents(){

    try{
    
        const eventresponse=await Event.find().populate('club');

        return JSON.stringify(eventresponse);

    }
    catch(error){
     console.log("there was an error while fetching all events");
    }
}

export async function deleteEventById(_id:mongoose.Types.ObjectId){
    try{
     await connectToDb();
  
     const deletedEvent=await Event.findByIdAndDelete(_id).exec();
  
  
     return JSON.stringify(deletedEvent);
  
  
    }
    catch(error){
      console.log("error occured while deleting the event",error);
    }
  }

  export async function fetchEventsOfAParticularClub(_id:mongoose.Types.ObjectId){
    try{
      await connectToDb();
      
     const response=await Event.find({club:_id});

     return JSON.stringify(response);
    }
    catch(error){
      console.log("there was an error while fetching the events by a club")
    }
  }

  export async function updateEventById(_id: mongoose.Types.ObjectId, data: Partial<iEvent>) {
    try {
        await connectToDb();
        const updatedEvent = await Event.findByIdAndUpdate(_id, data, { new: true }).exec();
        return JSON.stringify(updatedEvent);
    } catch (error) {
        console.log("error occurred while updating the event", error);
    }
}