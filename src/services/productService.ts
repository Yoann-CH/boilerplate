import { Product } from '@/models/product';

// Interface pour le service produit (Principe de ségrégation des interfaces)
export interface IProductService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}

// Implémentation concrète du service produit avec l'API route (Principe de responsabilité unique)
export class ProductService implements IProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as Product[];
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as Product;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      return null;
    }
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'> | Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as Product;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw new Error('Impossible de créer le produit');
    }
  }

  async updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data as Product;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/products/${id}`, {
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
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      return false;
    }
  }
}

// Singleton pour l'accès au service (Principe d'inversion de dépendance)
export const productService = new ProductService(); 