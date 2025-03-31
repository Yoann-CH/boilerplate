import { faker } from '@faker-js/faker/locale/fr';
import { User } from '@/models/user';
import { DEFAULT_AVATAR_URL } from '@/constants/defaults';

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
  private users: User[] = [];
  
  constructor() {
    // Générer des utilisateurs mockés au démarrage
    this.users = Array.from({ length: 10 }, () => this.generateMockUser());
  }

  private generateMockUser(): User {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'user', 'guest']),
      createdAt: faker.date.recent(),
      avatar: faker.image.avatar(),
    };
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'> | Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    // Si l'avatar n'est pas fourni, utiliser l'avatar par défaut
    const avatar = userData.avatar?.trim() ? userData.avatar : DEFAULT_AVATAR_URL;
    
    const newUser: User = {
      ...userData,
      avatar,
      id: faker.string.uuid(),
      createdAt: new Date(),
    } as User; // Ajout d'un cast pour gérer le cas où des champs requis pourraient être absents
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return null;
    }

    // Si l'avatar est vide dans la mise à jour, utiliser l'avatar par défaut
    if (userData.avatar === '') {
      userData.avatar = DEFAULT_AVATAR_URL;
    }

    // Mise à jour de l'utilisateur
    this.users[index] = {
      ...this.users[index],
      ...userData,
    };

    return this.users[index];
  }

  async deleteUser(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length < initialLength;
  }
}

// Singleton pour l'accès au service (Principe d'inversion de dépendance)
export const userService = new UserService(); 