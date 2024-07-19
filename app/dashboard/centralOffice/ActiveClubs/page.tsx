"use client";

import React, { useEffect, useState } from 'react';
import { DataTable } from "./data-table"
import { Button } from '@/components/ui/button';
import { navdata } from '../navdata';
import { columns } from "./columns"
import { IClub } from '@/model/club.model';

import { useRouter } from 'next/navigation';

import { IoMenuOutline } from "react-icons/io5";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
  import {
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
    } from "@/components/ui/hover-card"
    
  
 import toast from 'react-hot-toast';



import { fetchClubsOfEventsUntilNow } from '@/lib/actions/events.action';








const Page = () => {

    const router=useRouter();
    const [data, setData] = useState<IClub[]>([]); 

    useEffect(() => {
        const fetchData = async () => {
            const toastid = toast.loading("Loading active club details...");
            try {
                const clubData = await fetchClubsOfEventsUntilNow();
                console.log("this is club fetch response : ",clubData);
                if (clubData) {
                    const parsedData = JSON.parse(clubData) as IClub[];
                    setData(parsedData);
                    console.log("These are the clubs", parsedData);
                } else {
                    toast("No clubs");
                    setData([]);
                }
            } catch (error) {
                
                toast.error("Error while fetching club details");
                console.log("Error while fetching club details: ", error);
            } finally {
                toast.dismiss(toastid);
            }
        };
        fetchData();
    }, []);
    

   

    

    

    return (
        <div className='w-screen'>
            <Sheet >
          <SheetTrigger asChild>
            <div className='py-6 px-6'>
            <Button variant="outline"  size={"icon"}><IoMenuOutline className='text-xl'/></Button>
            </div>
            
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
            <div className='w-full flex flex-col items-end'>
                <div className='px-10 py-5'>
                    
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
};

export default Page;
