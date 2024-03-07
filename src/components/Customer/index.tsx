import { Inter } from "next/font/google";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { statuses1 } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { AddCustomer } from "./addCustomer";
import { Customer, Zone } from "@/types/globa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../Data-table/data-table-row-actions";
import DeleteModal from "../DeleteModal";
import ImportCustomers from "./importCustomers";
import { api } from "@/Api";
import { useToast } from "../ui/use-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Customer() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<any>({
    id: "",
    name: "",
    address: "",
    zoneId: "",
    status: "active",
  });
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const { toast } = useToast();
  // const [open, setOpen] = useState(false);

  const fetchZones = async () => {
    try {
      const res = await api.get("/zone/getZones");
      setZones(res.data.zones);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        "/customer/getCustomers?userId=" + session?.user?.id
      );
      setCustomers(res.data.customers);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete("/customer/delete/" + customer.id);
      fetchCustomers();
      toast({
        variant: "default",
        title: "Success",
        description: "Customer Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error occurred while deleting the customer. Please try again later.",
      });
    }
  };

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => {
          setCustomer(row.original);
          setOpen(true);
        }}
        onDelete={() => {
          setCustomer(row.original);
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
        <h1 className="text-2xl font-semibold">Manage Customer</h1>
        <div className="flex items-center gap-4">
          <ImportCustomers zones={zones} />
          <AddCustomer
            zones={zones}
            fetchCustomers={fetchCustomers}
            selectedCustomer={customer}
            setSelectedCustomer={setCustomer}
            open={open}
            setOpen={setOpen}
          />
        </div>
      </div>
      <DataTable
        filterName="name"
        data={customers}
        columns={columnsWithActions}
        statuses={statuses1}
        priorities={[]}
      />
      <DeleteModal
        open={openDelete}
        setOpen={(open) => {
          setOpenDelete(open);

          setCustomer({
            id: "",
            name: "",
            address: "",
            zoneId: "",
            status: "active",
          });
        }}
        // fetch={fetchCustomers}
        handleDelete={handleDelete}
      />
    </main>
  );
}
