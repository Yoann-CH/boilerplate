import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/models/product';

interface ProductDetailDialogProps {
  product: Product;
  trigger?: React.ReactNode;
}

export function ProductDetailDialog({ product, trigger }: ProductDetailDialogProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Date inconnue';
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      // Vérifier si la date est valide
      if (isNaN(dateObj.getTime())) {
        return 'Date invalide';
      }
      
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(dateObj);
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date non disponible';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Voir détails</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="relative aspect-square rounded-md overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-sm">{product.description}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {product.category}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Prix</h3>
                <p className="text-lg font-bold">{formatPrice(product.price)}</p>
              </div>
              <div className="space-y-1 text-right">
                <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} unité(s)` : 'Rupture de stock'}
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-500 mt-auto">
              <p>Référence: {product.id}</p>
              <p>Ajouté le {formatDate(product.createdAt)}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 