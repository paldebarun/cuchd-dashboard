"use client"
import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { IoAddOutline, IoMenuOutline } from 'react-icons/io5';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useRouter } from "next/navigation";
import { navdata } from '../navdata';
import { IClub } from '@/model/club.model';
import { fetchClubByStudentID, updateClub } from '@/lib/actions/club.action';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createUser } from '@/lib/actions/saveUser.action';
import mongoose from 'mongoose';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { AlertModal } from '@/components/alert-modal';
import { deleteFacultyAdvisor } from '@/lib/actions/faculty.action';

interface IFacultyAdv {
  facultyAdvId:string,
  facultyAdvName: string,
  facultyAdvUid: string,
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

const Page = ({ params }: { params: { studentId: string } }) => {
  const studentId = params.studentId;
  const router = useRouter();
  const [club, setClub] = useState<IClub>();
  const [facultyAdv, setFacultyAdv] = useState<IFacultyAdv| null>();
  const [facultyAdvCreated, setFacultyAdvCreated] = useState(false);
  const [formData, setFormData] = useState<IFacultyAdv>({
    facultyAdvId:'',
    facultyAdvName: '',
    facultyAdvUid: '',
  });

  useEffect(() => {
    async function fetchData() {
      const toastId = toast.loading("Fetching ...");
      try {
        const fetchedClubOfThisStudentRep = await fetchClubByStudentID(studentId);
        if (fetchedClubOfThisStudentRep) {
          const jsonClub = JSON.parse(fetchedClubOfThisStudentRep);
          setClub(jsonClub);

          if (jsonClub?.facultyAdvUid && jsonClub?.facultyAdvId && jsonClub?.facultyAdvName) {
            setFacultyAdvCreated(true);
            setFacultyAdv({
              facultyAdvId:jsonClub.facultyAdvId,
              facultyAdvName: jsonClub.facultyAdvName,
              facultyAdvUid: jsonClub.facultyAdvUid,
            });
          }
        } else {
          console.error("No faculty advisor data found for this club.");
        }
        toast.dismiss(toastId);
      } catch (error) {
        toast.dismiss(toastId);
        console.log("There was an error while fetching club and events", error);
      }
    }

    fetchData();
  }, [studentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('creating...');
    try {
      const password = generateRandomPassword();
      const userCreationResponse = await createUser({
        userId: formData.facultyAdvUid,
        password: password,
        role: "Faculty_Advisor"
      });

      const jsonUser = JSON.parse(userCreationResponse);

      const updateClubResponse = await updateClub(new mongoose.Types.ObjectId(club?._id), {
        facultyAdvId: jsonUser._id,
        facultyAdvName: formData.facultyAdvName,
        facultyAdvUid: formData.facultyAdvUid
      });

      setFacultyAdvCreated(true);
      setFacultyAdv({
        
        facultyAdvId:jsonUser._id,
        facultyAdvName: formData.facultyAdvName,
        facultyAdvUid: formData.facultyAdvUid,
      });

      toast.dismiss(toastId);
      toast.success("Faculty advisor created successfully");

      router.refresh();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error creating faculty advisor");
      console.log("Error creating faculty advisor:", error);
    }
  };

  const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   
   const onDelete = async () => {
    const toastId=toast.loading("processing...")
    try {
        setLoading(true);
        const deleteFacultyAdvresponse=await deleteFacultyAdvisor(new mongoose.Types.ObjectId(facultyAdv?.facultyAdvId));
        console.log("this is delete response",deleteFacultyAdvresponse); 
        toast.success("deleted successfully");
        setFacultyAdvCreated(false);
        setFacultyAdv(null);

    } catch (error: any) {
      console.log("this is error : ",error);
      toast.error("error occured ! try again");
    } finally {
      setLoading(false);
      setOpen(false);
      toast.dismiss(toastId);
      
    }
  };

  return (
    <div>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> 
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
                      router.push(`/dashboard/studentRepresentative/${studentId}/${element.link}`);
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

      {!facultyAdvCreated && (
        <div className='w-full flex justify-end px-10'>
          <Dialog>
            <DialogTrigger asChild>
            <Button>
                                <div className='flex justify-center items-center gap-2'>
                                    <IoAddOutline className='text-xl'/>
                                    <p>Create Faculty Advisor</p>
                                </div>
                                </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a faculty Advisor</DialogTitle>
              </DialogHeader>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Faculty Advisor</CardTitle>
                  <CardDescription>Create faculty advisor here</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="facultyAdvName">Faculty Advisor name</Label>
                        <Input
                          id="facultyAdvName"
                          placeholder="Enter faculty advisor name"
                          value={formData.facultyAdvName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="facultyAdvUid">Faculty Advisor uid</Label>
                        <Input
                          id="facultyAdvUid"
                          placeholder="Enter faculty advisor uid"
                          value={formData.facultyAdvUid}
                          onChange={handleInputChange}
                        />
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
      )}

      {facultyAdvCreated && (

     
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Faculty Advisor</h1>
         
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{facultyAdv?.facultyAdvUid}</TableCell>
                <TableCell>{facultyAdv?.facultyAdvName}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={()=>{
                      router.push(`/dashboard/studentRepresentative/${studentId}/facultyAdvisor/${facultyAdv?.facultyAdvId}`);
                    }}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
     
    </div>
  )
}

export default Page;
