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

const inter = Inter({ subsets: ["latin"] });

export default function Record() {
  const [loading, setLoading] = useState(false);
  const [itemId, setItemId] = useState("");
  const [status, setStatus] = useState("");
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

  console.log(itemId, "itemId");

  const { data: session } = useSession();

  const fetchRecords = async () => {};

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fromDate = new Date(date?.from || "");
      fromDate.setDate(fromDate.getDate() - 1);
      const res = await api.get(
        "/order/getOrderItems?&from=" +
          fromDate +
          "&to=" +
          date?.to +
          "&userId=" +
          session?.user?.id +
          "&itemId=" +
          itemId
      );
      const tableRows = [
        [
          "Order Id",
          "User",
          "Product Name",
          "Quantity",
          "Price",
          "Total",
          "Status",
          "Order Date",
        ],
      ];

      try {
        res.data.items.forEach((item: OrderedItem) => {
          if (status === "" || status === item.Order.status)
            tableRows.push([
              item.Order.id,
              item.Order.user.username,
              item.item.name,
              item.quantity.toString(),
              item.item.price.toString(),
              item.amount.toString(),
              item.Order.status,
              moment(item.createdAt).format("DD/MM/YYYY"),
            ]);
        });

        const csvContent = `${tableRows
          .map((row) => row.join(","))
          .join("\n")}`;

        // Download CSV file
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "OrderItems.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
    fetchItems();
  }, [session]);

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage User</h1>
      </div>
      <div className="flex justify-between w-full">
        <div className="w-full text-left grid gap-y-4  gap-x-4 grid-cols-2 ">
          <div className="w-full lg:w-2/3">
            <Label htmlFor="name">Item Name</Label>{" "}
            <Select onValueChange={(value) => setItemId(value)}>
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
            </Select>
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
          <div className="w-full col-span-2">
            <Button disabled={loading} onClick={handleSubmit}>
              {" "}
              {loading && <Spinner />} Submit{" "}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
