export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  zoneId?: string | null;
  role: Role;
  zone?: Zone | null;
  orders?: Order[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  unit: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderedItem?: OrderedItem[];
}

export interface Unit {
  id: string;
  name: string;
  status: Status;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  zoneId: string;
  status: Status;
  orders?: Order[];
  zone: Zone;
}

export interface Categories {
  id: string;
  name: string;
  status: Status;
}

export interface Zone {
  id: string;
  name: string;
  status: Status;
  users?: User[];
  customers?: Customer[];
}

export interface OrderedItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  amount: number;
  dispatchedQty: number;
  createdAt: Date;
  updatedAt: Date;
  item: Item;
  Order: Order;
}

export interface Order {
  id: string;
  userId: string;
  customerId: string;
  total: number;
  requiredBy: Date;
  status: OrderStatus;
  remarks: string | null;
  vehicleno: string | null;
  issueAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderedItem[];
  user: User;
  customer: Customer;
}

export enum Status {
  active = "active",
  inactive = "inactive",
}

export enum OrderStatus {
  ordered = "ordered",
  approved = "approved",
  completed = "completed",
  canceled = "canceled",
}

export enum Role {
  SALESMAN = "SALESMAN",
  MANAGER = "MANAGER",
  DISPATCHER = "DISPATCHER",
  SUPPORT = "SUPPORT",
}
