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
  Move,
  Users,
  ShoppingCart,
  TrendingUp,
  Package
} from 'lucide-react';
import { ProductFilters, ProductFilterValues } from '@/components/common/ProductFilters';
import { DraggableProductGrid } from '@/components/common/DraggableProductGrid';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonProductCard } from '@/components/common/SkeletonProductCard';
import { SkeletonUsersTable } from '@/components/common/SkeletonUsersTable';
import { motion, AnimatePresence } from 'framer-motion';

// Nouveaux composants modulaires pour le dashboard
import { StatsCard } from '@/components/common/dashboard/StatsCard';
import { DashboardTabs } from '@/components/common/dashboard/DashboardTabs';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Flag pour indiquer si c'est le chargement initial ou une mise à jour
  // Utilisé pour contrôler les animations (uniquement au premier chargement)
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  // Mode d'affichage des produits
  const [viewMode, setViewMode] = useState<'grid' | 'draggable'>('grid');
  
  // Filtres
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Tri
  const [userSortField, setUserSortField] = useState<keyof User>('name');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Pagination produits
  const [productsToShow, setProductsToShow] = useState(6);

  // Statistiques pour le dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    productsInStock: 0,
    lowStockProducts: 0,
  });
  
  // Animations pour les cartes de produits
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const loadData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setIsUpdating(true);
    }
    
    try {
      const [usersData, productsData] = await Promise.all([
        userService.getUsers(),
        productService.getProducts()
      ]);
      
      setUsers(usersData);
      setFilteredUsers(usersData);
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Calculer les statistiques pour le dashboard
      const productsInStock = productsData.filter(p => p.stock > 0).length;
      const lowStockProducts = productsData.filter(p => p.stock > 0 && p.stock < 10).length;
      
      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        productsInStock,
        lowStockProducts
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      if (isInitialLoad) {
        // Simuler un petit délai pour montrer les skeletons uniquement au chargement initial
        setTimeout(() => {
          setInitialLoading(false);
          setHasInitiallyLoaded(true);
        }, 100);
      } else {
        setIsUpdating(false);
      }
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
    loadData(true); // true indique que c'est le chargement initial
  }, []);

  // Générer des skeleton cards pour le chargement
  const renderSkeletonProductCards = () => {
    return Array.from({ length: 6 }, (_, i) => (
      <SkeletonProductCard key={i} />
    ));
  };

  return (
    <main className="container mx-auto py-8 px-4">
      {isUpdating && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </motion.div>
          <span>Mise à jour en cours...</span>
        </div>
      )}
      
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Boilerplate Next.js avec App Router
      </motion.h1>
      
      {/* Section Dashboard avec composants modulaires */}
      <section className="mb-12">
        <motion.h2 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Dashboard
        </motion.h2>
        
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Utilisateurs Totaux" 
            value={stats.totalUsers} 
            icon={Users} 
            isLoading={initialLoading}
            animationDelay={0.1}
            isInitialLoad={!hasInitiallyLoaded}
          />
          <StatsCard 
            title="Produits Totaux" 
            value={stats.totalProducts} 
            icon={Package} 
            isLoading={initialLoading}
            animationDelay={0.2}
            isInitialLoad={!hasInitiallyLoaded}
          />
          <StatsCard 
            title="Produits en Stock" 
            value={stats.productsInStock} 
            icon={ShoppingCart} 
            isLoading={initialLoading}
            animationDelay={0.3}
            isInitialLoad={!hasInitiallyLoaded}
          />
          <StatsCard 
            title="Stock Faible" 
            value={stats.lowStockProducts} 
            icon={TrendingUp} 
            isLoading={initialLoading}
            animationDelay={0.4}
            isInitialLoad={!hasInitiallyLoaded}
          />
        </div>
        
        {/* Tabs pour les graphiques */}
        <DashboardTabs 
          users={users} 
          products={products} 
          isLoading={initialLoading}
          isInitialLoad={!hasInitiallyLoaded}
        />
      </section>
      
      <motion.section 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Utilisateurs</h2>
          <UserFormDialog onSuccess={() => loadData(false)} />
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
          {initialLoading ? (
            <SkeletonUsersTable />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`users-${filteredUsers.length}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredUsers.length > 0 ? (
                  <UsersTable users={filteredUsers} onUpdate={() => loadData(false)} />
                ) : (
                  <div className="p-8 text-center border rounded-md">
                    <p className="text-muted-foreground">Aucun utilisateur trouvé.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
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
            <ProductFormDialog onSuccess={() => loadData(false)} />
          </div>
        </div>

        {/* Filtres des produits */}
        <AnimatePresence>
          {viewMode === 'grid' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductFilters products={products} onFiltersChange={handleProductFilters} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Affichage des produits */}
        <AnimatePresence mode="wait">
          {initialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSkeletonProductCards()}
            </div>
          ) : (
            <motion.div
              key={`products-${viewMode}-${filteredProducts.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <>
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredProducts.slice(0, productsToShow).map((product, index) => (
                          <motion.div 
                            key={product.id}
                            variants={cardVariants}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ProductCard product={product} onUpdate={() => loadData(false)} />
                          </motion.div>
                        ))}
                      </motion.div>
                      {productsToShow < filteredProducts.length && (
                        <motion.div 
                          className="flex justify-center mt-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Button onClick={handleLoadMore} variant="outline" className="flex items-center gap-2">
                            Voir plus
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <DraggableProductGrid products={filteredProducts} onUpdate={() => loadData(false)} />
                  )}
                </>
              ) : (
                <div className="p-8 text-center border rounded-md">
                  <p className="text-muted-foreground">Aucun produit trouvé.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </main>
  );
}
