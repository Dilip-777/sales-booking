import { Inter } from "next/font/google";

import { DataTable } from "@/components/Data-table";
import { priorities, statuses1 } from "@/components/Data-table/data";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import axios from "axios";
import { AddUser } from "./addUser";
import { User } from "@/types/globa";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../Data-table/data-table-row-actions";

const inter = Inter({ subsets: ["latin"] });

const data = [
  {
    name: "user1",
    email: "user@gmail.com",
    role: "dispatcher",
    zone: "Zone A",
  },
];

export default function User() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<any>({
    id: "",
    name: "",
    email: "",
    role: "dispatcher",
    zoneId: "",
    password: "",
  });
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/user/get");
    setUsers(res.data.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => {
          setUser(row.original);
          setOpen(true);
        }}
        row={row}
      />
    ),
  };

  const columnsWithActions = [...columns, actionColumn];

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage User</h1>
        <AddUser
          fetchUsers={fetchUsers}
          selectedUser={user}
          setSelectedUser={setUser}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <DataTable
        filterName="name"
        data={users}
        columns={columnsWithActions}
        statuses={statuses1}
        priorities={priorities}
      />
    </main>
  );
}
