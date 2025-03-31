import React from 'react';
import { User } from '@/models/user';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserEditDialog } from './UserEditDialog';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface UserCardProps {
  user: User;
  onUpdate?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onUpdate }) => {
  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
      try {
        await userService.deleteUser(user.id);
        toast.success('Utilisateur supprimé avec succès');
        if (onUpdate) onUpdate();
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'utilisateur');
        console.error(error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{user.email}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 w-full">
          Créé le {user.createdAt.toLocaleDateString('fr-FR')}
        </p>
        <div className="flex w-full gap-2 justify-end">
          <UserEditDialog 
            user={user} 
            onSuccess={onUpdate}
            trigger={
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            } 
          />
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 