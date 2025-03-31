import { z } from 'zod';

// Schéma de validation Zod
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  category: z.enum(['électronique', 'vêtements', 'alimentation', 'maison', 'loisirs']),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
  createdAt: z.date(),
});

// Type dérivé du schéma Zod
export type Product = z.infer<typeof productSchema>;

// Schéma pour la création d'un produit (sans id et createdAt)
export const createProductSchema = productSchema.omit({ id: true, createdAt: true });
export type CreateProduct = z.infer<typeof createProductSchema>;

// Schéma pour la mise à jour d'un produit (tous les champs optionnels)
export const updateProductSchema = createProductSchema.partial();
export type UpdateProduct = z.infer<typeof updateProductSchema>; 