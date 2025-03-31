import { User } from '@/models/user';
import { DEFAULT_AVATAR_URL } from '@/constants/defaults';
import { supabase } from '@/utils/supabase';

// Interface pour le service utilisateur (Principe de ségrégation des interfaces)
export interface IUserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'createdAt'> | Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>;
  updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}

// Implémentation concrète du service utilisateur (Principe de responsabilité unique)
export class UserService implements IUserService {
  
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
    
    return data.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      return null;
    }
    
    return data ? {
      ...data,
      createdAt: new Date(data.createdAt)
    } : null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'> | Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    // Si l'avatar n'est pas fourni, utiliser l'avatar par défaut
    const avatar = userData.avatar?.trim() ? userData.avatar : DEFAULT_AVATAR_URL;
    
    const newUser = {
      ...userData,
      avatar,
      createdAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }
    
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    };
  }

  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    // Si l'avatar est vide dans la mise à jour, utiliser l'avatar par défaut
    if (userData.avatar === '') {
      userData.avatar = DEFAULT_AVATAR_URL;
    }

    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      return null;
    }
    
    return data ? {
      ...data,
      createdAt: new Date(data.createdAt)
    } : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      return false;
    }
    
    return true;
  }
}

// Singleton pour l'accès au service (Principe d'inversion de dépendance)
export const userService = new UserService(); 