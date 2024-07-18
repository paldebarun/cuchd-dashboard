"use client"
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { DataTable } from './data-table';
import { columns } from './columns';
import { fetchUnvefeaturedEvent } from '@/lib/actions/events.action';
import { iEvent } from '@/model/event.model';
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
import { Button } from '@/components/ui/button';
import { navdata } from '../navdata';

    
const page = () => {
  const router=useRouter();

  const [events,setEvents]=useState<iEvent[]>([]);
  
  useEffect(() => {
   
    const fetchEvents=async ()=>{
        
        try{

          const events=await fetchUnvefeaturedEvent();
          if(events){
          const jsonEvents=JSON.parse(events);

          console.log("these are the events : ",jsonEvents);

          setEvents(jsonEvents);
          }
        }
        catch(error){
          console.log("couldn't fetch the events",error);
        }
    }
  
    fetchEvents();
  }, [])
  

  return (
    <div className='flex flex-col gap-10'>
     <div className='px-6'>
     <Sheet >
          <SheetTrigger asChild>
            <Button variant="outline"  size={"icon"}>{<IoMenuOutline className="text-lg"/>}</Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Navigate</SheetTitle>
              
            </SheetHeader>
           <div className="flex flex-col gap-10 pt-10">
            {
                navdata.map((element,index)=>(
                    <HoverCard key={index} >
                    <HoverCardTrigger>
                        <Button onClick={()=>{router.push(`/dashboard/centralOffice/${element.link}`)}} variant="link"> {element.tag}</Button>
                       </HoverCardTrigger>
                    <HoverCardContent>
                      {element.description}
                    </HoverCardContent>
                  </HoverCard>
                  
                ))
            }
            </div>
            
          </SheetContent>
        </Sheet>
        </div>
    <DataTable columns={columns} data={events} />
    </div>
  )
}

export default page