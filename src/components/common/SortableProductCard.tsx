"use client";

import React from 'react';
import { Product } from '@/models/product';
import { ProductCard } from './ProductCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Move } from 'lucide-react';

interface SortableProductCardProps {
  product: Product;
  onUpdate?: () => void;
}

export const SortableProductCard: React.FC<SortableProductCardProps> = ({
  product,
  onUpdate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease, opacity 200ms ease',
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.9 : 1,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'cursor-grabbing touch-none' : 'hover:cursor-move touch-manipulation'}`}
      {...attributes}
      {...listeners}
    >
      <ProductCard product={product} onUpdate={onUpdate} />
      
      {/* Drag handle */}
      <div 
        className="absolute top-2 right-2 bg-primary/10 backdrop-blur-sm text-primary rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move z-10"
      >
        <Move className="h-5 w-5" />
      </div>
      
      {/* Effet visuel pendant le drag */}
      <div 
        className={`absolute inset-0 bg-primary/5 border-2 rounded-lg border-primary transition-all duration-300 ${
          isDragging ? 'opacity-100 scale-[1.03] shadow-lg' : 'opacity-0 scale-100'
        } pointer-events-none z-0`} 
      />
    </div>
  );
}; 