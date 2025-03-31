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
    const user = await userService.getUserById('id-inexistant');
    
    expect(user).toBeNull();
  });

  it('devrait créer un nouvel utilisateur', async () => {
    const nouveauUser: Omit<User, 'id' | 'createdAt'> = {
      name: 'Test User',
      email: 'test@example.com',
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

  it('devrait créer un utilisateur avec des valeurs par défaut si certains champs sont manquants', async () => {
    const userPartiel = {
      name: 'User Minimal',
      email: 'minimal@example.com',
      role: 'guest' as const,
    };
    
    const userCree = await userService.createUser(userPartiel);
    
    expect(userCree).toHaveProperty('id');
    expect(userCree.name).toBe(userPartiel.name);
    expect(userCree.email).toBe(userPartiel.email);
    expect(userCree.avatar).toBeDefined(); // Devrait avoir un avatar par défaut
  });

  it('devrait mettre à jour un utilisateur existant', async () => {
    // Créer un utilisateur pour le test
    const nouveauUser = await userService.createUser({
      name: 'User à mettre à jour',
      email: 'update@example.com',
      role: 'user',
    });
    
    // Données de mise à jour
    const miseAJour = {
      name: 'User Mis à Jour',
      role: 'admin' as const,
    };
    
    // Mettre à jour l'utilisateur
    const userMisAJour = await userService.updateUser(nouveauUser.id, miseAJour);
    
    expect(userMisAJour).not.toBeNull();
    expect(userMisAJour?.name).toBe(miseAJour.name);
    expect(userMisAJour?.role).toBe(miseAJour.role);
    expect(userMisAJour?.email).toBe(nouveauUser.email); // Champ non mis à jour
  });

  it('devrait retourner null lors de la mise à jour d\'un utilisateur inexistant', async () => {
    const resultat = await userService.updateUser('id-inexistant', { name: 'Test' });
    
    expect(resultat).toBeNull();
  });

  it('devrait supprimer un utilisateur existant', async () => {
    // Créer un utilisateur pour le test
    const nouveauUser = await userService.createUser({
      name: 'User à supprimer',
      email: 'delete@example.com',
      role: 'guest',
    });
    
    // Vérifier que l'utilisateur existe
    const userAvant = await userService.getUserById(nouveauUser.id);
    expect(userAvant).not.toBeNull();
    
    // Supprimer l'utilisateur
    const resultat = await userService.deleteUser(nouveauUser.id);
    expect(resultat).toBe(true);
    
    // Vérifier que l'utilisateur n'existe plus
    const userApres = await userService.getUserById(nouveauUser.id);
    expect(userApres).toBeNull();
  });

  it('devrait retourner false lors de la suppression d\'un utilisateur inexistant', async () => {
    const resultat = await userService.deleteUser('id-inexistant');
    
    expect(resultat).toBe(false);
  });
}); 