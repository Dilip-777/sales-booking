import { Inter } from "next/font/google";
import { PauseCircle, PlayCircle, Plus } from "lucide-react";

import { DataTable } from "@/components/Data-table";
import { priorities, statuses1 } from "@/components/Data-table/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { columns } from "./column";
import { useEffect, useState } from "react";
import axios from "axios";
import { Categories, Status } from "@/types/globa";
import { Spinner } from "../ui/Icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../Data-table/data-table-row-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const inter = Inter({ subsets: ["latin"] });

export default function Category() {
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [category, setCategory] = useState<Categories>({
    id: "",
    name: "",
    status: "active" as Status,
  });
  const [open, setOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/category/getCategories");
    setCategories(res.data.categories);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!category) return;
      setFormLoading(true);
      await axios.post("http://localhost:5000/category/create", {
        ...category,
      });
      setFormLoading(false);
      fetchCategories();
      setOpen(false);
      setCategory({
        id: "",
        name: "",
        status: "active" as Status,
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const actionColumn: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => {
          setCategory(row.original);
          setOpen(true);
        }}
        row={row}
      />
    ),
  };

  const columnsWithActions = [...columns, actionColumn];

  return (
    <main
      className={`flex flex-col items-center gap-4 overflow-y-auto  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Category</h1>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            setCategory({
              id: "",
              name: "",
              status: "active" as Status,
            });
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus size={22} className="mr-2" />
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="border border-border mt-0"></div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter Category Name"
                    required
                    value={category.name}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Select Status</Label>
                  <Select
                    required
                    value={category.status}
                    onValueChange={(value) =>
                      setCategory({
                        ...category,
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
                <Button disabled={formloading || !category} type="submit">
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
        data={categories}
        columns={columnsWithActions}
        statuses={statuses1}
        priorities={[]}
      />
    </main>
  );
}
