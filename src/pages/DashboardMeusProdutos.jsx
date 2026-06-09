import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getAllProductsWithStatus } from '@/lib/productStatusUtils';
import Breadcrumb from '@/components/Breadcrumb';

const DashboardMeusProdutos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProducts = () => {
    setIsRefreshing(true);
    if (user) {
      setTimeout(() => {
        setProducts(getAllProductsWithStatus(user));
        setIsRefreshing(false);
      }, 500); // Simulate network delay
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'atraso') return p.color === 'red';
    if (filter === 'ativo') return p.color === 'green';
    return true;
  });

  const getBadgeStyle = (color) => {
    const styles = {
      red: 'bg-red-100 text-red-700 border-red-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[color] || styles.gray;
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Meus Produtos', path: '/dashboard/meus-produtos' }
  ];

  return (
    <>
      <Helmet>
        <title>Meus Produtos - Casas Bahia</title>
      </Helmet>

      <div className="max-w-6xl mx-auto pb-20">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-[#E31C23]" /> Meus Produtos
            </h1>
            <p className="text-gray-600 mt-2">Acompanhe todos os seus produtos e serviços contratados.</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="all">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="atraso">Em atraso</option>
            </select>
            <Button variant="outline" size="icon" onClick={loadProducts} disabled={isRefreshing}>
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>

        {products.length === 0 && !isRefreshing ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Você ainda não possui produtos ou serviços vinculados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow border-gray-200">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn('p-3 rounded-xl', product.color === 'red' ? 'bg-red-50 text-red-600' : product.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600')}>
                          <Package className="w-6 h-6" />
                        </div>
                        <span className={cn('text-xs px-2.5 py-1 rounded-full font-bold border', getBadgeStyle(product.color))}>
                          {product.status}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Atualizado em {new Date().toLocaleDateString('pt-BR')}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <Button 
                          className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-sm"
                          onClick={() => navigate(product.path)}
                        >
                          {product.status === 'Abrir Conta' ? 'Abrir Conta' : 'Ver Detalhes'}
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardMeusProdutos;