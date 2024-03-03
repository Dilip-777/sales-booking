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
import { Company, Zone } from "@/types/globa";
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

export function AddCompany({
  selectedCompany,
  fetchCompanies,
  setSelectedCompany,
  open,
  setOpen,
  zones,
}: {
  selectedCompany?: Company;
  fetchCompanies: () => void;
  setSelectedCompany?: (company: Company) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  zones: Zone[];
}) {
  const [company, setCompany] = useState({
    id: selectedCompany?.id || "",
    name: selectedCompany?.name || "",
    zoneId: selectedCompany?.zoneId || "",
    address: selectedCompany?.address || "",
    status: selectedCompany?.status || "active",
  });
  const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    setCompany({
      id: selectedCompany?.id || "",
      name: selectedCompany?.name || "",
      zoneId: selectedCompany?.zoneId || "",
      address: selectedCompany?.address || "",
      status: selectedCompany?.status || "active",
    });
  }, [selectedCompany]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/company/create",
        company
      );
      setOpen(false);
      setCompany({
        id: "",
        name: "",
        zoneId: "",
        address: "",
        status: "active",
      });
      fetchCompanies();
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
        setCompany({
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
            Create Company
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedCompany?.id ? "Edit" : "Add"} Company
          </DialogTitle>
        </DialogHeader>
        <div className="border border-border mt-0"></div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                placeholder="Enter Company Name"
                required
                value={company.name}
                onChange={(e) =>
                  setCompany({
                    ...company,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Select a Zone</Label>
              <Select
                required
                value={company.zoneId}
                onValueChange={(value) =>
                  setCompany({
                    ...company,
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
                value={company.status}
                onValueChange={(value) =>
                  setCompany({
                    ...company,
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
              <Label htmlFor="address">Company Address</Label>
              <Textarea
                required
                value={company.address}
                onChange={(e) =>
                  setCompany({
                    ...company,
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
