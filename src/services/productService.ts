import { faker } from '@faker-js/faker/locale/fr';
import { Product } from '@/models/product';
import { DEFAULT_PRODUCT_IMAGE_URL } from '@/constants/defaults';

// Interface pour le service produit (Principe de ségrégation des interfaces)
export interface IProductService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}

// Implémentation concrète du service produit (Principe de responsabilité unique)
export class ProductService implements IProductService {
  private products: Product[] = [];
  
  constructor() {
    // Générer des produits mockés au démarrage
    this.products = Array.from({ length: 15 }, () => this.generateMockProduct());
  }

  private generateMockProduct(): Product {
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

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'> | Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
    // Si l'URL de l'image n'est pas fournie, utiliser l'image par défaut
    const imageUrl = productData.imageUrl?.trim() ? productData.imageUrl : DEFAULT_PRODUCT_IMAGE_URL;
    
    const newProduct: Product = {
      ...productData,
      imageUrl,
      id: faker.string.uuid(),
      createdAt: new Date(),
    } as Product; // Ajout d'un cast pour gérer le cas où des champs requis pourraient être absents
    
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return null;
    }

    // Si l'URL de l'image est vide dans la mise à jour, utiliser l'image par défaut
    if (productData.imageUrl === '') {
      productData.imageUrl = DEFAULT_PRODUCT_IMAGE_URL;
    }

    // Mise à jour du produit
    this.products[index] = {
      ...this.products[index],
      ...productData,
    };

    return this.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);
    return this.products.length < initialLength;
  }
}

// Singleton pour l'accès au service (Principe d'inversion de dépendance)
export const productService = new ProductService(); 