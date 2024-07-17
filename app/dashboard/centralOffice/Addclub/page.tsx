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
 import { IoAddOutline } from "react-icons/io5";

import { createClub, fetchClubDetails } from '@/lib/actions/club.action';
import { createUser } from '@/lib/actions/saveUser.action';
import mongoose from 'mongoose';

interface IClubFormData {
    clubName: string;
    studentRepName: string;
    studentRepEmail: string;
    studentRepUid: string;
   
}

const generateRandomPassword = () => {
    const specialChars = "!@#$%^&*()_+{}:\"<>?|[];',./";
    const numbers = "0123456789";
    const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const allChars = specialChars + numbers + alphabets;

    let password = "";
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += alphabets[Math.floor(Math.random() * alphabets.length)];

    for (let i = 0; i < 5; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => 0.5 - Math.random()).join('');
}




const Page = () => {

    const router=useRouter();
    const [data, setData] = useState<IClub[]>([]); 

    useEffect(() => {
        const fetchData = async () => {
            const toastid = toast.loading("Loading club details...");
            try {
                const clubData = await fetchClubDetails();
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

            const password = generateRandomPassword();
            const userObject={
                userId:formData.studentRepUid,
                password:password,
                role:"student_representative"
            }

            const userCreationResponse=await createUser(userObject);
            const jsonuser=JSON.parse(userCreationResponse);
            console.log("user id : ",typeof jsonuser._id);

            const ClubObject={
                clubName:formData.clubName,
                studentRepName:formData.studentRepName,
                studentRepEmail:formData.studentRepEmail,
                studentRepUid:formData.studentRepUid,
                studentRepId:new mongoose.Types.ObjectId(jsonuser._id),
                facultyAdvId:null,
                facultyAdvName:"not yet created",
                facultyAdvUid:"not yet created"
            }
            
            const createClubResponse = await createClub(ClubObject);
           
            if(createClubResponse){
            
           

            console.log("this is user response : ",userCreationResponse);


            const jsonparsedData=JSON.parse(createClubResponse) ;
            setData(prevData => [...prevData, jsonparsedData]); 
            console.log("this is club response : ", createClubResponse);
            setFormData({ 
                clubName: "",
                studentRepName: "",
                studentRepEmail: "",
                studentRepUid: ""
            });

          toast.dismiss(taostId);
           toast.success("successfully created club")  ;} 
        } catch (error) {
            toast.dismiss(taostId);
            toast.error(`${error}`);
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
                            <Button>
                                <div className='flex justify-center items-center gap-2'>
                                    <IoAddOutline className='text-xl'/>
                                    <p>Create Club</p>
                                </div>
                                </Button>
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
