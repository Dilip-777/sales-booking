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
import { Categories, Company, Item, Unit, Zone } from "@/types/globa";
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

export function AddItem({
  selectedItem,
  setSelectItem,
  fetchItems,
}: {
  selectedItem?: Item;
  setSelectItem?: (item: Item) => void;
  fetchItems: () => void;
}) {
  const [item, setItem] = useState({
    name: selectedItem?.name || "",
    description: selectedItem?.description || "",
    price: selectedItem?.price || undefined,
    weight: selectedItem?.weight || undefined,
    unit: selectedItem?.unit || "",
    category: selectedItem?.category || "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [open, setOpen] = useState(false);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/category/getCategories");
    setCategories(res.data.categories);
  };

  const fetchUnits = async () => {
    const res = await axios.get("http://localhost:5000/unit/getUnits");
    setUnits(res.data.units);
  };

  useEffect(() => {
    fetchCategories();
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (item.price === undefined || item.weight === undefined) return;
      setLoading(true);
      const res = await axios.post("http://localhost:5000/item/create", item);
      setOpen(false);
      setItem({
        name: "",
        description: "",
        price: undefined,
        weight: undefined,
        unit: "",
        category: "",
      });
      fetchItems();
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
        setItem({
          name: selectedItem?.name || "",
          description: selectedItem?.description || "",
          price: selectedItem?.price || undefined,
          weight: selectedItem?.weight || undefined,
          unit: selectedItem?.unit || "",
          category: selectedItem?.category || "",
        });
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus size={22} className="mr-2" />
          Create Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedItem ? "Edit" : "Add"} Item</DialogTitle>
        </DialogHeader>
        <div className="border border-border mt-0"></div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="Enter Item Name"
                required
                value={item.name}
                onChange={(e) =>
                  setItem({
                    ...item,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Select a Category</Label>
              <Select
                required
                value={item.category}
                onValueChange={(value) =>
                  setItem({
                    ...item,
                    category: value,
                  })
                }
              >
                {/* <FormControl> */}
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                {/* </FormControl> */}
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Item Weight</Label>
              <Input
                id="weight"
                placeholder="Enter Item Weight"
                required
                type="number"
                value={item.weight}
                onChange={(e) =>
                  setItem({
                    ...item,
                    weight: Number(e.target.value || null),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Select a Unit</Label>
              <Select
                required
                value={item.unit}
                onValueChange={(value) =>
                  setItem({
                    ...item,
                    unit: value,
                  })
                }
              >
                {/* <FormControl> */}
                <SelectTrigger>
                  <SelectValue placeholder="Select a Unit" />
                </SelectTrigger>
                {/* </FormControl> */}
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Item Price</Label>
              <Input
                id="price"
                placeholder="Enter Item price"
                required
                type="number"
                value={item.price}
                onChange={(e) =>
                  setItem({
                    ...item,
                    price: Number(e.target.value || null),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Item Description</Label>
              <Textarea
                placeholder="Enter Item Description"
                value={item.description}
                onChange={(e) =>
                  setItem({
                    ...item,
                    description: e.target.value,
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
