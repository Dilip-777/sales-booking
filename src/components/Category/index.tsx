import { Inter } from "next/font/google";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { data, priorities, statuses } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "./column";

const inter = Inter({ subsets: ["latin"] });

export default function Category() {
  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>
        <Button>
          <Plus size={22} className="mr-2" />
          Create Category
        </Button>
      </div>
      <DataTable
        data={data}
        columns={columns}
        statuses={statuses}
        priorities={priorities}
      />
    </main>
  );
}
