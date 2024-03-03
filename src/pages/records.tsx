"use client" 

import { Inter } from "next/font/google";
import { PauseCircle, PlayCircle, Plus } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { Trash } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Spinner } from "../ui/Icons";
import { CreateRecord } from "@/components/Record/createRecord";  

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"; 
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addDays } from "date-fns";

const inter = Inter({ subsets: ["latin"] })

export default function Record() {
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [itemName, setItemName] = useState("") ; 
  const [status, setStatus] = useState(); 
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });

  const fetchRecords= async () => {
    setLoading(true);
    //const res = await axios.get("http://localhost:5000/user/get");
    //setRecords(res.data.users);
    setLoading(false);
  };

  const handleSubmit= async ()=>{
      alert(status); 
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
      <main className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}>
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage User</h1>
      </div>
      <div className="flex justify-between w-full">
        <form className = "w-full" onSubmit= {handleSubmit}> 
            <div className = "w-full text-left grid gap-y-4  gap-x-4 grid-cols-2 ">
                <div className = "w-full">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter Category Name"
                    required
                    value={itemName} 
                    onChange={ (e) => setItemName(e.target.value)} 
                  />
                </div>
                <div className= "w-full"> 
                <Label >Status </Label>
                <Select className="w-full">
                      <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status of Order" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectGroup>
                      <SelectItem value="allOrders">All Orders</SelectItem>
                      <SelectItem value="approvedOrders">Approved Orders</SelectItem>
                      <SelectItem value="dispatched">Dispatched </SelectItem>
                      </SelectGroup>
                      </SelectContent>
                </Select>            
                </div>
                <div className="flex flex-col gap-4 p-4">
                     <div className="flex justify-between w-full">
                     <h1 className="text-2xl font-normal">View Orders</h1>
                     </div>
                     <div className="">
                     <label className="text-md font-normal">
                     Select a date range
                     <DatePickerWithRange />
                     </label>
                     </div>
                </div>
                <div>
                </div>
                <div className="w-full col-span-2">
                    <Button className="w-full flex font-semibold text-lg" > Submit </Button>
                </div>
            </div>
        </form> 
      </div>
    </main>
  );
}


