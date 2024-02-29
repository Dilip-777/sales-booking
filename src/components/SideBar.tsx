import { useState } from "react";
import { Nav } from "./ui/nav";

type Props = {};

import {
  ShoppingCart,
  LayoutDashboard,
  UsersRound,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsed1, setIsCollapsed1] = useState(false);

  function toggleSidebar() {
    setIsCollapsed1(!isCollapsed1);
    if (!isCollapsed1) {
      setTimeout(() => {
        setIsCollapsed(!isCollapsed);
      }, 1000);
    } else {
      setIsCollapsed(!isCollapsed);
    }
    // setTimeout(() => {
    //   setIsCollapsed(!isCollapsed);
    // }, 1000);
  }

  return (
    <div
      className={cn(
        "relative max-w-[17%]  border-r px-3  pb-10 pt-24 transition-all duration-1000 ease-in-out bg-white ",
        !isCollapsed1 ? "w-full" : "w-16"
      )}
    >
      {
        <div className="absolute right-[-20px] top-7 z-40">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className=" rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      }
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Users",
            href: "/users",
            icon: UsersRound,
            variant: "ghost",
          },
          {
            title: "Orders",
            href: "/orders",
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Settings",
            href: "/settings",
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
