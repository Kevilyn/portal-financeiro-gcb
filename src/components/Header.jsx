import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  ExternalLink, 
  Smartphone, 
  Briefcase, 
  Package2 as Package 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import NotificationCenter from '@/components/NotificationCenter';
import MeusProdutosMenu from '@/components/MeusProdutosMenu';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicItems = [
    { label: 'Soluções', href: '/#solucoes' },
    { label: 'Benefícios', href: '/#beneficios' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Suporte', href: '/suporte' }
  ];

  const NavLink = ({ item, className }) => {
    if (item.href.startsWith('/#')) {
      return <a href={item.href} className={className}>{item.label}</a>;
    }
    return <Link to={item.href} className={className}>{item.label}</Link>;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-20 md:h-24 flex items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center -ml-2 md:-ml-4 gap-4">
          <Logo size="medium" link={true} to={isAuthenticated ? "/dashboard" : "/"} />
          
          {/* Quick Links on Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-gray-200 gap-4">
              <MeusProdutosMenu />
              <Link 
                to="/dashboard/acordos" 
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#E31C23] transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
              >
                <Briefcase className="w-4 h-4" /> Meus Acordos
              </Link>
            </div>
          )}
        </div>

        {/* Center/Right: Navigation or Menu */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <NotificationCenter />
            </div>
            <UserMenu />
            
            {/* Mobile Toggle inside Auth */}
            <button className="md:hidden p-2 text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              {publicItems.map((item, idx) => (
                <NavLink 
                  key={idx} 
                  item={item} 
                  className="text-sm lg:text-base text-gray-700 hover:text-[#E31C23] font-medium transition-colors"
                />
              ))}
              <div className="flex items-center gap-3 lg:gap-4 ml-4 border-l border-gray-200 pl-4">
                <a href="https://www.casasbahia.com.br" target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm text-gray-700 hover:text-[#E31C23] font-medium transition-colors flex items-center gap-1">
                  Loja Online <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="text-xs lg:text-sm text-[#0066CC] hover:text-[#0052a3] font-medium transition-colors flex items-center gap-1 border border-blue-100 rounded-full px-2 lg:px-3 py-1 bg-blue-50">
                  <Smartphone className="w-3 h-3 lg:w-4 lg:h-4" /> App Casas Bahia
                </a>
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-2 lg:gap-3 ml-4">
              <Button variant="outline" size="sm" className="border-[#E31C23] text-[#E31C23] hover:bg-[#E31C23] hover:text-white text-xs lg:text-sm" asChild>
                <Link to="/login?mode=register">Criar cadastro</Link>
              </Button>
              <Button size="sm" className="bg-[#E31C23] hover:bg-[#c41a1f] text-white text-xs lg:text-sm" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
            </div>

            <button className="md:hidden p-2 text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-white border-t border-gray-100 overflow-hidden shadow-lg z-40"
          >
            <div className="p-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/meus-produtos" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-gray-900 font-bold border-b border-gray-50 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#E31C23]" /> Meus Produtos
                  </Link>
                  <Link to="/dashboard/acordos" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-gray-900 font-bold border-b border-gray-50 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#E31C23]" /> Meus Acordos
                  </Link>
                  <div className="py-2"><NotificationCenter /></div>
                </>
              ) : (
                <>
                  {publicItems.map((item, idx) => (
                    <NavLink 
                      key={idx} 
                      item={item} 
                      className="block py-2 text-sm text-gray-700 font-medium border-b border-gray-50"
                    />
                  ))}
                  <a href="#" className="flex items-center gap-3 py-2 text-sm text-[#0066CC] font-medium">
                    <Smartphone className="w-5 h-5" /> Baixe o App
                  </a>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button variant="outline" size="sm" asChild><Link to="/login?mode=register">Cadastrar</Link></Button>
                    <Button size="sm" asChild className="bg-[#E31C23]"><Link to="/login">Entrar</Link></Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;