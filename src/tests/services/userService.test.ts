import { describe, it, expect } from 'vitest';
import { userService } from '@/services/userService';
import { User } from '@/models/user';

describe('UserService', () => {
  // Utiliser directement le singleton exporté
  // const userService = new UserService();

  it('devrait retourner une liste d\'utilisateurs', async () => {
    const users = await userService.getUsers();
    
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it('devrait retourner un utilisateur par ID', async () => {
    // Récupérer tous les utilisateurs
    const users = await userService.getUsers();
    const firstUser = users[0];
    
    // Récupérer un utilisateur spécifique par ID
    const user = await userService.getUserById(firstUser.id);
    
    expect(user).not.toBeNull();
    expect(user?.id).toBe(firstUser.id);
  });

  it('devrait retourner null pour un ID inexistant', async () => {
    // Utilisation de l'UUID nil comme ID inexistant valide
    const user = await userService.getUserById('00000000-0000-0000-0000-000000000000');
    
    expect(user).toBeNull();
  });

  it('devrait créer un nouvel utilisateur', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`; // Génération d'un email unique
    const nouveauUser: Omit<User, 'id' | 'createdAt'> = {
      name: 'Test User',
      email: uniqueEmail, // Utilisation de l'email unique
      role: 'user',
      avatar: 'https://example.com/avatar.jpg',
    };
    
    const userCree = await userService.createUser(nouveauUser);
    
    // Vérifier les propriétés du nouvel utilisateur
    expect(userCree).toHaveProperty('id');
    expect(userCree.name).toBe(nouveauUser.name);
    expect(userCree.email).toBe(nouveauUser.email);
    
    // Vérifier que l'utilisateur créé est bien dans la liste
    const usersApres = await userService.getUsers();
    const userTrouve = usersApres.find(u => u.id === userCree.id);
    expect(userTrouve).not.toBeUndefined();
  });
}); 