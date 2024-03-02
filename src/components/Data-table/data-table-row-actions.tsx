import {
  CheckCircle,
  Delete,
  DeleteIcon,
  Edit,
  MoreVertical,
  Trash,
} from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { labels } from "./data";
// import { taskSchema } from "../data/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  handleApprove?: (id: string) => void;
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  handleApprove,
}: DataTableRowActionsProps<TData>) {
  //   const task = taskSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {handleApprove && (
          <DropdownMenuItem onClick={() => handleApprove(row.getValue("id"))}>
            <CheckCircle size={14} className="mr-2" /> Approve
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            if (onEdit) onEdit(row.getValue("id"));
          }}
        >
          {" "}
          <Edit size={14} className="mr-2" /> Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            if (onDelete) onDelete(row.getValue("id"));
          }}
        >
          <Trash size={14} className="mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
