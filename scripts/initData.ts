import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Les variables d\'environnement Supabase ne sont pas définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Données utilisateurs à insérer
const users = [
  {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=jean.dupont',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=marie.martin',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    role: 'guest',
    avatar: 'https://i.pravatar.cc/150?u=pierre.durand',
    createdAt: new Date().toISOString(),
  }
];

// Données produits à insérer
const products = [
  {
    name: 'Ordinateur portable Pro',
    description: 'Ordinateur portable haute performance pour professionnels',
    price: 1299.99,
    category: 'électronique',
    stock: 15,
    imageUrl: 'https://picsum.photos/seed/laptop1/200/300',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Smartphone X20',
    description: 'Dernier modèle avec appareil photo 48MP',
    price: 899.99,
    category: 'électronique',
    stock: 25,
    imageUrl: 'https://picsum.photos/seed/phone1/200/300',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Veste en cuir',
    description: 'Veste en cuir véritable pour homme',
    price: 199.99,
    category: 'vêtements',
    stock: 10,
    imageUrl: 'https://picsum.photos/seed/jacket1/200/300',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Table de salon',
    description: 'Table basse en bois massif',
    price: 349.99,
    category: 'maison',
    stock: 7,
    imageUrl: 'https://picsum.photos/seed/table1/200/300',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Panier de fruits bio',
    description: 'Assortiment de fruits de saison issus de l\'agriculture biologique',
    price: 45.99,
    category: 'alimentation',
    stock: 20,
    imageUrl: 'https://picsum.photos/seed/fruit1/200/300',
    createdAt: new Date().toISOString(),
  }
];

// Fonction principale
async function initData() {
  console.log('Début de l\'initialisation des données...');
  
  try {
    // Supprimer les données existantes (optionnel)
    console.log('Suppression des données existantes...');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Insérer les utilisateurs
    console.log('Insertion des utilisateurs...');
    const { error: usersError } = await supabase.from('users').insert(users);
    if (usersError) {
      throw new Error(`Erreur lors de l'insertion des utilisateurs: ${usersError.message}`);
    }
    
    // Insérer les produits
    console.log('Insertion des produits...');
    const { error: productsError } = await supabase.from('products').insert(products);
    if (productsError) {
      throw new Error(`Erreur lors de l'insertion des produits: ${productsError.message}`);
    }
    
    console.log('Initialisation des données terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données:', error);
    process.exit(1);
  }
}

// Exécuter la fonction
initData(); 