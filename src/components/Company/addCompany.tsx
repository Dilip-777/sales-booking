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

export function AddCompany({
  selectedCompany,
  fetchCompanies,
}: {
  selectedCompany?: Company;
  fetchCompanies: () => void;
}) {
  const [company, setCompany] = useState({
    name: selectedCompany?.name || "",
    zoneId: selectedCompany?.zoneId || "",
    address: selectedCompany?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [open, setOpen] = useState(false);

  const fetchZones = async () => {
    const res = await axios.get("http://localhost:5000/zone/getZones");
    setZones(res.data.zones);
  };

  useEffect(() => {
    fetchZones();
  }, []);

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
        name: "",
        zoneId: "",
        address: "",
      });
      fetchCompanies();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={22} className="mr-2" />
          Create Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedCompany ? "Edit" : "Add"} Company</DialogTitle>
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
