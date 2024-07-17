"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IoMenuOutline } from "react-icons/io5";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useRouter } from "next/navigation"
import { fetchEvents } from "@/lib/actions/events.action";
import { navdata } from './navdata'
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { iEvent } from "@/model/event.model";

const Page = () => {
  const router = useRouter();
  const [events, setEvents] = useState<iEvent[]>([]);

  useEffect(() => {
    async function func() {
      const toastId = toast.loading("Fetching events...");
      try {
        const fetchedEvents = await fetchEvents();
        console.log("Fetched events:", fetchedEvents);

        if (fetchedEvents) {
          const jsonEvents: iEvent[] = JSON.parse(fetchedEvents);
          console.log("Parsed events:", jsonEvents);
          setEvents(jsonEvents);
        } else {
          console.error("No events data found.");
        }
      } catch (error) {
        toast.error("Error occurred while fetching events! Try again.");
        console.log("Error while fetching events:", error);
      } finally {
        toast.dismiss(toastId);
      }
    }

    func();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="px-5">
      <Sheet >
        <SheetTrigger asChild>
          
          <Button variant="outline"  size={"icon"}>
            <IoMenuOutline className="text-lg" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Navigate</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-10 pt-10">
            {navdata.map((element, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger>
                  <Button onClick={() => { router.push(`/dashboard/centralOffice/${element.link}`) }} variant="link">
                    {element.tag}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  {element.description}
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      </div>
     

      <DataTable columns={columns} data={events} />
    </div>
  )
}

export default Page
