import { PrismaClient } from '@prisma/client';

// Déclaration pour éviter plusieurs instances en dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Éviter de recréer des connexions en environnement de développement
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma; 