"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";

export function DatePicker({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (date: Date | undefined) => void;
}) {
  const [date, setDate] = React.useState<Date>();

  console.log(value, "value");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal ",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            moment(value, "DD/MM/YYYY").format("DD/MM/YYYY")
          ) : (
            <span>Pick Dispatch Date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={moment(value, "DD/MM/YYYY").toDate()}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
