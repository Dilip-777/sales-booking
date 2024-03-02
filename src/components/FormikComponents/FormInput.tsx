import { useField } from "formik";
import { Input, InputProps } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface Props extends InputProps {
  label: string;
  name: string;
  type: string;
}

export default function FormInput({ label, name, className, ...props }: Props) {
  const [field, meta, helpers] = useField(name);
  const isError = Boolean(meta.touched && meta.error);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        className={cn(className, isError && "border-red-500")}
        {...field}
        {...props}
      />
      {isError && <p className="text-red-500">{meta.error}</p>}
    </div>
  );
}
