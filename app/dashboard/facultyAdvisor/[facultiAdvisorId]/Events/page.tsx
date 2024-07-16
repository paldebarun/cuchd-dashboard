"use client"
import React, { useEffect, useState } from 'react'
import { fetchEventsToApproveByFacultyAdvisor } from '@/lib/actions/faculty.action'
import { useRouter } from 'next/navigation'
import mongoose from 'mongoose';
import { DataTable } from './data-table';
import { columns } from './columns';

const page = ({params}:{params:{facultiAdvisorId:string}}) => {
  const router=useRouter();
  const facultyAdvisorId= params.facultiAdvisorId;
  const [events,setEvents]=useState([]);
  
  useEffect(() => {
   
    const fetchEvents=async ()=>{
        console.log("this is facultyid : ",facultyAdvisorId);
        try{

          const events=await fetchEventsToApproveByFacultyAdvisor(new mongoose.Types.ObjectId(facultyAdvisorId));
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
    <div>

    <DataTable columns={columns} data={events} />
    </div>
  )
}

export default page