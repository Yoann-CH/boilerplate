import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createUserSchema } from '@/models/user';
import { userService } from '@/services/userService';
import { DEFAULT_USER_DATA } from '@/constants/defaults';

// Adaptation du schéma pour rendre avatar optionnel pour le formulaire
const formSchema = createUserSchema.extend({
  avatar: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function UserFormDialog({ onSuccess, trigger }: UserFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_USER_DATA,
  });

  async function onSubmit(data: FormValues) {
    try {
      await userService.createUser(data);
      toast.success('Utilisateur ajouté avec succès');
      form.reset(DEFAULT_USER_DATA);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Ajouter un utilisateur</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...field}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">Utilisateur</option>
                      <option value="guest">Invité</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Avatar</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemple.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">Laissez vide pour utiliser un avatar par défaut</p>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6 flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">Annuler</Button>
              </DialogClose>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 