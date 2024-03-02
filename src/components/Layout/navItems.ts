import {
  Box,
  FileDown,
  LayoutDashboard,
  LucideIcon,
  Settings,
  UsersRound,
} from "lucide-react";

interface NavItem {
  title: string;
  label?: string | undefined;
  icon: LucideIcon;
  variant: "default" | "ghost";
  href: string;
}

const salesmanItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    variant: "default",
  },
  {
    title: "Book Order",
    href: "/book-order",
    icon: Box,
    variant: "ghost",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    variant: "ghost",
  },
  {
    title: "Record",
    href: "/records",
    icon: FileDown,
    variant: "ghost",
  },
];

const adminItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    variant: "default",
  },
  {
    title: "Items",
    href: "/items",
    icon: Box,
    variant: "ghost",
  },
  {
    title: "Master",
    href: "/master",
    icon: UsersRound,
    variant: "ghost",
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    variant: "ghost",
  },
  {
    title: "Record",
    href: "/records",
    icon: FileDown,
    variant: "ghost",
  },
];

const dispatcherItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    variant: "default",
  },
];

export const getNavItems = (role: string) => {
  switch (role) {
    case "SALESMAN":
      return salesmanItems;
    case "ADMIN":
      return adminItems;
    case "DISPATCHER":
      return dispatcherItems;
    default:
      return [];
  }
};
