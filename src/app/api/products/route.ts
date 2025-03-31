import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/productService';
import { createProductSchema } from '@/models/product';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    // Validation des paramètres de requête
    const searchParamsSchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      category: z.string().optional(),
    });
    
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validatedParams = searchParamsSchema.safeParse(searchParams);
    
    if (!validatedParams.success) {
      return NextResponse.json(
        { error: 'Paramètres de requête invalides', details: validatedParams.error.format() },
        { status: 400 }
      );
    }
    
    const { limit, category } = validatedParams.data;
    let products = await productService.getProducts();
    
    // Filtrer par catégorie si spécifié
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    return NextResponse.json({
      products: limit ? products.slice(0, limit) : products,
      total: products.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation du corps de la requête avec le schéma Zod
    const validatedData = createProductSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validatedData.error.format() },
        { status: 400 }
      );
    }
    
    const newProduct = await productService.createProduct(validatedData.data);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 