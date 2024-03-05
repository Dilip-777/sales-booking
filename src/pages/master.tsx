import { Inter } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Category from "@/components/Category";
import Zone from "@/components/Zone";
import Customer from "@/components/Customer";
import User from "@/components/User";
import Units from "@/components/Units";
import { DatePickerWithRange } from "@/components/ui/date-range";
import React from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import DeleteModal from "@/components/DeleteModal";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Master() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        "http://localhost:5000/order/delete?from=" +
          date?.from +
          "&to=" +
          date?.to
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="w-full lg:w-2/3">
          <TabsTrigger value="category" className="w-full">
            Category
          </TabsTrigger>
          <TabsTrigger value="zone" className="w-full">
            Zone
          </TabsTrigger>
          <TabsTrigger value="customer" className="w-full">
            Customer
          </TabsTrigger>
          <TabsTrigger value="units" className="w-full">
            Units
          </TabsTrigger>
          <TabsTrigger value="delete" className="w-full">
            Delete
          </TabsTrigger>
        </TabsList>
        <TabsContent value="category">
          <Category />
        </TabsContent>
        <TabsContent value="zone">
          <Zone />
        </TabsContent>
        <TabsContent value="customer">
          <Customer />
        </TabsContent>
        <TabsContent value="units" className="w-full">
          <Units />
        </TabsContent>
        <TabsContent value="delete">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between w-full">
              <h1 className="text-2xl font-semibold">Delete Orders</h1>
            </div>
            <div className="">
              <label className="text-md font-semibold">
                Select a date range
                <DatePickerWithRange date={date} setDate={setDate} />
              </label>
            </div>
            <Button
              variant="destructive"
              className="w-fit"
              onClick={() => setOpen(true)}
            >
              <Trash size={16} className="mr-2" /> Delete
            </Button>
          </div>
          <DeleteModal
            open={open}
            setOpen={setOpen}
            handleDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
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

  if (session.user?.role !== "MANAGER") {
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
