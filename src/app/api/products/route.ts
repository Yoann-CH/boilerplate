import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProductSchema } from '@/models/product';
import { DEFAULT_PRODUCT_IMAGE_URL } from '@/constants/defaults';
import { Category } from '@prisma/client';
import { DBFallback } from '@/lib/db-fallback';

// Fonction utilitaire pour mapper les catégories
function mapCategoryToPrisma(category?: string): Category {
  switch(category) {
    case 'électronique':
      return Category.electronique;
    case 'vêtements':
      return Category.vetements;
    case 'alimentation':
      return Category.alimentation;
    case 'maison':
      return Category.maison;
    case 'loisirs':
      return Category.loisirs;
    default:
      return Category.electronique; // Catégorie par défaut
  }
}

// GET /api/products - Récupérer tous les produits
export async function GET() {
  try {
    let products;
    try {
      // Essayer d'obtenir les produits depuis la base de données
      products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données, utilisation du fallback:', dbError);
      // Utiliser le fallback en cas d'erreur de connexion à la base de données
      products = DBFallback.getProducts();
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// POST /api/products - Créer un nouveau produit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Valider les données avec Zod
    const validationResult = createProductSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extraire les données validées
    const productData = validationResult.data;
    
    // Si l'URL de l'image est vide, utiliser l'image par défaut
    if (!productData.imageUrl) {
      productData.imageUrl = DEFAULT_PRODUCT_IMAGE_URL;
    }
    
    let newProduct;
    try {
      // Convertir la catégorie
      const category = mapCategoryToPrisma(productData.category);
      
      // Tenter de créer le produit dans la base de données
      newProduct = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category,
          imageUrl: productData.imageUrl,
        }
      });
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données, utilisation du fallback:', dbError);
      // Utiliser le fallback en cas d'erreur de connexion à la base de données
      newProduct = DBFallback.createProduct(productData);
    }
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
} 