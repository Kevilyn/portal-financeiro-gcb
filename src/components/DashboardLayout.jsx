import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import AssistenteCBIA from '@/components/AssistenteCBIA';
import Breadcrumb from '@/components/Breadcrumb';
import { 
  ShoppingBag, 
  CreditCard, 
  FileText, 
  HelpCircle, 
  FastForward, 
  Home,
  Briefcase
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname !== '/dashboard') return false;
    return location.pathname.startsWith(path);
  };

  const sidebarItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Meus Produtos', path: '/dashboard/produtos' },
    { icon: Briefcase, label: 'Meus Acordos', path: '/dashboard/acordos' }, // Consolidated
    { icon: FileText, label: 'Simular Acordo', path: '/dashboard/simular-acordo-lista' },
    { icon: FastForward, label: 'Adiantamento', path: '/dashboard/adiantar-parcelas-lista' },
    { icon: CreditCard, label: 'Pagamentos', path: '/dashboard/pagamentos' }, 
    { icon: FileText, label: 'Comprovantes', path: '/dashboard/comprovantes' },
    { icon: HelpCircle, label: 'Ajuda', path: '/dashboard/ajuda' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 relative">
      <Header />
      
      <div className="flex container mx-auto px-4 md:px-6 lg:px-8 gap-4 md:gap-6 lg:gap-8 py-6 md:py-8">
        <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 sticky top-28">
             <div className="mb-3 md:mb-4 pl-2">
                <Logo size="medium" link={true} to="/dashboard" className="m-0 p-0" />
             </div>
             
             <div className="mb-3 md:mb-4 px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] md:text-xs text-gray-500">Logado como:</p>
                <p className="text-xs md:text-sm font-bold text-gray-800 truncate">{user?.nome?.split(' ')[0]}</p>
             </div>

             <nav className="space-y-1">
               {sidebarItems.map((item, idx) => (
                  <Link 
                    key={idx} 
                    to={item.path}
                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base ${
                      isActive(item.path) 
                        ? 'bg-[#E31C23] text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#E31C23]'
                    }`}
                  >
                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
               ))}
             </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
           <Breadcrumb />
           <Outlet />
        </main>
      </div>

      <AssistenteCBIA />
    </div>
  );
};

export default DashboardLayout;