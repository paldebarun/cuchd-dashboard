"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { fetchEventById } from "@/lib/actions/events.action"
import mongoose from "mongoose"
import { iEvent } from "@/model/event.model"
import { format } from "date-fns"

export default function Page({params}:{params:{facultyAdvisorId:string}}) {

    const eventId=params.facultyAdvisorId;
    const [event,setEvent]=useState<iEvent>();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const event = await fetchEventById(new mongoose.Types.ObjectId(eventId));
                if (event) {
                    const jsonEvent = JSON.parse(event);
                    setEvent(jsonEvent);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, [eventId]);
   
    const formattedDate = event?.date ? format(new Date(event.date), 'MMMM dd, yyyy HH:mm') : '';

  return (
    <div className="w-full px-6">
      <section className="w-full relative overflow-hidden rounded-xl">
        <img
          src={event?.image}
          width={1920}
          height={600}
          alt="Event Banner"
          className="w-full h-[400px] md:h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-3xl font-bold sm:text-5xl">{event?.eventName}</h1>
          <p className="mt-4 max-w-[800px] text-lg sm:text-xl">
           {event?.description}
          </p>
        </div>
      </section>
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Organizer</h2>
            <div className="flex items-center gap-4">
              <Avatar className="border w-12 h-12">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{event?.organizer}</div>
                
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Date &amp; Time</h2>
            <div className="flex items-center gap-4">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">{formattedDate}</div>
               
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Seats Available</h2>
            <div className="flex items-center gap-4">
              <TicketIcon className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">{event?.seats}</div>
                <div className="text-muted-foreground">Tickets Left</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function TicketIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  )
}


function XIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}