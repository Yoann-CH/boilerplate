/**
 * Valeurs par défaut pour les images et autres données
 */

// Images par défaut
export const DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?background=random&name=User&color=fff";
export const DEFAULT_PRODUCT_IMAGE_URL = "https://placehold.co/400x300/e2e8f0/1e293b?text=Produit";

// Valeurs initiales pour les formulaires
export const DEFAULT_USER_DATA = {
  name: "",
  email: "",
  role: "user" as const,
  avatar: "",
};

export const DEFAULT_PRODUCT_DATA = {
  name: "",
  description: "",
  price: 0,
  category: "électronique" as const,
  stock: 0,
  imageUrl: "",
}; 