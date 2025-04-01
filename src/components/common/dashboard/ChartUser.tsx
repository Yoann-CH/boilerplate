import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";
import { User } from "@/models/user";

// Types pour les données de graphique
type ChartDataItem = { name: string; value: number };

interface ChartUserProps {
  users: User[];
  isLoading: boolean;
  isInitialLoad?: boolean;
}

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ChartUser({ users, isLoading, isInitialLoad = true }: ChartUserProps) {
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
  // 1. Répartition par rôle
  const userRoleData = prepareUserRoleData(users);
  
  // 2. Simulation de données temporelles (normalement issues de l'API avec dates réelles)
  const userTimelineData = prepareUserTimelineData(users);
  
  // 3. Répartition par domaine d'email
  const userEmailDomainData = prepareUserEmailDomainData(users);

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
          <h3 className="text-lg font-medium mb-4">Répartition des utilisateurs par rôle</h3>
          <PieChartComponent data={userRoleData} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Répartition par domaine d&apos;email</h3>
          <BarChartComponent data={userEmailDomainData} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Évolution des inscriptions</h3>
          <UserTimelineChart data={userTimelineData} />
        </div>
      </motion.div>
    );
  }

  // Pour les mises à jour, pas d'animation
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Répartition des utilisateurs par rôle</h3>
        <PieChartComponent data={userRoleData} />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Répartition par domaine d&apos;email</h3>
        <BarChartComponent data={userEmailDomainData} />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Évolution des inscriptions</h3>
        <UserTimelineChart data={userTimelineData} />
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

// Composant pour le graphique en ligne (timeline)
function UserTimelineChart({ data }: { data: { date: string; users: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
        <Tooltip formatter={(value: number) => [`${value}`, 'Utilisateurs']} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="users" 
          name="Nouveaux utilisateurs" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Fonctions utilitaires pour préparer les données

function prepareUserRoleData(users: User[]): ChartDataItem[] {
  const userRoles = users.reduce((acc: Record<string, number>, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(userRoles).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize
    value: count
  }));
}

function prepareUserEmailDomainData(users: User[]): ChartDataItem[] {
  // Extraire les domaines des emails
  const domains = users.map(user => {
    const email = user.email;
    return email.substring(email.lastIndexOf('@') + 1);
  });
  
  // Compter les occurrences de chaque domaine
  const domainCounts = domains.reduce((acc: Record<string, number>, domain) => {
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});
  
  // Transformer en format pour le graphique
  return Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1]) // Trier par ordre décroissant
    .slice(0, 5) // Prendre les 5 premiers
    .map(([domain, count]) => ({
      name: domain,
      value: count
    }));
}

function prepareUserTimelineData(users: User[]): { date: string; users: number }[] {
  // Pour simuler une timeline d'inscriptions, on va grouper par mois
  // Dans un cas réel, ces données viendraient probablement directement de l'API
  
  // On suppose que createdAt est disponible sur les utilisateurs
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
  users.forEach(user => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
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
    users: count
  }));
} 