import { Inter } from "next/font/google";
import { PauseCircle, PlayCircle, Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { priorities } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";

const inter = Inter({ subsets: ["latin"] });

const data = [
  { name: "Zone A", status: "active" },
  { name: "Zone B", status: "inactive" },
  { name: "Zone C", status: "active" },
  { name: "Zone D", status: "active" },
  { name: "Zone E", status: "inactive" },
  { name: "Zone F", status: "active" },
  { name: "Zone G", status: "inactive" },
  { name: "Zone H", status: "active" },
  { name: "Zone I", status: "active" },
  { name: "Zone J", status: "inactive" },
  { name: "Zone K", status: "active" },
  { name: "Zone L", status: "inactive" },
  { name: "Zone M", status: "inactive" },
  { name: "Zone N", status: "active" },
  { name: "Zone O", status: "active" },
  { name: "Zone P", status: "inactive" },
  { name: "Zone Q", status: "active" },
  { name: "Zone R", status: "inactive" },
  { name: "Zone S", status: "active" },
  { name: "Zone T", status: "active" },
];

const statuses = [
  {
    value: "active",
    label: "Active",
    icon: PlayCircle,
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: PauseCircle,
  },
];

export default function Zone() {
  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Zone</h1>
        <Button>
          <Plus size={22} className="mr-2" />
          Create Zone
        </Button>
      </div>
      <DataTable
        filterName="name"
        data={data}
        columns={columns}
        statuses={statuses}
        priorities={priorities}
      />
    </main>
  );
}
