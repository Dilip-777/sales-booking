import React from "react";
import { useState } from "react"; 
import { getSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Inter } from "next/font/google";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react"; 
import { Eye } from "lucide-react"; 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const inter = Inter({ subsets: ["latin"] });

export default function Account({user}) {
  const [userData, setUserData] = useState(user) 
  const [editMode , setEditMode] = useState(true) ; 
  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
        e.preventDefault(); 
        setOpenUpdate(true); 
    } catch(error){
        console.log(error); 
    } 
  }
  const updateUser = async() =>{
      try{
      const res = await axios.post("http://localhost:5000/auth/register", user);
         alert(res.status) ; 
      }catch(error){
          console.log(error); 
      }
  }; 
  
  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="w-full grid gap-4">
        <div>
        <Card>
          <CardHeader className="flex flex-row items-center w-full justify-between space-y-0 pb-2">
            <CardTitle className="flex w-full justify-between text-center align-middle text-2xl font-semibold flex ">
             <div className="flex text-center align-middle gap-2 w-full"> 
             Profile
             <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                    { !editMode ? (
                        <Button variant="link" onClick={()=>setEditMode(!editMode)}>
                        <Eye size={23} color="black" />
                        </Button>
                    ) : ( 
                        <Button variant="link" onClick={()=>setEditMode(!editMode)}>
                        <Edit size={23} color="black" />
                        </Button>
                    ) 
                    }
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white">
                    { !editMode ? ( 
                        <p className="font-normal">View</p>
                    ): ( 
                    <p className="font-normal" >Edit</p>
                       ) } 
                    </TooltipContent>
                 </Tooltip>
             </TooltipProvider>             
             </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
          {editMode ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 text-lg font-normal">
              <div className="border-t col-span-2  border-gray-300 my-4"></div>
              <div> 
                    <div className = "text-base font-medium"> 
                        Id : 
                    </div> 
                    <div className = "text-sm font-normal" > 
                        {user.id} 
                    </div>
              </div>
              <div> 
                    <div className = "text-base font-medium"> 
                        Name :  
                    </div> 
                    <div className = "text-sm font-normal" > 
                        {user.username} 
                    </div>
              </div>
              <div> 
                    <div className = "text-base font-medium"> 
                        Role :  
                    </div> 
                    <div className = "text-sm font-normal" > 
                        {user.role} 
                    </div>
              </div>
              <div> 
                    <div className = "text-base font-medium"> 
                        Email :  
                    </div> 
                    <div className = "text-sm font-normal" > 
                        {user.email} 
                    </div>
              </div>
              </div>
              ) : (
            <div>
              <div className="border-t col-span-2  border-gray-300 my-4"></div>
              <form onSubmit={handleSubmit}> 
              <div className="grid grid-cols-2 gap-3">
              <div> 
                    <div className = "text-base font-medium"> 
                        Id : 
                    </div> 
                    <div className = "text-sm font-normal" > 
                        {user.id} 
                    </div>
                    </div>
              <div>
              <Label  className= "text-base font-medium" htmlFor="name">Name :</Label>
              <Input
                id="name"
                placeholder="Enter UserName"
                required
                value={user.username}
                onChange={(e) =>
                  setUser({
                    ...user,
                    name: e.target.value,
                  })
                }
               />
               </div>
              <div> 
                    <div className = "text-base font-medium"> 
                        Role : 
                    </div> 
                    <div className = "text-sm font-normal" > 
                        {user.role} 
                    </div>
                </div>
               <div>
              <Label className = "text-base font-medium" htmlFor="name">Email : </Label>
              <Input
                id="name"
                placeholder="Enter UserName"
                required
                value={user.email}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
                />
                </div>
              <div>
              </div>
              <Button className="w-1/3" type="submit" disabled={loading}>Submit</Button>
              </div>
              </form> 
              </div>
              )}
          </CardContent>
        </Card>
        </div>
      <div className="w-full">
        <Card>
          <CardHeader className="flex flex-row items-center w-full justify-between space-y-0 pb-2">
            <CardTitle className="text-center text-2xl font-semibold flex ">
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col flex-wrap gap-1 text-lg font-normal">
              <div className="border-t col-span-2  border-gray-300 my-4"></div>
              <Notify
                name="Orders Notification"
                description="Email me when order is placed"
              />
              <Notify
                name="Despatch Notification"
                description="Email me when order is dispatched"
              />
              <Notify
                name="Deletion Notification"
                description="Email me when someone deletes an item"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      <UpdateConfirmation
        open={openUpdate} 
        setOpen={(open)=>{
            setOpenUpdate(open); 
        }}
        updateUser={updateUser}
       />
    </main>
  );
}

function Notify({ name, description }: { name: string; description: string }) {
  return (
    <div className=" flex items-center w-1/3 space-x-4 rounded-md border p-4">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch />
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (req) => {
  const session = await getSession(req);
  let user = { id: '', email: '', role: '', username: '' };

  if (session) {
    user = session.user;
  }

  return {
    props: {
      user,
    },
  };
};


function UpdateConfirmation({
  open,
  setOpen,
  updateUser,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDelete: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your user data will update. This action can not be undone. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={updateUser}
            color="red"
            className="bg-red-500 hover:bg-red-600"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
