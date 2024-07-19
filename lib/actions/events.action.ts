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

  export async function updateEventById(_id: string | unknown, data: Partial<iEvent>) {
    try {
        await connectToDb();

        if(typeof _id!=="string"){
          throw new Error("invalid id");
          
        }

        const updatedEvent = await Event.findByIdAndUpdate(new mongoose.Types.ObjectId(_id), data, { new: true }).exec();
        return JSON.stringify(updatedEvent);
    } catch (error) {
        console.log("error occurred while updating the event", error);
    }
}

export async function fetchEventById(_id:mongoose.Types.ObjectId){
  try{
     await connectToDb();
     const event=await Event.findById(_id);

     return JSON.stringify(event);
  }
  catch(error){
    console.log("error while fetching event by Id is : ",error);
  }
}

export async function fetchUnvefeaturedEvent(){
  try{
  await connectToDb();
  const events=await Event.find({feature:false});

  return JSON.stringify(events);

  }
  catch(error){
    console.log("there has been error while fetching unfeatured events")
  }
}

export async function fetchUnhighlightedEvent(){
  try{
  await connectToDb();
  const events=await Event.find({feature:true});

  return JSON.stringify(events);

  }
  catch(error){
    console.log("there has been error while fetching unfeatured events")
  }
}





function getLastDateOfPreviousMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 0);
}

export async function fetchClubsOfEventsUntilNow() {
  try {
    await connectToDb();
    const lastDateOfPreviousMonth = getLastDateOfPreviousMonth();

   
    const eventsTillLastMonth = await Event.find({
      date: { $lt: lastDateOfPreviousMonth }
    }).populate('club');

   
    const eventsTillToday = await Event.find({
      date: { $lt: new Date() }
    }).populate('club');

    const combinedEvents = [...eventsTillLastMonth, ...eventsTillToday];

   
    const uniqueClubs = Array.from(new Set(
      combinedEvents
        .filter(event => event.club !== null)
        .map(event => event.club._id.toString())
    )).map(id => combinedEvents.find(event => event.club && event.club._id.toString() === id)?.club);

    return JSON.stringify(uniqueClubs);
  } catch (error) {
    console.log("there was an error while fetching clubs of events until now", error);
  }
}
