import { Inter } from "next/font/google";
import { PauseCircle, PlayCircle, Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { priorities, statuses1 } from "@/components/Data-table/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zone } from "@/types/globa";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { columns } from "./columns";
import axios from "axios";
import { Spinner } from "../ui/Icons";

const inter = Inter({ subsets: ["latin"] });

const data = [
  { name: "Zone A", status: "active" },
  { name: "Zone B", status: "inactive" },
  { name: "Zone C", status: "active" },
  { name: "Zone D", status: "active" },
  { name: "Zone E", status: "inactive" },
  { name: "Zone F", status: "active" },
  { name: "Zone G", status: "inactive" },
  { name: "Zone H", status: "active" },
  { name: "Zone I", status: "active" },
  { name: "Zone J", status: "inactive" },
  { name: "Zone K", status: "active" },
  { name: "Zone L", status: "inactive" },
  { name: "Zone M", status: "inactive" },
  { name: "Zone N", status: "active" },
  { name: "Zone O", status: "active" },
  { name: "Zone P", status: "inactive" },
  { name: "Zone Q", status: "active" },
  { name: "Zone R", status: "inactive" },
  { name: "Zone S", status: "active" },
  { name: "Zone T", status: "active" },
];

export default function Zone() {
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [zone, setZone] = useState<string>("");
  const [open, setOpen] = useState(false);

  const fetchZones = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/zone/getZones");
    setZones(res.data.zones);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!zone) return;
      setFormLoading(true);
      await axios.post("http://localhost:5000/zone/create", {
        name: zone,
      });
      setFormLoading(false);
      fetchZones();
      setOpen(false);
      setZone("");
    } catch (error) {}
  };

  useEffect(() => {
    fetchZones();
  }, []);

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Zone</h1>
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={22} className="mr-2" />
              Create Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Zone</DialogTitle>
            </DialogHeader>
            <div className="border border-border "></div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name1">Zone Name</Label>
                  <Input
                    id="name1"
                    placeholder="Enter Zone Name"
                    required
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={formloading || !zone} type="submit">
                  {" "}
                  {formloading && <Spinner />} Submit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        filterName="name"
        data={zones}
        columns={columns}
        statuses={statuses1}
        priorities={priorities}
      />
    </main>
  );
}
