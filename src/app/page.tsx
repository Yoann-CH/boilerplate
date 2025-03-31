'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/common/ProductCard';
import { UsersTable } from '@/components/common/UsersTable';
import { UserFormDialog } from '@/components/common/UserFormDialog';
import { ProductFormDialog } from '@/components/common/ProductFormDialog';
import { User } from '@/models/user';
import { Product } from '@/models/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronDown, 
  ChevronUp,
  Move
} from 'lucide-react';
import { ProductFilters, ProductFilterValues } from '@/components/common/ProductFilters';
import { DraggableProductGrid } from '@/components/common/DraggableProductGrid';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonProductCard } from '@/components/common/SkeletonProductCard';
import { SkeletonUsersTable } from '@/components/common/SkeletonUsersTable';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mode d'affichage des produits
  const [viewMode, setViewMode] = useState<'grid' | 'draggable'>('grid');
  
  // Filtres
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Tri
  const [userSortField, setUserSortField] = useState<keyof User>('name');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Pagination produits
  const [productsToShow, setProductsToShow] = useState(6);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, productsData] = await Promise.all([
        userService.getUsers(),
        productService.getProducts()
      ]);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      // Simuler un petit délai pour montrer les skeletons
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  // Filtrer les utilisateurs à chaque changement
  useEffect(() => {
    if (userSearchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const searchTermLower = userSearchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTermLower) || 
        user.email.toLowerCase().includes(searchTermLower) || 
        user.role.toLowerCase().includes(searchTermLower)
      );
      setFilteredUsers(filtered);
    }
  }, [userSearchTerm, users]);

  // Gérer les filtres avancés pour produits
  const handleProductFilters = (filterValues: ProductFilterValues) => {
    let filtered = [...products];
    
    // Filtre par nom
    if (filterValues.name.trim() !== '') {
      const searchTermLower = filterValues.name.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filtre par catégorie
    if (filterValues.category) {
      filtered = filtered.filter(product => 
        product.category === filterValues.category
      );
    }
    
    // Filtre par prix
    filtered = filtered.filter(product => 
      product.price >= filterValues.priceMin && 
      product.price <= filterValues.priceMax
    );
    
    // Filtre stock
    if (filterValues.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    
    // Tri
    filtered.sort((a, b) => {
      const fieldA = a[filterValues.sortBy];
      const fieldB = b[filterValues.sortBy];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return filterValues.sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else if (fieldA instanceof Date && fieldB instanceof Date) {
        return filterValues.sortDirection === 'asc' 
          ? fieldA.getTime() - fieldB.getTime() 
          : fieldB.getTime() - fieldA.getTime();
      } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return filterValues.sortDirection === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      return 0;
    });
    
    setFilteredProducts(filtered);
  };

  // Trier les utilisateurs
  useEffect(() => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const fieldA = a[userSortField];
      const fieldB = b[userSortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return userSortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else if (fieldA instanceof Date && fieldB instanceof Date) {
        return userSortDirection === 'asc' 
          ? fieldA.getTime() - fieldB.getTime() 
          : fieldB.getTime() - fieldA.getTime();
      }
      
      return 0;
    });
    
    setFilteredUsers(sortedUsers);
  }, [userSortField, userSortDirection]);

  // Fonction pour changer le tri
  const handleSortChange = (field: keyof User) => {
    if (field === userSortField) {
      setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortDirection('asc');
    }
  };

  // Charger plus de produits
  const handleLoadMore = () => {
    setProductsToShow(prev => prev + 6);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Générer des skeleton cards pour le chargement
  const renderSkeletonProductCards = () => {
    return Array.from({ length: 6 }, (_, i) => (
      <SkeletonProductCard key={i} />
    ));
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Boilerplate Next.js avec App Router</h1>
      
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Utilisateurs</h2>
          <UserFormDialog onSuccess={loadData} />
        </div>

        {/* Barre de recherche utilisateurs */}
        <div className="mb-4 flex gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un utilisateur..." 
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trier par:</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSortChange('name')}
              className="flex items-center gap-1"
            >
              Nom
              {userSortField === 'name' && (
                userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSortChange('email')}
              className="flex items-center gap-1"
            >
              Email
              {userSortField === 'email' && (
                userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSortChange('createdAt')}
              className="flex items-center gap-1"
            >
              Date
              {userSortField === 'createdAt' && (
                userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Table des utilisateurs */}
        <div className="mb-8">
          {loading ? (
            <SkeletonUsersTable />
          ) : filteredUsers.length > 0 ? (
            <UsersTable users={filteredUsers} onUpdate={loadData} />
          ) : (
            <div className="p-8 text-center border rounded-md">
              <p className="text-muted-foreground">Aucun utilisateur trouvé.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Produits</h2>
          <div className="flex items-center gap-4">
            <Tabs defaultValue="grid" value={viewMode} onValueChange={(value: string) => setViewMode(value as 'grid' | 'draggable')}>
              <TabsList>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="draggable" className="flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  <span>Réorganiser</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ProductFormDialog onSuccess={loadData} />
          </div>
        </div>

        {/* Filtres des produits */}
        {viewMode === 'grid' && (
          <ProductFilters products={products} onFiltersChange={handleProductFilters} />
        )}

        {/* Affichage des produits */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletonProductCards()}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, productsToShow).map(product => (
                    <ProductCard key={product.id} product={product} onUpdate={loadData} />
                  ))}
                </div>
                {productsToShow < filteredProducts.length && (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore} variant="outline" className="flex items-center gap-2">
                      Voir plus
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <DraggableProductGrid products={filteredProducts} onUpdate={loadData} />
            )}
          </>
        ) : (
          <div className="p-8 text-center border rounded-md">
            <p className="text-muted-foreground">Aucun produit trouvé.</p>
          </div>
        )}
      </section>
    </main>
  );
}
