import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BookX,
  CheckCircleIcon,
  PauseCircle,
  PlayCircle,
  StopCircleIcon,
  TicketCheck,
} from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "ordered",
    label: "Ordered",
    icon: TicketCheck,
  },
  {
    value: "approved",
    label: "Approved",
    icon: StopCircleIcon,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircleIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: BookX,
  },
];

export const statuses1 = [
  {
    value: "active",
    label: "Active",
    icon: PlayCircle,
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: PauseCircle,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

export const role = [ "ADMIN" , "DISPATCHER", "SALESMAN"];  

export const data = [
  {
    id: 1,
    name: "Product A",
    category: "Electronics",
    unit: "pcs",
    rate: 25.99,
    weight: 0.5,
    status: "ordered",
    priority: "low",
  },
  {
    id: 2,
    name: "Product B",
    category: "Clothing",
    unit: "pcs",
    rate: 49.99,
    weight: 0.8,
    status: "in progress",
    priority: "medium",
  },
  {
    id: 3,
    name: "Product C",
    category: "Furniture",
    unit: "pcs",
    rate: 199.99,
    weight: 10,
    status: "done",
    priority: "high",
  },
  {
    id: 4,
    name: "Product D",
    category: "Books",
    unit: "pcs",
    rate: 15.99,
    weight: 0.3,
    status: "cancelled",
    priority: "low",
  },
  {
    id: 5,
    name: "Product E",
    category: "Toys",
    unit: "pcs",
    rate: 35.99,
    weight: 0.6,
    status: "done",
    priority: "medium",
  },
];
