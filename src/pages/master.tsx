import { Inter } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Category from "@/components/Category";
import Zone from "@/components/Zone";
import Company from "@/components/Company";
import User from "@/components/User"; 
import { DatePickerWithRange } from "@/components/ui/date-range";
import React from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Master() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  });
  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="w-1/2">
          <TabsTrigger value="category" className="w-full">
            Category
          </TabsTrigger>
          <TabsTrigger value="zone" className="w-full">
            Zone
          </TabsTrigger>
          <TabsTrigger value="company" className="w-full">
            Company
          </TabsTrigger>
          <TabsTrigger value="user" className="w-full">
            User 
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
        <TabsContent value="company">
          <Company />
        </TabsContent>
        <TabsContent value = "user" className="w-full">
          <User/>
        </TabsContent>
        <TabsContent value="delete">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between w-full">
              <h1 className="text-2xl font-semibold">Delete Orders</h1>
            </div>
            <div className="">
              <label className="text-md font-semibold">
                Select a date range
                <DatePickerWithRange />
              </label>
            </div>
            <Button variant="destructive" className="w-fit">
              <Trash size={16} className="mr-2" /> Delete
            </Button>
          </div>
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
