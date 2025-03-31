import { z } from 'zod';

// Schéma de validation Zod
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.date(),
  avatar: z.string().url().optional(),
});

// Type dérivé du schéma Zod
export type User = z.infer<typeof userSchema>;

// Schéma pour la création d'un utilisateur (sans id et createdAt)
export const createUserSchema = userSchema.omit({ id: true, createdAt: true });
export type CreateUser = z.infer<typeof createUserSchema>;

// Schéma pour la mise à jour d'un utilisateur (tous les champs optionnels)
export const updateUserSchema = createUserSchema.partial();
export type UpdateUser = z.infer<typeof updateUserSchema>; 