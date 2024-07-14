"use client";

import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { createEvent, fetchEventsOfAParticularClub } from "@/lib/actions/events.action";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { IoMenuOutline } from "react-icons/io5";
import { navdata } from "../navdata";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { fetchClubByStudentID } from "@/lib/actions/club.action";
import mongoose from "mongoose";
import { IClub } from "@/model/club.model";
import { iEvent } from "@/model/event.model";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const Page = ({ params }: { params: { studentId: string } }) => {
  const router = useRouter();
  const studentId = params.studentId;
  const [club, setClub] = useState<IClub>();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    picture: null as File | null,
    organizer: "",
    seats: 0,
    feature: false,
    approved: false,
  });

  const [events, setEvents] = useState<iEvent[]>([]);

  useEffect(() => {
    
    async function func() {
        const toastId=toast.loading("fetching ...");
      try {
        const fetchedClubofThisStudentRep = await fetchClubByStudentID(studentId);

        if (fetchedClubofThisStudentRep) {
          const jsonClub = JSON.parse(fetchedClubofThisStudentRep);
          setClub(jsonClub);

          const fetchedEvents = await fetchEventsOfAParticularClub(jsonClub._id);

          if (fetchedEvents) {
            const jsonEvents = JSON.parse(fetchedEvents);
            console.log("events : ", jsonEvents);
            setEvents(jsonEvents);
          } else {
            console.error("No events data found for this club.");
          }
        } else {
          console.error("No club data found for this student ID.");
        }

        toast.dismiss(toastId);
      } catch (error) {
        toast.dismiss(toastId);
        console.log("There was an error while fetching club and events", error);
      }
    }

    func();
  }, [studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => ({ ...prevFormData, [id]: checked }));
    } else if (type === "file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: files ? files[0] : null,
      }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prevFormData) => ({ ...prevFormData, feature: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId=toast.loading("Please wait...")
    const eventData = {
      ...formData,
      date,
      studentID: studentId,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVjDZFET4jdrT92jx3JGDykSazDj6fzZ6M4Q&s",
    };
    console.log(eventData);

    try {
      if (club && club._id) {
        const finalEventData = {
          eventName: eventData.eventName,
          description: eventData.description,
          image: eventData.image,
          approved: eventData.approved,
          feature: eventData.feature,
          date: eventData.date,
          organizer: eventData.organizer,
          seats: eventData.seats,
          club: new mongoose.Types.ObjectId(club._id),
        };

        const eventCreationResponse = await createEvent(finalEventData);

        if(eventCreationResponse){

        console.log("this is event response : ", eventCreationResponse);

        const jsonEvent=JSON.parse(eventCreationResponse);
        
        setEvents((prevEvents) => [...prevEvents,jsonEvent]);
        
        setFormData({
            eventName: "",
            description: "",
            picture: null,
            organizer: "",
            seats: 0,
            feature: false,
            approved: false,
          });
          setDate(undefined);
    } 
    toast.success("Event created");
     
      } else {
        toast.error("Enter the data properly");
        console.error("Club data is not available.");
      }

      toast.dismiss(toastId);
    } catch (error) {
        toast.dismiss(toastId);
        toast.error("Error ! try again");
      console.error("There was an error creating the event", error);
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <div className="py-6 px-6">
            <Button variant="outline" size={"icon"}>
              <IoMenuOutline className="text-xl" />
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>{club?.clubName} club</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-10 pt-10">
            {navdata.map((element, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger>
                  <Button
                    onClick={() => {
                      router.push(`/dashboard/centralOffice/${element.link}`);
                    }}
                    variant="link"
                  >
                    {element.tag}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>{element.description}</HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <div className="px-10 py-5 w-screen flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create an event</DialogTitle>
            </DialogHeader>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Event</CardTitle>
                <CardDescription>Create event here</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        id="eventName"
                        placeholder="Enter event name"
                        value={formData.eventName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Enter event description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="picture">Picture</Label>
                      <Input id="picture" type="file" onChange={handleChange} />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="organizer">Organizer name</Label>
                      <Input
                        id="organizer"
                        placeholder="Enter organizer name"
                        value={formData.organizer}
                        onChange={handleChange}
                      />
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick event date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="seats">Number of seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        placeholder="Enter number of seats"
                        value={formData.seats}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="feature"
                        checked={formData.feature}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor="feature"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        You want to feature the event?
                      </label>
                    </div>
                  </div>
                  <CardFooter className="flex justify-between mt-4">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={events} />
    </div>
  );
};

export default Page;
