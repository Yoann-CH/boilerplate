import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartUser } from "./ChartUser";
import { ChartProduct } from "./ChartProduct";
import { User } from "@/models/user";
import { Product } from "@/models/product";

interface DashboardTabsProps {
  users: User[];
  products: Product[];
  isLoading: boolean;
  isInitialLoad?: boolean;
}

export function DashboardTabs({ 
  users, 
  products, 
  isLoading, 
  isInitialLoad = true 
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="users" className="mb-4">
      <TabsList>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="products">Produits</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users" className="p-4 border rounded-md mt-4">
        <ChartUser 
          users={users} 
          isLoading={isLoading} 
          isInitialLoad={isInitialLoad} 
        />
      </TabsContent>
      
      <TabsContent value="products" className="p-4 border rounded-md mt-4">
        <ChartProduct 
          products={products} 
          isLoading={isLoading} 
          isInitialLoad={isInitialLoad} 
        />
      </TabsContent>
    </Tabs>
  );
} 