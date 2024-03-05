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
import { Zone } from "@/types/globa";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Spinner } from "../ui/Icons";
import { role } from "../Data-table/data";

export function AddUser({
  selectedUser,
  fetchUsers,
  setSelectedUser,
  open,
  setOpen,
}: {
  selectedUser?: any;
  setSelectedUser?: (user: any) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchUsers: () => void;
}) {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    zoneId: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);

  const fetchZones = async () => {
    const res = await axios.get("http://localhost:5000/zone/getZones");
    setZones(res.data.zones);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setUser(selectedUser);
    }
  }, [selectedUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/register", user);
      setOpen(false);
      setUser({
        id: "",
        username: "",
        email: "",
        zoneId: "",
        role: "",
        password: "",
      });
      fetchUsers();
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

        setUser({
          id: "",
          username: "",
          email: "",
          zoneId: "",
          role: "",
          password: "",
        });
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus size={22} className="mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedUser ? "Edit" : "Add"}User</DialogTitle>
        </DialogHeader>
        <div className="border border-border mt-0"></div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">User Name</Label>
              <Input
                id="username"
                placeholder="Enter User Name"
                required
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            {user.id === "" && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Zone</Label>
              <Select
                required
                value={user.zoneId}
                onValueChange={(value) =>
                  setUser({
                    ...user,
                    zoneId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role </Label>
              <Select
                required
                value={user.role}
                onValueChange={(value) =>
                  setUser({
                    ...user,
                    role: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {role.map((role, index) => (
                    <SelectItem key={index} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
