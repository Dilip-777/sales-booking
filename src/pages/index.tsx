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
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "@/types/globa";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/Data-table/data-table-row-actions";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { api } from "@/Api";
import DeleteModal from "@/components/DeleteModal";
import { useToast } from "@/components/ui/use-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [order, setOrder] = useState<Order | undefined>();
  const router = useRouter();
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/getOrders?userId=" + session?.user?.id);
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/order/delete?id=" + order?.id);
      fetchOrders();
      toast({
        variant: "default",
        title: "Success",
        description: "Order Delete Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error occurred while deleting the order. Please try again later.",
      });
    }
    setOrder(undefined);
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={(id) => router.push("/book-order?orderId=" + id)}
        onDelete={() => {
          setOrder(row.original);
          setOpenDelete(true);
        }}
        handleApprove={
          session?.user?.role === "MANAGER" &&
          row.getValue("status") === "ordered"
            ? (id) => router.push("/book-order?orderId=" + id + "&approve=true")
            : undefined
        }
        handleApproveDispatch={
          session?.user?.role === "DISPATCHER" &&
          row.getValue("status") === "approved"
            ? (id) =>
                router.push(
                  "/book-order?orderId=" + id + "&approveDispatch=true"
                )
            : undefined
        }
        // handleDispatch={
        //   session?.user?.role === "MANAGER"
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
          {session?.user?.role === "MANAGER" && (
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
          )}
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
          (column) => column.id !== "user" || session?.user?.role === "MANAGER"
        )}
        statuses={statuses}
        priorities={priorities}
      />
      <DeleteModal
        open={openDelete}
        setOpen={(open) => {
          setOpenDelete(open);
          setOrder(undefined);
        }}
        handleDelete={handleDelete}
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

  if (session.user?.role === "SUPPORT") {
    return {
      redirect: {
        destination: "/users",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
