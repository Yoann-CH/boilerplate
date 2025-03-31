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
    const product = await productService.getProductById('id-inexistant');
    
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

  it('devrait créer un produit avec une image par défaut si aucune n\'est fournie', async () => {
    const produitSansImage: Omit<Product, 'id' | 'createdAt' | 'imageUrl'> & { imageUrl?: string } = {
      name: 'Produit sans image',
      description: 'Description du produit sans image',
      price: 49.99,
      category: 'maison',
      stock: 5,
    };
    
    const produitCree = await productService.createProduct(produitSansImage);
    
    expect(produitCree).toHaveProperty('id');
    expect(produitCree.imageUrl).toBeDefined();
    expect(produitCree.imageUrl.length).toBeGreaterThan(0);
  });

  it('devrait mettre à jour un produit existant', async () => {
    // Créer un produit pour le test
    const nouveauProduit = await productService.createProduct({
      name: 'Produit à mettre à jour',
      description: 'Description initiale',
      price: 199.99,
      category: 'électronique',
      stock: 20,
      imageUrl: 'https://example.com/image_old.jpg',
    });
    
    // Données de mise à jour
    const miseAJour = {
      name: 'Produit Mis à Jour',
      price: 149.99,
      stock: 15,
    };
    
    // Mettre à jour le produit
    const produitMisAJour = await productService.updateProduct(nouveauProduit.id, miseAJour);
    
    expect(produitMisAJour).not.toBeNull();
    expect(produitMisAJour?.name).toBe(miseAJour.name);
    expect(produitMisAJour?.price).toBe(miseAJour.price);
    expect(produitMisAJour?.stock).toBe(miseAJour.stock);
    expect(produitMisAJour?.description).toBe(nouveauProduit.description); // Champ non mis à jour
    expect(produitMisAJour?.category).toBe(nouveauProduit.category); // Champ non mis à jour
  });

  it('devrait retourner null lors de la mise à jour d\'un produit inexistant', async () => {
    const resultat = await productService.updateProduct('id-inexistant', { name: 'Test' });
    
    expect(resultat).toBeNull();
  });

  it('devrait supprimer un produit existant', async () => {
    // Créer un produit pour le test
    const nouveauProduit = await productService.createProduct({
      name: 'Produit à supprimer',
      description: 'Description du produit à supprimer',
      price: 29.99,
      category: 'alimentation',
      stock: 100,
      imageUrl: 'https://example.com/delete.jpg',
    });
    
    // Vérifier que le produit existe
    const produitAvant = await productService.getProductById(nouveauProduit.id);
    expect(produitAvant).not.toBeNull();
    
    // Supprimer le produit
    const resultat = await productService.deleteProduct(nouveauProduit.id);
    expect(resultat).toBe(true);
    
    // Vérifier que le produit n'existe plus
    const produitApres = await productService.getProductById(nouveauProduit.id);
    expect(produitApres).toBeNull();
  });

  it('devrait retourner false lors de la suppression d\'un produit inexistant', async () => {
    const resultat = await productService.deleteProduct('id-inexistant');
    
    expect(resultat).toBe(false);
  });

  it('devrait filtrer correctement les produits par catégorie', async () => {
    // Créer plusieurs produits avec des catégories différentes
    await productService.createProduct({
      name: 'Produit Électronique Test',
      description: 'Description',
      price: 299.99,
      category: 'électronique',
      stock: 10,
      imageUrl: 'https://example.com/electronics.jpg',
    });
    
    await productService.createProduct({
      name: 'Produit Vêtement Test',
      description: 'Description',
      price: 49.99,
      category: 'vêtements',
      stock: 50,
      imageUrl: 'https://example.com/clothing.jpg',
    });
    
    // Récupérer tous les produits
    const produits = await productService.getProducts();
    
    // Filtrer par catégorie
    const produitsElectroniques = produits.filter(p => p.category === 'électronique');
    const produitsVetements = produits.filter(p => p.category === 'vêtements');
    
    expect(produitsElectroniques.length).toBeGreaterThan(0);
    expect(produitsVetements.length).toBeGreaterThan(0);
    
    // Vérifier que les produits sont correctement catégorisés
    produitsElectroniques.forEach(produit => {
      expect(produit.category).toBe('électronique');
    });
    
    produitsVetements.forEach(produit => {
      expect(produit.category).toBe('vêtements');
    });
  });
}); 