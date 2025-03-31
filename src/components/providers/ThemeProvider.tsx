"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { getThemePreference, getSystemTheme } from "@/utils/theme-storage";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // État pour gérer l'affichage pendant l'hydration
  const [mounted, setMounted] = useState(false);

  // Éviter les erreurs d'hydration en attendant que le client soit monté
  useEffect(() => {
    setMounted(true);
  }, []);

  // Récupérer le thème stocké dans le localStorage ou utiliser la préférence système
  const storedTheme = getThemePreference();
  
  // Déterminer le thème par défaut: stocké > système > light
  const systemTheme = getSystemTheme();
  const defaultTheme = storedTheme || systemTheme;

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={defaultTheme}
      forcedTheme={props.forcedTheme}
      themes={["light", "dark"]}
      enableSystem={false}
      enableColorScheme
      attribute="class"
    >
      {children}
    </NextThemesProvider>
  );
} 