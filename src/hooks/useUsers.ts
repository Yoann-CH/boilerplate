import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Type pour un utilisateur
interface User {
  id: string;
  name: string;
  email: string;
  // Ajoutez d'autres champs selon votre modèle
}

// Clé de requête pour les utilisateurs
const USERS_QUERY_KEY = ["users"];

// Hook pour récupérer tous les utilisateurs
export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      return response.json() as Promise<User[]>;
    },
  });
}

// Hook pour récupérer un utilisateur par son ID
export function useUser(id: string) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'utilisateur ${id}`);
      }
      return response.json() as Promise<User>;
    },
    enabled: !!id, // Désactive la requête si l'ID n'est pas fourni
  });
}

// Hook pour créer un utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: Omit<User, "id">) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'utilisateur");
      }

      return response.json() as Promise<User>;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache avec le nouvel utilisateur
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (oldData) => {
        return oldData ? [...oldData, data] : [data];
      });
    },
  });
}

// Hook pour mettre à jour un utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedUser: User) => {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur ${updatedUser.id}`);
      }

      return response.json() as Promise<User>;
    },
    onSuccess: (data) => {
      // Mettre à jour l'utilisateur dans le cache
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (oldData) => {
        return oldData 
          ? oldData.map((user) => (user.id === data.id ? data : user))
          : [data];
      });
      
      // Mettre à jour le cache de l'utilisateur individuel
      queryClient.setQueryData([...USERS_QUERY_KEY, data.id], data);
    },
  });
}

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de l'utilisateur ${userId}`);
      }

      return userId;
    },
    onSuccess: (userId) => {
      // Supprimer l'utilisateur du cache
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (oldData) => {
        return oldData ? oldData.filter((user) => user.id !== userId) : [];
      });
      
      // Invalider le cache de l'utilisateur individuel
      queryClient.removeQueries({ queryKey: [...USERS_QUERY_KEY, userId] });
    },
  });
} 