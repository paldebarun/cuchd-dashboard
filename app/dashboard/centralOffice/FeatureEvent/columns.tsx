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
import { iEvent } from "@/model/event.model";

// import { deleteEventById } from "@/lib/actions/events.action";
import { updateEventById } from "@/lib/actions/events.action";
// import { AlertModal } from "@/components/alert-modal";
// import { useState } from "react";
// import mongoose from "mongoose";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<iEvent>[] = [

   
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

      const handleOpenClick = () => {
        console.log("Open clicked for Event:", event);
        router.push(`/dashboard/centralOffice/FeatureEvent/${event._id}`);
      };

    

      // const [open, setOpen] = useState(false);
      // const [loading, setLoading] = useState(false);
      
      const handleFeatureEvent=async ()=>{
        const toastId=toast.loading("featuring event...");
        try{
         const updateEventResponse=await updateEventById(event._id,{feature:true});

         toast.success("event featured successfully");
         
         router.refresh();  
         
        }
        catch(error){
          console.log("the error while featuring the event : ",error);
          toast.error("error ! event not featured");
        }
        finally{
          toast.dismiss(toastId);
        }
      }

      // const onConfirm = async () => {
      //   const toastId=toast.loading("deleting...");
        
      //   try {
            
      //     const deletedEvent=await deleteEventById(new mongoose.Types.ObjectId(event._id));
      //     console.log("this id delete response : ",deletedEvent);
      //     toast.dismiss(toastId);
      //     toast.success("successfully deleted");

      //   } catch (error) {
      //    toast.dismiss(toastId);
      //    toast.error("can't be deleted");
      //    console.log("there has been an error : ",error);
      //   } finally {
      //     setOpen(false);
      //     setLoading(false);
      //   }
      // };
      return (
        <div>

       {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      /> */}
            
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleOpenClick}>Open</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleFeatureEvent}>Feature</DropdownMenuItem>
            
                
              
          </DropdownMenuContent>
        </DropdownMenu>

        </div>
      );
    },
  },
];

