import { Inter } from "next/font/google";
import { DatePickerWithRange } from "@/components/ui/date-range";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { useSession } from "next-auth/react";
import { Item, OrderedItem } from "@/types/globa";
import { Spinner } from "@/components/ui/Icons";
import moment from "moment";
import { api } from "@/Api";
import { DataTable } from "@/components/Data-table";
import { orderItemColumns } from "@/components/Data-table/columns";
import { statuses } from "@/components/Data-table/data";
import { Combobox } from "@/components/ui/combobox";

const inter = Inter({ subsets: ["latin"] });

export default function Record() {
  const [loading, setLoading] = useState(false);
  const [itemId, setItemId] = useState("");
  const [status, setStatus] = useState("");
  const [orderItems, setOrderItems] = useState<OrderedItem[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    try {
      const res = await api.get("/item/getItems");
      setItems(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const { data: session } = useSession();

  const fetchRecords = async () => {};

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      const fromDate = new Date(date?.from || "");
      fromDate.setDate(fromDate.getDate() - 1);
      const res = await api.get(
        "/order/getOrderItems?&from=" +
          moment(fromDate).format("DD/MM/YYYY") +
          "&to=" +
          moment(date?.to).format("DD/MM/YYYY") +
          "&userId=" +
          session?.user?.id +
          "&itemId=" +
          itemId
      );
      setOrderItems(res.data.items);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderItems();
  }, [date, itemId, session, status]);

  useEffect(() => {
    fetchRecords();
    fetchItems();
  }, [session]);

  console.log(orderItems);

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Orders Report</h1>
      </div>
      <div className="flex justify-between w-full mb-4">
        <div className="w-full text-left grid gap-y-4  gap-x-4  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          <div className="w-full lg:w-2/3">
            <Label htmlFor="name">Item Name</Label>{" "}
            {/* <Select onValueChange={(value) => setItemId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Item" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
            <Combobox
              onChange={(value) => setItemId(value)}
              options={items.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              // label="Item Name"
              value={itemId}
            />
          </div>
          <div className="w-full lg:w-2/3">
            <Label>Status </Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectItem value="">All Orders</SelectItem> */}
                  <SelectItem value="ordered">
                    Pending For Approval Orders
                  </SelectItem>
                  <SelectItem value="approved">Approved Orders</SelectItem>
                  <SelectItem value="completed">Dispatched</SelectItem>
                  <SelectItem value="canceled">Cancelled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-2/3">
            <Label htmlFor="name">Select Date Range</Label>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>
      </div>
      <DataTable
        filterName="name"
        data={orderItems.filter(
          (i) => status === "" || status === i.Order.status
        )}
        columns={orderItemColumns}
        statuses={[]}
        priorities={[]}
      />
    </main>
  );
}
