import { describe, it, expect } from 'vitest';
import { productService } from '@/services/productService';
import { Product } from '@/models/product';

describe('ProductService', () => {
  // Utiliser directement le singleton exporté
  // const productService = new ProductService();

  it('devrait retourner une liste de produits', async () => {
    const products = await productService.getProducts();
    
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('devrait retourner un produit par ID', async () => {
    // Récupérer tous les produits
    const products = await productService.getProducts();
    const firstProduct = products[0];
    
    // Récupérer un produit spécifique par ID
    const product = await productService.getProductById(firstProduct.id);
    
    expect(product).not.toBeNull();
    expect(product?.id).toBe(firstProduct.id);
  });

  it('devrait retourner null pour un ID inexistant', async () => {
    // Utilisation de l'UUID nil comme ID inexistant valide
    const product = await productService.getProductById('00000000-0000-0000-0000-000000000000');
    
    expect(product).toBeNull();
  });

  it('devrait créer un nouveau produit', async () => {
    const nouveauProduit: Omit<Product, 'id' | 'createdAt'> = {
      name: 'Test Product',
      description: 'Description du produit de test',
      price: 99.99,
      category: 'électronique',
      stock: 10,
      imageUrl: 'https://example.com/image.jpg',
    };
    
    const produitCree = await productService.createProduct(nouveauProduit);
    
    // Vérifier les propriétés du nouveau produit
    expect(produitCree).toHaveProperty('id');
    expect(produitCree.name).toBe(nouveauProduit.name);
    expect(produitCree.price).toBe(nouveauProduit.price);
    
    // Vérifier que le produit créé est bien dans la liste
    const productsApres = await productService.getProducts();
    const produitTrouve = productsApres.find(p => p.id === produitCree.id);
    expect(produitTrouve).not.toBeUndefined();
  });
}); 