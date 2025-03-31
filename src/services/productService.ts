import { Product } from '@/models/product';
import { DEFAULT_PRODUCT_IMAGE_URL } from '@/constants/defaults';
import { supabase } from '@/utils/supabase';

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
  
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }
    
    return data.map(product => ({
      ...product,
      createdAt: new Date(product.createdAt)
    }));
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      return null;
    }
    
    return data ? {
      ...data,
      createdAt: new Date(data.createdAt)
    } : null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'> | Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
    // Si l'URL de l'image n'est pas fournie, utiliser l'image par défaut
    const imageUrl = productData.imageUrl?.trim() ? productData.imageUrl : DEFAULT_PRODUCT_IMAGE_URL;
    
    const newProduct = {
      ...productData,
      imageUrl,
      createdAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw new Error(`Erreur lors de la création du produit: ${error.message}`);
    }
    
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    };
  }

  async updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
    // Si l'URL de l'image est vide dans la mise à jour, utiliser l'image par défaut
    if (productData.imageUrl === '') {
      productData.imageUrl = DEFAULT_PRODUCT_IMAGE_URL;
    }

    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      return null;
    }
    
    return data ? {
      ...data,
      createdAt: new Date(data.createdAt)
    } : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      return false;
    }
    
    return true;
  }
}

// Singleton pour l'accès au service (Principe d'inversion de dépendance)
export const productService = new ProductService(); 