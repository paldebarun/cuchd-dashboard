import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { MoreHorizontal } from "lucide-react";

export type Events = {
  _id: string;
  eventName: string;
  description: string;
  organizer: string;
  date: string;
  approved:boolean;
};
import { deleteEventById } from "@/lib/actions/events.action";
import { useRouter } from "next/navigation";

import mongoose from "mongoose";
import toast from "react-hot-toast";
import { updateEventById } from "@/lib/actions/events.action";

export const columns: ColumnDef<Events>[] = [
  
 
   
  {
    accessorKey: "eventName",
    header: "Event name",
  },
  {
    accessorKey: "description",
    header: "Event description",
  },
  {
    accessorKey: "organizer",
    header: "Organizer",
  },
  
  {
    accessorKey: "date",
    header: "Date of event",
  },
  {
    accessorKey: "approved",
    header: "Approved",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;

      const router=useRouter();

      const handleOpenClick = async() => {
        console.log("Open clicked for Event:", event);
        try{
         const updatedEvent=await updateEventById(new mongoose.Types.ObjectId(event._id),{
            approved:true
         });

         console.log("the updated event is : ",updatedEvent);
         
        }
        catch(error){
            console.log("an error while approving evnt is : ",error);
        }
      };


      const rejectEvent=async ()=>{
        const toastId=toast.loading("deletion in progress...")
        try{
           
          const deletResponse=await deleteEventById(new mongoose.Types.ObjectId(event._id));

          console.log("this is delete response : ",deletResponse);
           
          toast.success("event rejected");

          router.refresh();
      
        }
        catch(error){
         console.log("the error is : ",error);
         toast.error("event couldn't be rejected, error !");
        }
        finally{
          toast.dismiss(toastId);
        }
      }

     

      

     
      return (
        <div>

            
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleOpenClick}>Approve</DropdownMenuItem>
            <DropdownMenuItem onClick={rejectEvent}>Reject</DropdownMenuItem>
            <DropdownMenuSeparator />
            
            
               
              
          </DropdownMenuContent>
        </DropdownMenu>

        </div>
      );
    },
  },
];

