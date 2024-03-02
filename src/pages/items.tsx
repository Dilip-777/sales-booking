import { Inter } from "next/font/google";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { data, priorities, statuses } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/Items/columns";
import { AddItem } from "@/components/Items/addItems";
import { Item } from "@/types/globa";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/item/getItems");
    setItems(res.data.items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Items</h1>
        {/* <Button>
          <Plus size={22} className="mr-2" />
          Create Item
        </Button> */}
        <AddItem fetchItems={fetchItems} />
      </div>
      <DataTable
        filterName="name"
        data={items}
        columns={columns}
        statuses={statuses}
        priorities={priorities}
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

  if (session.user?.role !== "ADMIN") {
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
