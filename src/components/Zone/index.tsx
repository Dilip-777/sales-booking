import { Inter } from "next/font/google";
import { PauseCircle, PlayCircle, Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { priorities, statuses1 } from "@/components/Data-table/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Status, Zone } from "@/types/globa";
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
import { Spinner } from "../ui/Icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../Data-table/data-table-row-actions";
import DeleteModal from "../DeleteModal";
import { api } from "@/Api";
import { useToast } from "../ui/use-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Zone() {
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [zone, setZone] = useState<Zone>({
    id: "",
    name: "",
    status: "active" as Status,
  });
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { toast } = useToast();

  const fetchZones = async () => {
    setLoading(true);
    const res = await api.get("/zone/getZones");
    setZones(res.data.zones);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!zone) return;
      setFormLoading(true);
      await api.post("/zone/create", {
        ...zone,
      });
      setFormLoading(false);
      fetchZones();
      setOpen(false);
      setZone({
        id: "",
        name: "",
        status: "active" as Status,
      });
    } catch (error) {}
  };

  const handleDelete = async () => {
    try {
      await api.delete("/zone/delete/" + zone.id);
      fetchZones();
      toast({
        variant: "default",
        title: "Success",
        description: "Zone Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error occurred while deleting the zone. Please try again later.",
      });
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => {
          setZone(row.original);
          setOpen(true);
        }}
        onDelete={() => {
          setZone(row.original);
          setOpenDelete(true);
        }}
        row={row}
      />
    ),
  };

  const columnsWithActions = [...columns, actionColumn];

  return (
    <main
      className={`flex flex-col items-center gap-4  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Zone</h1>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            setZone({
              id: "",
              name: "",
              status: "active" as Status,
            });
          }}
        >
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
                    value={zone.name}
                    onChange={(e) =>
                      setZone({
                        ...zone,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Select Status</Label>
                  <Select
                    required
                    value={zone.status}
                    onValueChange={(value) =>
                      setZone({
                        ...zone,
                        status: value as Status,
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
        columns={columnsWithActions}
        statuses={statuses1}
        priorities={priorities}
      />
      <DeleteModal
        open={openDelete}
        setOpen={(open) => {
          setOpenDelete(open);
          setZone({
            id: "",
            name: "",
            status: "active" as Status,
          });
        }}
        handleDelete={handleDelete}
      />
    </main>
  );
}
