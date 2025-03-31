# Boilerplate Next.js App Router

Un boilerplate complet pour démarrer rapidement des projets Next.js avec App Router, incluant une architecture robuste et les meilleures pratiques.

## 🚀 Fonctionnalités

- ⚡️ **Next.js App Router** - Architecture moderne avec Server Components
- 🎨 **Tailwind CSS** - Styling utilitaire et rapide
- 🧩 **shadcn/ui** - Composants UI réutilisables et personnalisables
- 🌗 **Mode Sombre** - Support du thème clair/sombre avec localStorage
- 🦴 **Skeleton UI** - Chargements élégants avec des placeholders
- 🔒 **Validation Zod** - Validation TypeScript runtime
- 📊 **Prisma ORM** - ORM puissant avec forte intégration TypeScript
- 🔌 **Supabase** - Backend-as-a-Service pour la persistance des données
- 🧪 **Tests Unitaires** - Tests avec Vitest pour une couverture complète

## 📋 Prérequis

- Node.js 18.0.0 ou plus récent
- npm ou yarn

## 🛠️ Installation

```bash
git clone https://github.com/username/boilerplate.git
cd boilerplate
npm install
```

## 🏗️ Structure du Projet

```
src/
├── app/               # Routes Next.js App Router
├── components/        # Composants React
│   ├── ui/            # Composants UI réutilisables
│   └── common/        # Composants spécifiques à l'application
├── lib/               # Bibliothèques et configurations
├── models/            # Modèles de données et validations Zod
├── services/          # Services et logique métier
├── utils/             # Utilitaires et fonctions d'aide
└── tests/             # Tests unitaires
```

## 🔍 Base de Données

Le projet utilise Prisma comme ORM avec Supabase comme base de données PostgreSQL:

```bash
# Générer le client Prisma
npx prisma generate

# Synchroniser le schéma avec la base de données
npx prisma db push
```

## 🧪 Tests

Exécutez les tests avec:

```bash
npm run test
```

## 🌐 Environnement

Créez un fichier `.env.local` avec:

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
DATABASE_URL=votre_url_connection_postgresql
```

## 📊 Git Flow

Le projet utilise Git Flow pour la gestion des branches:

- `main` - Code de production
- `develop` - Développement principal
- `feature/*` - Nouvelles fonctionnalités
- `release/*` - Préparation des releases
- `hotfix/*` - Corrections urgentes

## 📄 Licence

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
