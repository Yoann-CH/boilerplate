"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/models/product';
import { RotateCcw, SortAsc, SortDesc, Search, Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export interface ProductFilterValues {
  name: string;
  category: string | null;
  priceMin: number;
  priceMax: number;
  inStock: boolean;
  sortBy: 'name' | 'price' | 'createdAt';
  sortDirection: 'asc' | 'desc';
}

interface ProductFiltersProps {
  products: Product[];
  onFiltersChange: (filters: ProductFilterValues) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  onFiltersChange,
}) => {
  // Extraire les catégories uniques des produits
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Trouver le prix minimum et maximum parmi tous les produits
  const allPrices = products.map(p => p.price);
  const minProductPrice = Math.min(...(allPrices.length ? allPrices : [0]));
  const maxProductPrice = Math.max(...(allPrices.length ? allPrices : [1000]));
  
  // État des filtres
  const [filters, setFilters] = useState<ProductFilterValues>({
    name: '',
    category: null,
    priceMin: minProductPrice,
    priceMax: maxProductPrice,
    inStock: false,
    sortBy: 'name',
    sortDirection: 'asc',
  });
  
  // Compteur de filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.name) count++;
    if (filters.category) count++;
    if (filters.inStock) count++;
    if (filters.priceMin > minProductPrice) count++;
    if (filters.priceMax < maxProductPrice) count++;
    if (filters.sortBy !== 'name' || filters.sortDirection !== 'asc') count++;
    return count;
  };

  // Mettre à jour les filtres et déclencher le callback
  const updateFilters = (newFilters: Partial<ProductFilterValues>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    const defaultFilters: ProductFilterValues = {
      name: '',
      category: null,
      priceMin: minProductPrice,
      priceMax: maxProductPrice,
      inStock: false,
      sortBy: 'name',
      sortDirection: 'asc',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  // Déclencher le callback lors du premier rendu
  useEffect(() => {
    onFiltersChange(filters);
  }, []);

  return (
    <div className="mb-6 space-y-4">
      {/* Barre de recherche et filtres avancés */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un produit par nom..." 
            value={filters.name}
            onChange={(e) => updateFilters({ name: e.target.value })}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filtres avancés</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] md:w-[500px] p-6" align="end">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-lg">Filtres avancés</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="h-8 flex items-center gap-1 cursor-pointer" 
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Réinitialiser</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
                    <Select 
                      value={filters.category || 'all'} 
                      onValueChange={(value: string) => updateFilters({ category: value === 'all' ? null : value })}
                    >
                      <SelectTrigger id="category" className="w-full mt-2">
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox 
                        id="inStock" 
                        checked={filters.inStock}
                        onCheckedChange={(checked: boolean | "indeterminate") => 
                          updateFilters({ inStock: checked === true })
                        }
                      />
                      <Label htmlFor="inStock" className="cursor-pointer">Produits en stock uniquement</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium">Prix</Label>
                    <div className="pt-6 pb-2">
                      <Slider
                        value={[filters.priceMin, filters.priceMax]}
                        min={minProductPrice}
                        max={maxProductPrice}
                        step={1}
                        onValueChange={(values: number[]) => {
                          updateFilters({
                            priceMin: values[0],
                            priceMax: values[1],
                          });
                        }}
                        className="mb-6"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <Label htmlFor="minPrice" className="text-xs">Min</Label>
                        <Input 
                          id="minPrice"
                          type="number"
                          value={filters.priceMin}
                          onChange={(e) => updateFilters({ priceMin: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="maxPrice" className="text-xs">Max</Label>
                        <Input 
                          id="maxPrice"
                          type="number"
                          value={filters.priceMax}
                          onChange={(e) => updateFilters({ priceMax: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sortBy" className="text-sm font-medium">Trier par</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Select 
                        value={filters.sortBy} 
                        onValueChange={(value: 'name' | 'price' | 'createdAt') => 
                          updateFilters({ sortBy: value })
                        }
                      >
                        <SelectTrigger id="sortBy" className="w-full">
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Nom</SelectItem>
                          <SelectItem value="price">Prix</SelectItem>
                          <SelectItem value="createdAt">Date</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 cursor-pointer"
                        onClick={() => 
                          updateFilters({ 
                            sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' 
                          })
                        }
                      >
                        {filters.sortDirection === 'asc' ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Affichage des filtres actifs */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.name && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Nom: {filters.name}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ name: '' })}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Catégorie: {filters.category}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ category: null })}
              />
            </Badge>
          )}
          {filters.inStock && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>En stock uniquement</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ inStock: false })}
              />
            </Badge>
          )}
          {(filters.priceMin > minProductPrice || filters.priceMax < maxProductPrice) && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>
                Prix: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(filters.priceMin)} - 
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(filters.priceMax)}
              </span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ priceMin: minProductPrice, priceMax: maxProductPrice })}
              />
            </Badge>
          )}
          {(filters.sortBy !== 'name' || filters.sortDirection !== 'asc') && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>
                Tri: {filters.sortBy === 'name' ? 'Nom' : filters.sortBy === 'price' ? 'Prix' : 'Date'} 
                ({filters.sortDirection === 'asc' ? '↑' : '↓'})
              </span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ sortBy: 'name', sortDirection: 'asc' })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}; 