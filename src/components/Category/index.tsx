import { Inter } from "next/font/google";
import { PauseCircle, PlayCircle, Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { priorities } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "../Zone/columns";

const inter = Inter({ subsets: ["latin"] });

const data = [
  { name: "Category A", status: "active" },
  { name: "Category B", status: "inactive" },
  { name: "Category C", status: "active" },
  { name: "Category D", status: "active" },
  { name: "Category E", status: "inactive" },
  { name: "Category F", status: "active" },
  { name: "Category G", status: "inactive" },
  { name: "Category H", status: "active" },
  { name: "Category I", status: "active" },
  { name: "Category J", status: "inactive" },
  { name: "Category K", status: "active" },
  { name: "Category L", status: "inactive" },
  { name: "Category M", status: "inactive" },
  { name: "Category N", status: "active" },
  { name: "Category O", status: "active" },
  { name: "Category P", status: "inactive" },
  { name: "Category Q", status: "active" },
  { name: "Category R", status: "inactive" },
  { name: "Category S", status: "active" },
  { name: "Category T", status: "active" },
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

export default function Category() {
  return (
    <main
      className={`flex flex-col items-center gap-4 overflow-y-auto  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Category</h1>
        <Button>
          <Plus size={22} className="mr-2" />
          Create Category
        </Button>
      </div>
      <DataTable
        filterName="name"
        data={data}
        columns={columns}
        statuses={statuses}
        priorities={[]}
      />
    </main>
  );
}
