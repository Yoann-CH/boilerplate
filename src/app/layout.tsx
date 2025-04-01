import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boilerplate Next.js App Router",
  description: "Un boilerplate Next.js avec App Router, Tailwind CSS, shadcn/ui, et des principes SOLID",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Essaie de récupérer le thème depuis localStorage
                let theme = null;
                try {
                  theme = localStorage.getItem('theme-preference');
                } catch (e) {}
                
                // Si aucun thème n'est stocké, vérifie la préférence système
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                
                // Applique immédiatement la classe si le thème est dark
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <QueryProvider>
            <header className="bg-background border-b border-border py-4 px-4 sm:px-6 lg:px-8">
              <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">🧱 Boilerplate</div>
                <div className="flex items-center gap-4">
                  <nav className="flex gap-4">
                    <Link href="/" className="hover:underline">Accueil</Link>
                    <Link href="/api/users" className="hover:underline">API Utilisateurs</Link>
                    <Link href="/api/products" className="hover:underline">API Produits</Link>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            
            <main className="flex-grow">
              {children}
            </main>
            
            <Toaster />
            
            <footer className="bg-muted py-6">
              <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p>Boilerplate Next.js (App Router) avec Tailwind CSS & shadcn/ui</p>
                <p className="text-sm mt-2">© {new Date().getFullYear()} - Créé avec ❤️</p>
              </div>
            </footer>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
