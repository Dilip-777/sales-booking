import { Inter } from "next/font/google";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { statuses1 } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { AddCompany } from "./addCompany";
import { Company, Zone } from "@/types/globa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../Data-table/data-table-row-actions";
import DeleteModal from "../DeleteModal";
import ImportCustomers from "./importCustomers";

const inter = Inter({ subsets: ["latin"] });

export default function Company() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<any>({
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
  // const [open, setOpen] = useState(false);

  const fetchZones = async () => {
    const res = await axios.get("http://localhost:5000/zone/getZones");
    setZones(res.data.zones);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const res = await axios.get(
      "http://localhost:5000/company/getCompanies?userId=" + session?.user?.id
    );
    setCompanies(res.data.companies);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5000/company/delete/" + company.id);
      fetchCompanies();
    } catch (error) {
      console.log(error);
    }
  };

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => {
          setCompany(row.original);
          setOpen(true);
        }}
        onDelete={() => {
          setCompany(row.original);
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
        <h1 className="text-2xl font-semibold">Manage Company</h1>
        <div className="flex items-center gap-4">
          <ImportCustomers zones={zones} />
          <AddCompany
            zones={zones}
            fetchCompanies={fetchCompanies}
            selectedCompany={company}
            setSelectedCompany={setCompany}
            open={open}
            setOpen={setOpen}
          />
        </div>
      </div>
      <DataTable
        filterName="name"
        data={companies}
        columns={columnsWithActions}
        statuses={statuses1}
        priorities={[]}
      />
      <DeleteModal
        open={openDelete}
        setOpen={(open) => {
          setOpenDelete(open);

          setCompany({
            id: "",
            name: "",
            address: "",
            zoneId: "",
            status: "active",
          });
        }}
        // fetch={fetchCompanies}
        handleDelete={handleDelete}
      />
    </main>
  );
}
