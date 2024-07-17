"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertModal } from "@/components/alert-modal"
import { useEffect, useState } from "react"
import { deleteFacultyAdvisor, fetchFacultyAdvisorById, updateFacultyAdvisor } from "@/lib/actions/faculty.action"
import mongoose from "mongoose"
import toast from "react-hot-toast"

export default function Page({ params }: { params: { facultiAdvId: string, studentId: string } }) {

    interface IFacultyAdv {
        facultyAdvId: string;
        facultyAdvUid: string;
        facultyAdvName: string;
    }

    const router = useRouter();
    const facultiadvid = params.facultiAdvId;
    const studentId = params.studentId;

    const [formData, setFormData] = useState<IFacultyAdv>({
        facultyAdvId: facultiadvid,
        facultyAdvUid: "",
        facultyAdvName: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            const toastId = toast.loading("loading data...");
            try {
                const facultyAdvisor = await fetchFacultyAdvisorById(new mongoose.Types.ObjectId(facultiadvid));
                console.log("this is fetch : ", facultyAdvisor);
                if (facultyAdvisor) {
                    const jsonFaculty = JSON.parse(facultyAdvisor);
                    setFormData({
                        facultyAdvId: facultiadvid,
                        facultyAdvUid: jsonFaculty.facultyAdvUid,
                        facultyAdvName: jsonFaculty.facultyAdvName
                    });
                }
            } catch (error) {
                console.log("error: ", error);
            } finally {
                toast.dismiss(toastId);
            }
        }
        fetchData();
    }, [facultiadvid]);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        const toastId = toast.loading("Processing...");
        try {
            setLoading(true);
            await deleteFacultyAdvisor(new mongoose.Types.ObjectId(facultiadvid));
            toast.success("Deleted successfully");
            router.push(`/dashboard/studentRepresentative/${studentId}/facultyAdvisor`);
        } catch (error: any) {
            console.log("Error: ", error);
            toast.error("Error occurred! Try again");
        } finally {
            setLoading(false);
            setOpen(false);
            toast.dismiss(toastId);
        }
    };

    const update = async () => {
        const toastId = toast.loading("updating...");

        try {
            const updateResponse = await updateFacultyAdvisor(formData);
            console.log("update response : ", updateResponse);
            toast.success("updated successfully");
            router.push(`/dashboard/studentRepresentative/${studentId}/facultyAdvisor`);
        } catch (error) {
            console.log("there has been an error : ", error);
            toast.error("error!try again");
        } finally {
            toast.dismiss(toastId);
        }
    }

    return (
        <div className="w-screen flex items-center justify-center">
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <Card className="w-full max-w-md mx-auto p-6 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Faculty Advisor Details</CardTitle>
                    <CardDescription>Update your Faculty Advisor information or delete your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your name"
                            value={formData.facultyAdvName}
                            onChange={(e) => setFormData({ ...formData, facultyAdvName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="uid">UID</Label>
                        <Input
                            id="uid"
                            placeholder="Enter your UID"
                            value={formData.facultyAdvUid}
                            onChange={(e) => setFormData({ ...formData, facultyAdvUid: e.target.value })}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                    <Button variant="destructive" onClick={() => setOpen(true)}>Delete Account</Button>
                    <Button onClick={update}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
