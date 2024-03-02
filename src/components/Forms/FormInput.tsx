import { useField } from "formik";
import { Input, InputProps } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface Props extends InputProps {
  label: string;
  name: string;
}

export default function FormInput({ label, name, ...props }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input {...props} />
    </div>
  );
}
