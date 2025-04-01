import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Type pour un produit
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  // Ajoutez d'autres champs selon votre modèle
}

// Clé de requête pour les produits
const PRODUCTS_QUERY_KEY = ["products"];

// Hook pour récupérer tous les produits
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des produits");
      }
      return response.json() as Promise<Product[]>;
    },
  });
}

// Hook pour récupérer un produit par son ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du produit ${id}`);
      }
      return response.json() as Promise<Product>;
    },
    enabled: !!id, // Désactive la requête si l'ID n'est pas fourni
  });
}

// Hook pour créer un produit
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Omit<Product, "id">) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du produit");
      }

      return response.json() as Promise<Product>;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache avec le nouveau produit
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (oldData) => {
        return oldData ? [...oldData, data] : [data];
      });
    },
  });
}

// Hook pour mettre à jour un produit
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedProduct: Product) => {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour du produit ${updatedProduct.id}`);
      }

      return response.json() as Promise<Product>;
    },
    onSuccess: (data) => {
      // Mettre à jour le produit dans le cache
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (oldData) => {
        return oldData 
          ? oldData.map((product) => (product.id === data.id ? data : product))
          : [data];
      });
      
      // Mettre à jour le cache du produit individuel
      queryClient.setQueryData([...PRODUCTS_QUERY_KEY, data.id], data);
    },
  });
}

// Hook pour supprimer un produit
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression du produit ${productId}`);
      }

      return productId;
    },
    onSuccess: (productId) => {
      // Supprimer le produit du cache
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (oldData) => {
        return oldData ? oldData.filter((product) => product.id !== productId) : [];
      });
      
      // Invalider le cache du produit individuel
      queryClient.removeQueries({ queryKey: [...PRODUCTS_QUERY_KEY, productId] });
    },
  });
} 