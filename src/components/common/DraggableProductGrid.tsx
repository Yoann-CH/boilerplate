"use client";

import React, { useState } from 'react';
import { Product } from '@/models/product';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableProductCard } from './SortableProductCard';

interface DraggableProductGridProps {
  products: Product[];
  onUpdate?: () => void;
}

export const DraggableProductGrid: React.FC<DraggableProductGridProps> = ({
  products,
  onUpdate,
}) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  
  // Mise à jour des produits affichés quand la prop products change
  React.useEffect(() => {
    setSortedProducts(products);
  }, [products]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Exige un minimum de mouvement avant d'activer le drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Ajoute un délai sur mobile pour éviter les drags accidentels
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSortedProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedProducts} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <SortableProductCard 
              key={product.id} 
              product={product} 
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}; 