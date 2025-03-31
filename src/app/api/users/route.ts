import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/models/user';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { DEFAULT_AVATAR_URL } from '@/constants/defaults';

export async function GET(request: NextRequest) {
  try {
    // Validation des paramètres de requête
    const searchParamsSchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    });
    
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validatedParams = searchParamsSchema.safeParse(searchParams);
    
    if (!validatedParams.success) {
      return NextResponse.json(
        { error: 'Paramètres de requête invalides', details: validatedParams.error.format() },
        { status: 400 }
      );
    }
    
    const { limit } = validatedParams.data;
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      users: limit ? users.slice(0, limit) : users,
      total: users.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation du corps de la requête avec le schéma Zod
    const validatedData = createUserSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validatedData.error.format() },
        { status: 400 }
      );
    }
    
    // Extraire les données validées
    const userData = validatedData.data;
    
    // Si l'avatar est vide, utiliser l'avatar par défaut
    if (!userData.avatar) {
      userData.avatar = DEFAULT_AVATAR_URL;
    }
    
    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: userData
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 