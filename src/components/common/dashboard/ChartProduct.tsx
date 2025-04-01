import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart
} from "recharts";
import { Product } from "@/models/product";

// Types pour les données de graphique
type ChartDataItem = { name: string; value: number };

interface ChartProductProps {
  products: Product[];
  isLoading: boolean;
  isInitialLoad?: boolean;
}

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ChartProduct({ products, isLoading, isInitialLoad = true }: ChartProductProps) {
  // Si c'est en cours de chargement, afficher un squelette
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-6 w-64 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
        
        <div>
          <Skeleton className="h-6 w-72 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
      </div>
    );
  }

  // Préparer les données pour les graphiques
  // 1. Répartition par catégorie
  const productCategoryData = prepareProductCategoryData(products);
  
  // 2. Répartition par stock
  const productStockData = prepareProductStockData(products);
  
  // 3. Produits ajoutés récemment (timeline)
  const productTimelineData = prepareProductTimelineData(products);

  // Animation uniquement au chargement initial
  if (isInitialLoad) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <h3 className="text-lg font-medium mb-4">Répartition des produits par catégorie</h3>
          <BarChartComponent data={productCategoryData} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Répartition par niveau de stock</h3>
          <PieChartComponent data={productStockData} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Produits ajoutés récemment</h3>
          <ProductTimelineChart data={productTimelineData} />
        </div>
      </motion.div>
    );
  }

  // Pour les mises à jour, pas d'animation
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Répartition des produits par catégorie</h3>
        <BarChartComponent data={productCategoryData} />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Répartition par niveau de stock</h3>
        <PieChartComponent data={productStockData} />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Produits ajoutés récemment</h3>
        <ProductTimelineChart data={productTimelineData} />
      </div>
    </div>
  );
}

// Composant pour le graphique en camembert
function PieChartComponent({ data }: { data: ChartDataItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value}`, 'Nombre']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Composant pour le graphique en barres
function BarChartComponent({ data }: { data: ChartDataItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => [`${value}`, 'Nombre']} />
        <Legend />
        <Bar dataKey="value" name="Quantité" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Composant pour le graphique en ligne/aire (timeline)
function ProductTimelineChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number) => [`${value}`, 'Produits']} />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="count" 
          name="Nouveaux produits" 
          fill="#8884d8"
          stroke="#8884d8"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Fonctions utilitaires pour préparer les données

function prepareProductCategoryData(products: Product[]): ChartDataItem[] {
  const categories = products.reduce((acc: Record<string, number>, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(categories).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize
    value: count
  }));
}

function prepareProductStockData(products: Product[]): ChartDataItem[] {
  // Créer des catégories de stock
  const stockCategories = {
    "Rupture de stock": 0,
    "Stock faible (1-10)": 0,
    "Stock moyen (11-50)": 0,
    "Stock élevé (51+)": 0
  };
  
  // Classer les produits par catégorie de stock
  products.forEach(product => {
    const stock = product.stock;
    
    if (stock === 0) {
      stockCategories["Rupture de stock"]++;
    } else if (stock <= 10) {
      stockCategories["Stock faible (1-10)"]++;
    } else if (stock <= 50) {
      stockCategories["Stock moyen (11-50)"]++;
    } else {
      stockCategories["Stock élevé (51+)"]++;
    }
  });
  
  // Transformer en format pour le graphique
  return Object.entries(stockCategories).map(([category, count]) => ({
    name: category,
    value: count
  }));
}

function prepareProductTimelineData(products: Product[]): { date: string; count: number }[] {
  // Pour simuler une timeline d'ajouts, on va grouper par mois
  // Dans un cas réel, ces données viendraient probablement directement de l'API
  
  // On suppose que createdAt est disponible sur les produits
  const months: Record<string, number> = {};
  
  // Créer une timeline sur les 6 derniers mois
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    const monthYear = `${d.getMonth() + 1}/${d.getFullYear()}`;
    months[monthYear] = 0;
  }
  
  // Remplir avec les données réelles
  products.forEach(product => {
    if (product.createdAt) {
      const date = new Date(product.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      // Seulement compter si c'est dans les 6 derniers mois
      if (months[monthYear] !== undefined) {
        months[monthYear]++;
      }
    }
  });
  
  // Transformer en format pour le graphique
  return Object.entries(months).map(([date, count]) => ({
    date,
    count
  }));
} 