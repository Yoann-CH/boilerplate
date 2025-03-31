import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateUserSchema } from '@/models/user';
import { DEFAULT_AVATAR_URL } from '@/constants/defaults';

// GET /api/users/[id] - Récupérer un utilisateur par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur:`, error);
    return NextResponse.json(
      { error: `Erreur lors de la récupération de l'utilisateur` },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Mettre à jour un utilisateur
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Valider les données avec Zod
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extraire les données validées
    const userData = validationResult.data;
    
    // Vérifier si l'utilisateur existe
    const userExists = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!userExists) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Si l'avatar est vide dans la mise à jour, utiliser l'avatar par défaut
    if (userData.avatar === '') {
      userData.avatar = DEFAULT_AVATAR_URL;
    }
    
    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur:`, error);
    return NextResponse.json(
      { error: `Erreur lors de la mise à jour de l'utilisateur` },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Vérifier si l'utilisateur existe
    const userExists = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!userExists) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur:`, error);
    return NextResponse.json(
      { error: `Erreur lors de la suppression de l'utilisateur` },
      { status: 500 }
    );
  }
} 