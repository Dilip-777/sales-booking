import { Inter } from "next/font/google";

import { DataTable } from "@/components/Data-table";
import { priorities, statuses1 } from "@/components/Data-table/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/globa";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/Data-table/data-table-row-actions";
import { columns } from "@/components/User/columns";
import { AddUser } from "@/components/User/addUser";
import DeleteModal from "@/components/DeleteModal";
import { LoadingSpinner } from "@/components/ui/Icons";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { api } from "@/Api";
import { useToast } from "@/components/ui/use-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Users() {
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
  const [openDelete, setOpenDelete] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/get");
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete("/user/delete/" + user.id);
      fetchUsers();
      toast({
        variant: "default",
        title: "Success",
        description: "User Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error occurred while deleting the user. Please try again later.",
      });
    }
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
        onDelete={() => {
          setUser(row.original);
          setOpenDelete(true);
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
      {loading ? (
        <div className="flex justify-center items-center w-full h-96">
          <LoadingSpinner />
        </div>
      ) : (
        <DataTable
          filterName="username"
          data={users}
          columns={columnsWithActions}
          statuses={[]}
          priorities={[]}
        />
      )}
      <DeleteModal
        open={openDelete}
        setOpen={(open) => {
          setOpenDelete(open);
          setUser({
            id: "",
            name: "",
            email: "",
            role: "",
            zoneId: "",
            password: "",
          });
        }}
        handleDelete={handleDelete}
      />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const session = await getSession(req);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  if (session.user?.role !== "SUPPORT") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
