"use client"
 
import { Button } from "@/components/ui/button"
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
  
 
import { useRouter } from "next/navigation"
 


import { navdata } from './navdata'



const page = ({params}:{params:{facultiAdvisorId:string}}) => {
  
    const router=useRouter();
    const facultyAdvisorId=params.facultiAdvisorId;

  return (
    <div className="grid grid-cols-2 gap-2">
      
        <Sheet >
          <SheetTrigger asChild>
            <Button variant="outline" size={"sm"}>{"Menu"}</Button>
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
                        <Button onClick={()=>{router.push(`/dashboard/facultyAdvisor/${facultyAdvisorId}/${element.link}`)}} variant="link"> {element.tag}</Button>
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