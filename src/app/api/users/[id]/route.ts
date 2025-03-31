import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateUserSchema } from '@/models/user';
import { DEFAULT_AVATAR_URL } from '@/constants/defaults';
import { DBFallback } from '@/lib/db-fallback';

// GET /api/users/[id] - Récupérer un utilisateur par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    let user;
    try {
      // Essayer d'obtenir l'utilisateur depuis la base de données
      user = await prisma.user.findUnique({
        where: { id }
      });
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données, utilisation du fallback:', dbError);
      // Utiliser le fallback en cas d'erreur de connexion à la base de données
      user = DBFallback.getUserById(id);
    }
    
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
    
    let userExists = false;
    let updatedUser;
    
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });
      
      userExists = !!existingUser;
      
      if (userExists) {
        // Si l'avatar est vide dans la mise à jour, utiliser l'avatar par défaut
        if (userData.avatar === '') {
          userData.avatar = DEFAULT_AVATAR_URL;
        }
        
        // Mettre à jour l'utilisateur
        updatedUser = await prisma.user.update({
          where: { id },
          data: userData
        });
      }
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données, utilisation du fallback:', dbError);
      // Utiliser le fallback en cas d'erreur de connexion à la base de données
      userExists = !!DBFallback.getUserById(id);
      
      if (userExists) {
        // Si l'avatar est vide dans la mise à jour, utiliser l'avatar par défaut
        if (userData.avatar === '') {
          userData.avatar = DEFAULT_AVATAR_URL;
        }
        
        // Mettre à jour l'utilisateur via le fallback
        updatedUser = DBFallback.updateUser(id, userData);
      }
    }
    
    if (!userExists) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
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
    
    let userExists = false;
    let deleteResult = false;
    
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });
      
      userExists = !!existingUser;
      
      if (userExists) {
        // Supprimer l'utilisateur
        await prisma.user.delete({
          where: { id }
        });
        deleteResult = true;
      }
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données, utilisation du fallback:', dbError);
      // Utiliser le fallback en cas d'erreur de connexion à la base de données
      userExists = !!DBFallback.getUserById(id);
      
      if (userExists) {
        // Supprimer l'utilisateur via le fallback
        deleteResult = DBFallback.deleteUser(id);
      }
    }
    
    if (!userExists) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: deleteResult });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur:`, error);
    return NextResponse.json(
      { error: `Erreur lors de la suppression de l'utilisateur` },
      { status: 500 }
    );
  }
} 