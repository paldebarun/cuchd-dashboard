"use client"
 
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IoMenuOutline } from "react-icons/io5";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  
 
import { useRouter } from "next/navigation"
 


import { navdata } from './navdata'



const page = ({params}:{params:{studentId:string}}) => {
    
    const router=useRouter();
    const studentId=params.studentId;
  return (
    <div className="grid grid-cols-2 gap-2">
      
        <Sheet >
          <SheetTrigger asChild>
          <div className=' px-6'>
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
                        <Button onClick={()=>{router.push(`/dashboard/studentRepresentative/${studentId}/${element.link}`)}} variant="link"> {element.tag}</Button>
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
      
    </div>
  )
}

export default page