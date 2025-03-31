import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateProductSchema } from '@/models/product';
import { DEFAULT_PRODUCT_IMAGE_URL } from '@/constants/defaults';
import { Category } from '@prisma/client';

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

// GET /api/products/[id] - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit:`, error);
    return NextResponse.json(
      { error: `Erreur lors de la récupération du produit` },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Mettre à jour un produit
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Valider les données avec Zod
    const validationResult = updateProductSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extraire les données validées
    const productData = validationResult.data;
    
    // Vérifier si le produit existe
    const productExists = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!productExists) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    // Si l'URL de l'image est vide dans la mise à jour, utiliser l'image par défaut
    if (productData.imageUrl === '') {
      productData.imageUrl = DEFAULT_PRODUCT_IMAGE_URL;
    }
    
    // Préparer les données pour la mise à jour
    const updateData: any = { ...productData };
    
    // Convertir la catégorie si elle est présente
    if (productData.category) {
      updateData.category = mapCategoryToPrisma(productData.category);
    }
    
    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit:`, error);
    return NextResponse.json(
      { error: `Erreur lors de la mise à jour du produit` },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Vérifier si le produit existe
    const productExists = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!productExists) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le produit
    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit:`, error);
    return NextResponse.json(
      { error: `Erreur lors de la suppression du produit` },
      { status: 500 }
    );
  }
} 