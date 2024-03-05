import { Inter } from "next/font/google";
import { Customer, Item, OrderedItem } from "@/types/globa";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, Spinner } from "@/components/ui/Icons";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { useRouter } from "next/router";
import moment from "moment";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/Api";

const inter = Inter({ subsets: ["latin"] });

interface OrderType {
  id: string;
  customerId: string;
  requiredBy: Date | undefined;
  total: number;
  totalweight: number;
  status: string;
  remarks: string | null;
  vehicleno: string | null;
  issueAmount: number;
  items: {
    itemId: string;
    name: string;
    dispatchedQty: number;
    price: number;
    weight: number;
    unit: string;
    quantity: number;
    amount: number;
  }[];
}

export default function BookOrder() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [order, setOrder] = useState<OrderType>({
    id: "",
    customerId: "",
    requiredBy: undefined as Date | undefined,
    total: 0,
    totalweight: 0,
    status: "",
    remarks: null,
    vehicleno: null,
    issueAmount: 0,
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { orderId, approve, approveDispatch } = router.query;
  const { data: session } = useSession();
  const { toast } = useToast();
  const [orderLoading, setOrderLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get(
        "/customer/getCustomers?userId=" + session?.user?.id
      );
      setCustomers(res.data.customers);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrder = async () => {
    try {
      setOrderLoading(true);
      const res = await api.get("/order/getOrder/" + orderId);

      const customer = customers.find(
        (customer) => customer.id === res.data.order.customerId
      );

      setOrder({
        id: res.data.order.id,
        customerId: customer?.name.toLowerCase() || "",
        requiredBy: new Date(res.data.order.requiredBy),
        total: res.data.order.total,
        totalweight: res.data.order.totalweight,
        status: res.data.order.status,
        remarks: res.data.order.remarks,
        vehicleno: res.data.order.vehicleno,
        issueAmount: res.data.order.issueAmount,

        items: res.data.order.items.map((item: OrderedItem) => ({
          itemId: item.itemId,
          name: item.item.name,
          price: item.item.price,
          weight: item.item.weight,
          unit: item.item.unit,
          quantity: item.quantity,
          amount: item.amount,
          dispatchedQty: item.dispatchedQty,
        })),
      });
    } catch (error) {
      console.log(error);
    }
    setOrderLoading(false);
  };

  useEffect(() => {
    if (orderId && session?.user?.id && customers.length > 0) fetchOrder();
  }, [customers]);

  useEffect(() => {
    if (session?.user?.id) fetchCustomers();
  }, [session]);

  const fetchItems = async () => {
    try {
      const res = await api.get("/item/getItems");
      setItems(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let status = order.status || "ordered";
      if (approve && session?.user?.role === "MANAGER") {
        status = "approved";
      }
      if (approveDispatch && session?.user?.role === "DISPATCHER") {
        status = "completed";
      }

      const customerId = customers.find(
        (customer) => customer.name.toLowerCase() === order.customerId
      )?.id;

      if (!customerId) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please a Customer.",
        });
        return;
      }

      if (order.items.length === 0) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please add items to the order.",
        });
        return;
      }

      if (order.requiredBy === undefined) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please select a date.",
        });
        return;
      }

      setLoading(true);
      const body = {
        customerId: customerId,
        requiredBy: moment(order.requiredBy).format("DD/MM/YYYY"),
        total: parseFloat(order.total.toFixed(2)),
        totalweight: order.totalweight,
        userId: session?.user?.id,
        remarks: order.remarks || null,
        vehicleno: order.vehicleno || null,
        issueAmount: order.issueAmount,
        items: order.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          amount: item.amount,
          dispatchedQty: item.dispatchedQty,
        })),
        status,
      };
      if (orderId) {
        await api.put("/order/update", {
          ...body,
          id: orderId,
        });
      } else {
        await api.post("/order/create", body);
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const total = order.items.reduce((acc, item) => acc + item.amount, 0);
    const totalweight = order.items.reduce((acc, item) => acc + item.weight, 0);

    const issueAmount = order.items.reduce(
      (acc, item) => acc + (item.dispatchedQty || 0) * item.price,
      0
    );

    if (order.issueAmount !== issueAmount)
      setOrder({
        ...order,
        issueAmount,
      });

    if (order.total !== total || order.totalweight !== totalweight)
      setOrder({
        ...order,
        total,
        totalweight,
      });
  }, [order]);

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">
          {orderId ? "Edit" : "Book"} Order
        </h1>
      </div>
      {orderLoading ? (
        <div className=" flex items-center justify-center h-[70vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-8 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Select a Customer</Label>
                <Combobox
                  value={order.customerId}
                  options={customers.map((customer) => ({
                    value: customer.name,
                    label: customer.name,
                  }))}
                  onChange={(value) =>
                    setOrder({
                      ...order,
                      customerId: value,
                    })
                  }
                  placeholder="Select a Customer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requiredBy">Required By</Label>
                <DatePicker
                  value={order.requiredBy}
                  onChange={(value) =>
                    setOrder({
                      ...order,
                      requiredBy: value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2 my-4  lg:w-1/3">
              <Label htmlFor="total">Select Products</Label>
              <Combobox
                options={items.map((item) => ({
                  value: item.name,
                  label: item.name,
                }))}
                placeholder="Select a Product"
                value={""}
                onChange={(value) => {
                  const item = items.find(
                    (item) => item.name.toLowerCase() === value
                  );

                  if (item)
                    setOrder({
                      ...order,
                      items: [
                        ...order.items,
                        {
                          itemId: item.id,
                          name: item.name,
                          price: item.price,
                          weight: item.weight,
                          unit: item.unit,
                          quantity: 0,
                          amount: 0,
                          dispatchedQty: 0,
                        },
                      ],
                    });
                }}
              />
            </div>

            {
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    {session?.user?.role === "DISPATCHER" && (
                      <TableHead>Dispatched Quantity</TableHead>
                    )}
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input className="min-w-[300px]" value={item.name} />
                      </TableCell>
                      <TableCell>
                        <Input value={item.weight} />
                      </TableCell>
                      <TableCell>
                        <Input value={item.unit} />
                      </TableCell>
                      <TableCell>
                        <Input value={item.price} />
                      </TableCell>
                      <TableCell>
                        <Input
                          autoFocus={true}
                          value={item.quantity}
                          onChange={(e) => {
                            if (session?.user?.role !== "DISPATCHER") {
                              const items = order.items.map((i, idx) => {
                                if (idx === index) {
                                  return {
                                    ...i,
                                    quantity: Number(e.target.value),
                                    amount: i.price * Number(e.target.value),
                                  };
                                }
                                return i;
                              });
                              setOrder({
                                ...order,
                                items,
                              });
                            }
                          }}
                          type="number"
                        />
                      </TableCell>
                      {session?.user?.role === "DISPATCHER" && (
                        <TableCell>
                          <Input
                            autoFocus={true}
                            value={item.dispatchedQty}
                            onChange={(e) => {
                              const items = order.items.map((i, idx) => {
                                if (idx === index) {
                                  return {
                                    ...i,
                                    dispatchedQty: Number(e.target.value),
                                  };
                                }
                                return i;
                              });
                              setOrder({
                                ...order,
                                items,
                              });
                            }}
                            type="number"
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Input value={item.amount.toFixed(2)} />
                      </TableCell>
                      <TableCell>
                        <XCircle
                          color="red"
                          className="cursor-pointer"
                          onClick={() => {
                            const items = order.items.filter(
                              (_, i) => i !== index
                            );
                            setOrder({
                              ...order,
                              items,
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="pl-6">Total</TableCell>
                    <TableCell>
                      <Input value={order.totalweight} />
                    </TableCell>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell>
                      <Input value={order.total} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            }

            <div className="grid grid-cols-3 gap-8 py-4">
              <div className="grid gap-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  value={order.remarks || ""}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      remarks: e.target.value,
                    })
                  }
                  placeholder="Enter Remarks"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicleno">Vehicle No</Label>
                <Input
                  value={order.vehicleno || ""}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      vehicleno: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issueAmount">Issue Amount</Label>
                <Input value={order.issueAmount} placeholder="Issue Amount" />
              </div>
            </div>
            {/* </div> */}
            <Button disabled={loading} type="submit">
              {loading && <Spinner />}{" "}
              {approve ? "Approve" : approveDispatch ? "Dispatch" : "Submit"}
            </Button>
          </form>
        </div>
      )}
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

  return {
    props: {},
  };
};
