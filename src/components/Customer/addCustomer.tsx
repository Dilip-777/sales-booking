import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer, Zone } from "@/types/globa";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Spinner } from "../ui/Icons";
import ImportCustomers from "./importCustomers";
import { api } from "@/Api";

export function AddCustomer({
  selectedCustomer,
  fetchCustomers,
  setSelectedCustomer,
  open,
  setOpen,
  zones,
}: {
  selectedCustomer?: Customer;
  fetchCustomers: () => void;
  setSelectedCustomer?: (customer: Customer) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  zones: Zone[];
}) {
  const [customer, setCustomer] = useState({
    id: selectedCustomer?.id || "",
    name: selectedCustomer?.name || "",
    zoneId: selectedCustomer?.zoneId || "",
    address: selectedCustomer?.address || "",
    status: selectedCustomer?.status || "active",
  });
  const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    setCustomer({
      id: selectedCustomer?.id || "",
      name: selectedCustomer?.name || "",
      zoneId: selectedCustomer?.zoneId || "",
      address: selectedCustomer?.address || "",
      status: selectedCustomer?.status || "active",
    });
  }, [selectedCustomer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await api.post("/customer/create", customer);
      setOpen(false);
      setCustomer({
        id: "",
        name: "",
        zoneId: "",
        address: "",
        status: "active",
      });
      fetchCustomers();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setCustomer({
          id: "",
          name: "",
          zoneId: "",
          address: "",
          status: "active",
        });
      }}
    >
      <DialogTrigger asChild>
        <div className="flex items-center justify-between">
          <Button>
            <Plus size={22} className="mr-2" />
            Create Customer
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedCustomer?.id ? "Edit" : "Add"} Customer
          </DialogTitle>
        </DialogHeader>
        <div className="border border-border mt-0"></div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                placeholder="Enter Customer Name"
                required
                value={customer.name}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Select a Zone</Label>
              <Select
                required
                value={customer.zoneId}
                onValueChange={(value) =>
                  setCustomer({
                    ...customer,
                    zoneId: value,
                  })
                }
              >
                {/* <FormControl> */}
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                {/* </FormControl> */}
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="Zone A">Zone A</SelectItem>
                  <SelectItem value="Zone B">Zone B</SelectItem>
                  <SelectItem value="Zone C">Zone C</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Select Status</Label>
              <Select
                required
                value={customer.status}
                onValueChange={(value) =>
                  setCustomer({
                    ...customer,
                    status: value,
                  })
                }
              >
                {/* <FormControl> */}
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                {/* </FormControl> */}
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Customer Address</Label>
              <Textarea
                required
                value={customer.address}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    address: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading} type="submit">
              {loading && <Spinner />} Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
