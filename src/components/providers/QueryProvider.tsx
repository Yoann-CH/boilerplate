"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Créer une instance du QueryClient pour chaque session utilisateur
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuration par défaut pour améliorer l'UX
            staleTime: 60 * 1000, // 1 minute avant de considérer les données comme obsolètes
            gcTime: 5 * 60 * 1000, // 5 minutes avant le garbage collection des données
            refetchOnWindowFocus: false, // Désactive le refetch auto au focus de la fenêtre
            retry: 1, // Limite les tentatives en cas d'échec
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
} 