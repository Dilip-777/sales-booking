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
import { Categories } from "@/types/globa";
import { Spinner } from "../ui/Icons";

const inter = Inter({ subsets: ["latin"] });

const data = [
  { name: "Category A", status: "active" },
  { name: "Category B", status: "inactive" },
  { name: "Category C", status: "active" },
  { name: "Category D", status: "active" },
  { name: "Category E", status: "inactive" },
  { name: "Category F", status: "active" },
  { name: "Category G", status: "inactive" },
  { name: "Category H", status: "active" },
  { name: "Category I", status: "active" },
  { name: "Category J", status: "inactive" },
  { name: "Category K", status: "active" },
  { name: "Category L", status: "inactive" },
  { name: "Category M", status: "inactive" },
  { name: "Category N", status: "active" },
  { name: "Category O", status: "active" },
  { name: "Category P", status: "inactive" },
  { name: "Category Q", status: "active" },
  { name: "Category R", status: "inactive" },
  { name: "Category S", status: "active" },
  { name: "Category T", status: "active" },
];

export default function Category() {
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [category, setCategory] = useState<string>("");
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
        name: category,
      });
      setFormLoading(false);
      fetchCategories();
      setOpen(false);
      setCategory("");
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <main
      className={`flex flex-col items-center gap-4 overflow-y-auto  p-4 ${inter.className}`}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold">Manage Category</h1>
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
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
        columns={columns}
        statuses={statuses1}
        priorities={[]}
      />
    </main>
  );
}
