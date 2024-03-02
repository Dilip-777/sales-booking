import { Inter } from "next/font/google";
import { Company, Item, OrderedItem } from "@/types/globa";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const inter = Inter({ subsets: ["latin"] });

interface OrderType {
  id: string;
  companyId: string;
  requiredBy: Date | undefined;
  total: number;
  totalweight: number;
  status: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    weight: number;
    unit: string;
    quantity: number;
    amount: number;
  }[];
}

export default function BookOrder() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [order, setOrder] = useState<OrderType>({
    id: "",
    companyId: "",
    requiredBy: undefined as Date | undefined,
    total: 0,
    totalweight: 0,
    status: "",
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { orderId, approve } = router.query;
  const { data: session } = useSession();

  const fetchCompanies = async () => {
    const res = await axios.get("http://localhost:5000/company/getCompanies");
    setCompanies(res.data.companies);
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/order/getOrder/" + orderId
      );

      setOrder({
        id: res.data.order.id,
        companyId: res.data.order.companyId,
        requiredBy: new Date(res.data.order.requiredBy),
        total: res.data.order.total,
        totalweight: res.data.order.totalweight,
        status: res.data.order.status,
        items: res.data.order.items.map((item: OrderedItem) => ({
          itemId: item.itemId,
          name: item.item.name,
          price: item.item.price,
          weight: item.item.weight,
          unit: item.item.unit,
          quantity: item.quantity,
          amount: item.amount,
        })),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    if (orderId) fetchOrder();
  }, [orderId]);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/item/getItems");
    setItems(res.data.items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let status = order.status || "ordered";
      if (approve) {
        status = "approved";
      }
      setLoading(true);
      const body = {
        companyId: order.companyId,
        requiredBy: moment(order.requiredBy).format("DD/MM/YYYY"),
        total: order.total,
        totalweight: order.totalweight,
        userId: session?.user?.id,
        items: order.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          amount: item.amount,
        })),
        status,
      };
      if (orderId) {
        await axios.put("http://localhost:5000/order/update", {
          ...body,
          id: orderId,
        });
      } else {
        const res = await axios.post(
          "http://localhost:5000/order/create",
          body
        );
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
    console.log("total");

    if (order.total !== total || order.totalweight !== totalweight)
      setOrder({
        ...order,
        total,
        totalweight,
      });
  }, [order]);

  console.log(order);

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">
          {orderId ? "Edit" : "Book"} Order
        </h1>
      </div>
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-8 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Select a Company</Label>
              <Select
                required
                value={order.companyId}
                onValueChange={(value) =>
                  setOrder({
                    ...order,
                    companyId: value,
                  })
                }
              >
                {/* <FormControl> */}
                <SelectTrigger>
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                {/* </FormControl> */}
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="grid gap-2 my-4">
            <Label htmlFor="total">Select Items</Label>
            <Combobox
              options={items.map((item) => ({
                value: item.name,
                label: item.name,
              }))}
              value={""}
              onChange={(value) => {
                const item = items.find(
                  (item) => item.name.toLowerCase() === value
                );
                console.log(item, value, items);

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
                  <TableHead>Item Name</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input value={item.name} />
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
                        }}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input value={item.amount} />
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

          <div className="grid grid-cols-3 gap-2"></div>
          {/* </div> */}
          <Button disabled={loading} type="submit">
            {loading && <Spinner />} {approve ? "Approve" : "Submit"}
          </Button>
        </form>
      </div>
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

  if (session.user?.role !== "SALESMAN") {
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
