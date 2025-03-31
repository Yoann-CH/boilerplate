import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
          
          {children}
          <Toaster />
          
          <footer className="bg-muted py-6 mt-12">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>Boilerplate Next.js (App Router) avec Tailwind CSS & shadcn/ui</p>
              <p className="text-sm mt-2">© {new Date().getFullYear()} - Créé avec ❤️</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
