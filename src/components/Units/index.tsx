import { Inter } from "next/font/google";
import { Plus } from "lucide-react";
import { Spinner } from "../ui/Icons";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/Data-table";
import { statuses1 } from "@/components/Data-table/data";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../Data-table/data-table-row-actions";
import DeleteModal from "../DeleteModal";
import { Status, Unit } from "@/types/globa";
import { api } from "@/Api";

const inter = Inter({ subsets: ["latin"] });

export default function Units() {
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unit, setUnit] = useState<any>({
    id: "",
    name: "",
    status: "",
  });
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    const res = await api.get("/unit/getUnits");
    setUnits(res.data.units);
    setLoading(false);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!unit) return;
      setFormLoading(true);
      await api.post("/unit/create", {
        ...unit,
      });
      setFormLoading(false);
      fetchUnits();
      setOpen(false);
      setUnit({
        id: "",
        name: "",
        status: "active" as Status,
      });
    } catch (error) {}
  };

  const handleDelete = async () => {
    try {
      await api.delete("/unit/delete/" + unit.id);
      fetchUnits();
    } catch (error) {
      console.log(error);
    }
  };

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => {
          setUnit(row.original);
          setOpen(true);
        }}
        onDelete={() => {
          setUnit(row.original);
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
        <h1 className="text-2xl font-semibold">Manage Units</h1>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            setUnit({
              id: "",
              name: "",
              status: "active" as Status,
            });
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus size={22} className="mr-2" />
              Create Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Unit</DialogTitle>
            </DialogHeader>
            <div className="border border-border "></div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name1">Unit Name</Label>
                  <Input
                    id="name1"
                    placeholder="Enter Zone Name"
                    required
                    value={unit.name}
                    onChange={(e) =>
                      setUnit({
                        ...unit,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Select Status</Label>
                  <Select
                    required
                    value={unit.status}
                    onValueChange={(value) =>
                      setUnit({
                        ...unit,
                        status: value as Status,
                      })
                    }
                  >
                    {/* <FormControl> */}
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
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
                <Button disabled={formloading || !unit} type="submit">
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
        data={units}
        columns={columnsWithActions}
        statuses={statuses1}
        priorities={[]}
      />
      <DeleteModal
        open={openDelete}
        setOpen={(open) => {
          setOpenDelete(open);
          setUnit({
            id: "",
            name: "",
            status: "",
          });
        }}
        handleDelete={handleDelete}
      />
    </main>
  );
}
