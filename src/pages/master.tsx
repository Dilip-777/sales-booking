import { Inter } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Category from "@/components/Category";

const inter = Inter({ subsets: ["latin"] });

export default function Master() {
  return (
    <main
      className={`flex flex-col items-center gap-4 h-screen p-4 ${inter.className}`}
    >
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="w-1/2">
          <TabsTrigger value="category" className="w-full">
            Category
          </TabsTrigger>
          <TabsTrigger value="zone" className="w-full">
            Zone
          </TabsTrigger>
          <TabsTrigger value="company" className="w-full">
            Company
          </TabsTrigger>
          <TabsTrigger value="delete" className="w-full">
            Delete
          </TabsTrigger>
        </TabsList>
        <TabsContent value="category">
          <Category />
        </TabsContent>
        <TabsContent value="zone">Zone</TabsContent>
        <TabsContent value="company">Company</TabsContent>
        <TabsContent value="delete">Delete</TabsContent>
      </Tabs>
    </main>
  );
}
