import React from 'react';
import { Product } from '@/models/product';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductDetailDialog } from './ProductDetailDialog';
import { ProductEditDialog } from './ProductEditDialog';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onUpdate?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        await productService.deleteProduct(product.id);
        toast.success('Produit supprimé avec succès');
        if (onUpdate) onUpdate();
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit');
        console.error(error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md flex flex-col hover:shadow-md transition-shadow">
      <div className="relative pt-[56.25%] overflow-hidden rounded-t-lg">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <p className="text-sm text-gray-500">{product.category}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="font-bold text-lg">{formatPrice(product.price)}</p>
          <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `En stock: ${product.stock}` : 'Rupture de stock'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        <ProductDetailDialog 
          product={product} 
          trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <Eye className="h-4 w-4" />
            </Button>
          }
        />
        <ProductEditDialog 
          product={product} 
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
          onClick={handleDelete}
          className="h-8 w-8 text-red-500 hover:text-red-700 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}; 