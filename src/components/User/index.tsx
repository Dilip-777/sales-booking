import { Inter } from "next/font/google";
import { PauseCircle, PlayCircle, Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { priorities, statuses1 } from "@/components/Data-table/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zone } from "@/types/globa";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { columns } from "./columns";
import axios from "axios";
import { Spinner } from "../ui/Icons";
import {AddUser} from "./addUser";  

const inter = Inter({ subsets: ["latin"] });

const data = [
  { name: "user1", email:"user@gmail.com", role:"dispatcher", zone:"Zone A" },
];

export default function User() {
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<string>("");

  const fetchUsers= async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/user/get");
    setUsers(res.data.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage User</h1>
        <AddUser fetchUsers={fetchUsers}/>
      </div>
      <DataTable
        filterName="name"
        data={users}
        columns={columns}
        statuses={statuses1}
        priorities={priorities}
      />
    </main>
  );
}

