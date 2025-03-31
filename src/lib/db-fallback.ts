import { faker } from '@faker-js/faker/locale/fr';
import { User } from '@/models/user';
import { Product } from '@/models/product';
import { DEFAULT_AVATAR_URL, DEFAULT_PRODUCT_IMAGE_URL } from '@/constants/defaults';

/**
 * Classe pour générer des données mockées en cas d'échec de connexion à la base de données
 */
export class DBFallback {
  private static users: User[] = [];
  private static products: Product[] = [];
  private static initialized = false;

  /**
   * Initialise les données mockées si ce n'est pas déjà fait
   */
  private static initialize() {
    if (this.initialized) return;

    // Générer des utilisateurs mockés
    this.users = Array.from({ length: 10 }, () => this.generateMockUser());
    
    // Générer des produits mockés
    this.products = Array.from({ length: 15 }, () => this.generateMockProduct());
    
    this.initialized = true;
    console.warn('🚨 ATTENTION: Utilisation des données mockées en raison d\'une erreur de connexion à la base de données');
  }

  /**
   * Génère un utilisateur mocké
   */
  private static generateMockUser(): User {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'user', 'guest']),
      createdAt: faker.date.recent(),
      avatar: faker.image.avatar(),
    };
  }

  /**
   * Génère un produit mocké
   */
  private static generateMockProduct(): Product {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      category: faker.helpers.arrayElement(['électronique', 'vêtements', 'alimentation', 'maison', 'loisirs']),
      stock: faker.number.int({ min: 0, max: 100 }),
      imageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/200/300`,
      createdAt: faker.date.recent(),
    };
  }

  /**
   * Récupère tous les utilisateurs mockés
   */
  static getUsers(): User[] {
    this.initialize();
    return this.users;
  }

  /**
   * Récupère un utilisateur mocké par ID
   */
  static getUserById(id: string): User | null {
    this.initialize();
    return this.users.find(u => u.id === id) || null;
  }

  /**
   * Crée un nouvel utilisateur mocké
   */
  static createUser(userData: Partial<Omit<User, 'id' | 'createdAt'>>): User {
    this.initialize();
    const newUser: User = {
      ...userData,
      id: faker.string.uuid(),
      name: userData.name || 'Utilisateur',
      email: userData.email || `user_${Date.now()}@example.com`,
      role: userData.role || 'user',
      avatar: userData.avatar?.trim() ? userData.avatar : DEFAULT_AVATAR_URL,
      createdAt: new Date(),
    } as User;
    
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Met à jour un utilisateur mocké
   */
  static updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    this.initialize();
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return null;
    }

    this.users[index] = {
      ...this.users[index],
      ...userData,
    };

    return this.users[index];
  }

  /**
   * Supprime un utilisateur mocké
   */
  static deleteUser(id: string): boolean {
    this.initialize();
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length < initialLength;
  }

  /**
   * Récupère tous les produits mockés
   */
  static getProducts(): Product[] {
    this.initialize();
    return this.products;
  }

  /**
   * Récupère un produit mocké par ID
   */
  static getProductById(id: string): Product | null {
    this.initialize();
    return this.products.find(p => p.id === id) || null;
  }

  /**
   * Crée un nouveau produit mocké
   */
  static createProduct(productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Product {
    this.initialize();
    const newProduct: Product = {
      ...productData,
      id: faker.string.uuid(),
      name: productData.name || 'Produit sans nom',
      description: productData.description || 'Aucune description disponible',
      price: productData.price || parseFloat(faker.commerce.price()),
      category: productData.category || faker.helpers.arrayElement(['électronique', 'vêtements', 'alimentation', 'maison', 'loisirs']),
      stock: productData.stock !== undefined ? productData.stock : faker.number.int({ min: 0, max: 100 }),
      imageUrl: productData.imageUrl?.trim() ? productData.imageUrl : DEFAULT_PRODUCT_IMAGE_URL,
      createdAt: new Date(),
    } as Product;
    
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Met à jour un produit mocké
   */
  static updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
    this.initialize();
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return null;
    }

    this.products[index] = {
      ...this.products[index],
      ...productData,
    };

    return this.products[index];
  }

  /**
   * Supprime un produit mocké
   */
  static deleteProduct(id: string): boolean {
    this.initialize();
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);
    return this.products.length < initialLength;
  }
} 