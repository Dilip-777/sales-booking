import { Inter } from "next/font/google";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { data, priorities, statuses } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/Items/columns";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Items</h1>
        <Button>
          <Plus size={22} className="mr-2" />
          Create Item
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
