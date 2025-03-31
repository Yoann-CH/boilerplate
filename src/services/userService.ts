import { User } from '@/models/user';

// Interface pour le service utilisateur (Principe de ségrégation des interfaces)
export interface IUserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'createdAt'> | Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>;
  updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}

// Implémentation concrète du service utilisateur avec l'API route (Principe de responsabilité unique)
export class UserService implements IUserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as User[];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as User;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      return null;
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'> | Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as User;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw new Error('Impossible de créer l\'utilisateur');
    }
  }

  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as User;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (response.status === 404) {
        return false;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      return false;
    }
  }
}

// Singleton pour l'accès au service (Principe d'inversion de dépendance)
export const userService = new UserService(); 