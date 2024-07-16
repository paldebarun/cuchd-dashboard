"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/actions/loginUser.action";
import toast from "react-hot-toast";

interface iUser {
  userId: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<iUser>({ userId: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId=toast.loading("logging...")
    try {
      console.log("inside submit");
      const response = await loginUser(formData);
      const jsonresponse=JSON.parse(response);

      console.log("this is response of user login ", jsonresponse);
      toast.success("login successfull");
      toast.dismiss(toastId);
      if(jsonresponse.role=='central_office')
      router.push("/dashboard/centralOffice");

      if(jsonresponse.role=="student_representative"){
        router.push(`/dashboard/studentRepresentative/${jsonresponse.id}`);
      }

      if(jsonresponse.role=="Faculty_Advisor"){
        router.push(`/dashboard/facultyAdvisor/${jsonresponse.id}`);
      }
    } catch (error) {
        toast.dismiss(toastId);
        toast.error("login error");
      console.log("the error while creating user is: ", error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Card className="w-[500px]  shadow-md">
        <CardHeader>
          <CardTitle>Login here</CardTitle>
          <CardDescription>Login to access the dashboard</CardDescription>
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
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button variant="outline" type="button" onClick={() => setFormData({ userId: "", password: "" })}>
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
