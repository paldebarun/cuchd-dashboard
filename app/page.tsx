"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createUser } from "@/lib/actions/saveUser.action";
import { useRouter } from "next/navigation";

interface iUser {
  userId: string;
  password?: string;
  role: string;
}

export default function Home() {
  
  const router=useRouter();

  const [formData, setFormData] = useState<iUser>({
    userId: "",
    password: "",
    role: "",
  });
  
  const handleChange = (e:any) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleRoleChange = (value:string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: value,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
   try{
    console.log("inside submit");
    const responseofSaveUser=await createUser(formData);

    console.log("this is response of user creation ",responseofSaveUser);
    router.push('/login');

   }
   catch(error){

     console.log("the error while creating user is : ",error);
   }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Card className="w-[500px] shadow-lime-400 shadow-md">
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>Create User here</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="userId">User Id</Label>
                <Input id="userId" placeholder="Enter your user id" value={formData.userId} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="central_office">Central Office</SelectItem>
                    <SelectItem value="student_representative">Student Representative</SelectItem>
                    <SelectItem value="faculty_advisor">Faculty Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button variant="outline" type="button" onClick={() => setFormData({ userId: "", password: "", role: "" })}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
