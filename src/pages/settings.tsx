import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Inter } from "next/font/google";
import { Switch } from "@/components/ui/switch";

const inter = Inter({ subsets: ["latin"] });

export default function Account() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="w-full">
        <Card>
          <CardHeader className="flex flex-row items-center w-full justify-between space-y-0 pb-2">
            <CardTitle className="text-center text-2xl font-semibold flex ">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 grid-rows-4 gap-4 text-lg font-normal">
              <div className="border-t col-span-2  border-gray-300 my-4"></div>
              <div>Full name : </div>
              <div>User name : </div>
              <div>Email : </div>
              <div>Gender : </div>
              <div>Phone : </div>
              <div>Group : </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <CardHeader className="flex flex-row items-center w-full justify-between space-y-0 pb-2">
            <CardTitle className="text-center text-2xl font-semibold flex ">
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col flex-wrap gap-1 text-lg font-normal">
              <div className="border-t col-span-2  border-gray-300 my-4"></div>
              <Notify
                name="Orders Notification"
                description="Email me when order is placed"
              />
              <Notify
                name="Despatch Notification"
                description="Email me when order is dispatched"
              />
              <Notify
                name="Deletion Notification"
                description="Email me when someone deletes an item"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Notify({ name, description }: { name: string; description: string }) {
  return (
    <div className=" flex items-center w-1/3 space-x-4 rounded-md border p-4">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch />
    </div>
  );
}
