import { Categories, Zone } from "@/types/globa";
import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Spinner } from "../ui/Icons";
import { Import } from "lucide-react";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

function ImportProducts({ fetchItems }: { fetchItems: () => void }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  const handleFile = (e: any) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        console.log(e.target?.result);

        const workbook = XLSX.read(e.target?.result, { type: "buffer" });

        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(data);
        importing(data);
      };
      setKey(key + 1);
    }
  };

  const handleClick = (message: string, error: boolean) => {
    toast({
      variant: error ? "destructive" : "default",
      title: error ? "Uh oh! Something went wrong." : "Success",
      description: message,
    });
  };

  const importing = async (data: any) => {
    console.log(data);

    const keys: string[] = [];

    const indices: number[] = [];

    data.forEach((d: any, index: number) => {
      [
        "Item Name",
        "Item Category",
        "Item Unit",
        "Item Rate",
        "Item Weight",
      ].forEach((key) => {
        if (!d[key] && d[key] !== 0) {
          if (keys.indexOf(key) === -1) {
            keys.push(key);
          }
          if (!indices.includes(index + 1)) {
            indices.push(index + 1);
          }
        }
      });
    });

    let errmessage = "";

    if (keys.length > 0) {
      errmessage = `Please check the following keys: ${keys.join(
        ", "
      )} at rows: ${indices.join(", ")}`;
      setError(true);
      handleClick(errmessage, true);
      return;
    }

    let flag = false;
    const body = data.map((data: any) => {
      return {
        name: data["Item Name"],
        category: data["Item Category"],
        unit: data["Item Unit"],
        price: parseFloat(data["Item Rate"]),
        weight: parseFloat(data["Item Weight"]),
        description: data["Item Description"] || "",
      };
    });
    if (flag) {
      setError(true);
      handleClick(errmessage, true);
      return;
    }
    setLoading(true);
    await axios
      .post("http://localhost:5000/item/createMany", {
        items: body,
      })
      .then((res) => {
        setError(false);
        handleClick("Data Imported Successfully", false);
        fetchItems();
      })
      .catch((err) => {
        setError(true);
        handleClick("Please Provide Valid Data", true);
      });
    setLoading(false);
  };

  // new Date(timeValue * 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center justify-center">
      <Label
        htmlFor="file"
        className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md cursor-pointer"
      >
        <input
          type="file"
          id="file"
          key={key}
          onChange={handleFile}
          className="hidden"
        />
        {loading ? <Spinner /> : <Import size={20} className="mr-2" />}
        Import
      </Label>
    </div>
  );
}

export default ImportProducts;
