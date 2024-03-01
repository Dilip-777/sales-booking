import { Inter } from "next/font/google";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { statuses1 } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";

const inter = Inter({ subsets: ["latin"] });

const data = [
  {
    name: "Acme Corporation",
    zone: "Zone 1",
    address: "123 Main St",
    status: "active",
  },
  {
    name: "Widget Industries",
    zone: "Zone 2",
    address: "456 Elm St",
    status: "inactive",
  },
  {
    name: "TechNova Solutions",
    zone: "Zone 3",
    address: "789 Oak St",
    status: "active",
  },
  {
    name: "Global Dynamics",
    zone: "Zone 4",
    address: "101 Pine St",
    status: "active",
  },
  {
    name: "Innovate LLC",
    zone: "Zone 5",
    address: "555 Maple St",
    status: "inactive",
  },
  {
    name: "Phoenix Innovations",
    zone: "Zone 6",
    address: "888 Cedar St",
    status: "active",
  },
  {
    name: "Quantum Enterprises",
    zone: "Zone 7",
    address: "246 Birch St",
    status: "inactive",
  },
  {
    name: "Vanguard Solutions",
    zone: "Zone 8",
    address: "369 Spruce St",
    status: "active",
  },
  {
    name: "Eagle Eye Technologies",
    zone: "Zone 9",
    address: "777 Willow St",
    status: "inactive",
  },
  {
    name: "Pinnacle Systems",
    zone: "Zone 10",
    address: "444 Oak St",
    status: "active",
  },
  {
    name: "Zenith Innovations",
    zone: "Zone 11",
    address: "222 Elm St",
    status: "inactive",
  },
  {
    name: "NexGen Solutions",
    zone: "Zone 12",
    address: "999 Maple St",
    status: "active",
  },
  {
    name: "FutureTech Enterprises",
    zone: "Zone 13",
    address: "123 Pine St",
    status: "active",
  },
  {
    name: "Summit Dynamics",
    zone: "Zone 14",
    address: "456 Oak St",
    status: "inactive",
  },
  {
    name: "Omega Innovations",
    zone: "Zone 15",
    address: "789 Elm St",
    status: "active",
  },
  {
    name: "Apex Solutions",
    zone: "Zone 16",
    address: "101 Maple St",
    status: "active",
  },
  {
    name: "Visionary Ventures",
    zone: "Zone 17",
    address: "555 Cedar St",
    status: "inactive",
  },
  {
    name: "Strategic Solutions",
    zone: "Zone 18",
    address: "888 Birch St",
    status: "active",
  },
  {
    name: "Prime Technologies",
    zone: "Zone 19",
    address: "246 Willow St",
    status: "inactive",
  },
  {
    name: "Bright Ideas Inc.",
    zone: "Zone 20",
    address: "369 Spruce St",
    status: "active",
  },
];

export default function Company() {
  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Company</h1>
        <Button>
          <Plus size={22} className="mr-2" />
          Create Company
        </Button>
      </div>
      <DataTable
        filterName="name"
        data={data}
        columns={columns}
        statuses={statuses1}
        priorities={[]}
      />
    </main>
  );
}
