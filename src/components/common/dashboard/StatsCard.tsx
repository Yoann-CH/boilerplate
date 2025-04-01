import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Types pour les propriétés du composant
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isLoading?: boolean;
  // delay d'animation utilisé uniquement lors du chargement initial, pas lors des mises à jour
  animationDelay?: number;
  // flag pour indiquer si c'est le premier chargement ou une mise à jour
  isInitialLoad?: boolean;
}

// Variante pour l'animation des cartes
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  isLoading = false,
  animationDelay = 0,
  isInitialLoad = true
}: StatsCardProps) {
  
  // Si c'est en cours de chargement, afficher un squelette
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  // Si c'est le premier chargement, ajouter l'animation
  if (isInitialLoad) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: animationDelay }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Pour les mises à jour, pas d'animation
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
} 