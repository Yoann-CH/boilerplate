import React from 'react';
import { User } from '@/models/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserEditDialog } from './UserEditDialog';
import { userService } from '@/services/userService';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onUpdate?: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onUpdate }) => {
  const handleDelete = async (user: User) => {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Avatar</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : user.role === 'user'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                {user.createdAt.toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <UserEditDialog 
                    user={user} 
                    onSuccess={onUpdate}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    } 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(user)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 