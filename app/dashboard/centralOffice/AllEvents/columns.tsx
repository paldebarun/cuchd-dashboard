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
    approved: boolean;
    club: {
      clubName: string;
    };
  };
// import { deleteEventById } from "@/lib/actions/events.action";

// import { AlertModal } from "@/components/alert-modal";
// import { useState } from "react";
// import mongoose from "mongoose";
// import toast from "react-hot-toast";


export const columns: ColumnDef<Events>[] = [

   
  {
    accessorKey: "eventName",
    header: "Event name",
  },
  {
    accessorKey: "club.clubName",
    header: "Club",
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

      const handleOpenClick = () => {
        console.log("Open clicked for Event:", event);
        
      };

     

    //   const [open, setOpen] = useState(false);
    //   const [loading, setLoading] = useState(false);

    //   const onConfirm = async () => {
    //     const toastId=toast.loading("deleting...");

    //     try {
            
    //       const deletedEvent=await deleteEventById(new mongoose.Types.ObjectId(event._id));
    //       console.log("this id delete response : ",deletedEvent);
    //       toast.dismiss(toastId);
    //       toast.success("successfully deleted");

    //     } catch (error) {
    //      toast.dismiss(toastId);
    //      toast.error("can't be deleted");
    //      console.log("there has been an error : ",error);
    //     } finally {
    //       setOpen(false);
    //       setLoading(false);
    //     }
    //   };


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
            {/* <DropdownMenuItem>Edit</DropdownMenuItem>
            
                <DropdownMenuItem onClick={() => setOpen(true)}>Delete</DropdownMenuItem> */}
              
          </DropdownMenuContent>
        </DropdownMenu>

        </div>
      );
    },
  },
];

