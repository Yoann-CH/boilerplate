import { createClient } from '@supabase/supabase-js';

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export un singleton pour l'application
export default supabase; 