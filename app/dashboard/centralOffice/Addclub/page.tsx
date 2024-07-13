"use client";

import React, { useEffect, useState } from 'react';
import { DataTable } from "./data-table"
import { Button } from '@/components/ui/button';
import { navdata } from '../navdata';
import { columns } from "./columns"
import { IClub } from '@/model/club.model';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
  

import { createClub, fetchClubDetails } from '@/lib/actions/club.action';

interface IClubFormData {
    clubName: string;
    studentRepName: string;
    studentRepEmail: string;
    studentRepUid: string;
}


interface IClubFormat extends IClub {
}

const Page = () => {

    const router=useRouter();
    const [data, setData] = useState<IClubFormat[]>([]); // Initialize with correct type

    useEffect(() => {
        const toastid=toast.loading("Loading club details...")
        const fetchData = async () => {
            
            try {
                const clubData = await fetchClubDetails();
                if (clubData) {
                    const parsedData = JSON.parse(clubData) as IClubFormat[];
                    setData(parsedData);
                    console.log("These are the clubs", parsedData);
                   
                } else {
                    toast("No clubs")
                    setData([]);
                }
                toast.dismiss(toastid);
                
            } catch (error) {
                toast.error("error");
                console.log("Error while fetching club details: ", error);
            }
        };
        fetchData();
    }, []);

    const [formData, setFormData] = useState<IClubFormData>({
        clubName: "",
        studentRepName: "",
        studentRepEmail: "",
        studentRepUid: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        const taostId =toast.loading("processing...");
        try {
            const createClubResponse = await createClub(formData);
            const jsonparsedData=JSON.parse(createClubResponse) as IClubFormat;
            setData(prevData => [...prevData, jsonparsedData]); 
            console.log("this is club response : ", createClubResponse);
            setFormData({ 
                clubName: "",
                studentRepName: "",
                studentRepEmail: "",
                studentRepUid: ""
            });

          toast.dismiss(taostId);
           toast.success("successfully created club")  ; 
        } catch (error) {
            toast.error("error while creating taost");
            console.log("the error is : ", error);
        }
    };

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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Create Club</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a club</DialogTitle>
                            </DialogHeader>
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Club</CardTitle>
                                    <CardDescription>Create club here</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="clubName">Club Name</Label>
                                                <Input id="clubName" placeholder="Enter club name" value={formData.clubName} onChange={handleChange} />
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="studentRepName">Student representative name</Label>
                                                <Input id="studentRepName" placeholder="Enter student representative name" value={formData.studentRepName} onChange={handleChange} />
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="studentRepEmail">Student representative email</Label>
                                                <Input id="studentRepEmail" placeholder="Enter student representative email" value={formData.studentRepEmail} onChange={handleChange} />
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="studentRepUid">Student representative uid</Label>
                                                <Input id="studentRepUid" placeholder="Enter student representative uid" value={formData.studentRepUid} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <CardFooter className="flex justify-between mt-4">
                                            <Button variant="outline" type="button" onClick={() => setFormData({ clubName: "", studentRepName: "", studentRepEmail: "", studentRepUid: "" })}>
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
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
};

export default Page;
