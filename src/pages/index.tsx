import { Inter } from "next/font/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/Data-table";
import { data, priorities, statuses } from "@/components/Data-table/data";
import { columns } from "@/components/Data-table/columns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "@/types/globa";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/Data-table/data-table-row-actions";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  const fetchOrders = async () => {
    const res = await axios.get(
      "http://localhost:5000/order/getOrders?userId=" +
        (session?.user?.role === "SALESMAN" ? session?.user?.id : "")
    );
    setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={(id) => router.push("/book-order?orderId=" + id)}
        handleApprove={
          session?.user?.role === "ADMIN"
            ? (id) => router.push("/book-order?orderId=" + id + "&approve=true")
            : undefined
        }
        // handleDispatch={
        //   session?.user?.role === "ADMIN"
        //     ? (id) => router.push("/book-order?orderId=" + id + "&dispatch=true")
        //     : undefined
        // }
        row={row}
      />
    ),
  };

  // columns.push(actionColumn);

  const columnsWithActions = [...columns, actionColumn];

  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      {session?.user?.role !== "SALESMAN" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "ordered").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Dispatches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "approved").length}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="flex justify-between w-full mt-2">
        <h1 className="text-2xl font-semibold">Manage Orders</h1>
      </div>
      <DataTable
        filterName="name"
        data={orders}
        columns={columnsWithActions.filter(
          (column) => column.id !== "user" || session?.user?.role === "ADMIN"
        )}
        statuses={statuses}
        priorities={priorities}
      />
    </main>
  );
}
