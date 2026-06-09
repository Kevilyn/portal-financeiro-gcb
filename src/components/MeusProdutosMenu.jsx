import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Package, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAllProductsWithStatus } from '@/lib/productStatusUtils';
import { cn } from '@/lib/utils';

const MeusProdutosMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const menuRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProducts(getAllProductsWithStatus(user));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const getBadgeStyle = (color) => {
    const styles = {
      red: 'bg-red-100 text-red-700',
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      orange: 'bg-orange-100 text-orange-700',
      gray: 'bg-gray-100 text-gray-700'
    };
    return styles[color] || styles.gray;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#E31C23] transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
      >
        <Package className="w-4 h-4" />
        Meus Produtos
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Seus Produtos e Serviços
              </div>
              {products.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">Nenhum produto encontrado.</div>
              ) : (
                products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleNavigate(product.path)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-[#E31C23] transition-colors">
                        {product.name}
                      </span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full mt-1 font-semibold', getBadgeStyle(product.color))}>
                        {product.status}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#E31C23] transition-colors group-hover:translate-x-1" />
                  </button>
                ))
              )}
            </div>
            <div className="bg-gray-50 p-3 border-t border-gray-100">
              <button 
                onClick={() => handleNavigate('/dashboard/meus-produtos')}
                className="text-sm font-bold text-[#0066CC] hover:underline w-full text-center"
              >
                Ver todos os detalhes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeusProdutosMenu;