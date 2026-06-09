import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  MessageSquare, 
  LogOut, 
  ChevronDown, 
  Home, 
  ShoppingBag, 
  FileText, 
  FastForward, 
  CreditCard, 
  HelpCircle,
  Menu as MenuIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Navigation items for mobile integration
  const navItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Meus Produtos', path: '/dashboard/produtos' },
    { icon: FileText, label: 'Simular Acordo', path: '/dashboard/simular-acordo' },
    { icon: FastForward, label: 'Adiantamento', path: '/dashboard/adiantamento' },
    { icon: CreditCard, label: 'Pagamentos', path: '/dashboard/pagamentos' },
    { icon: FileText, label: 'Comprovantes', path: '/dashboard/comprovantes' },
    { icon: HelpCircle, label: 'Ajuda', path: '/dashboard/ajuda' }
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 hover:bg-gray-50 text-gray-700 font-semibold px-3 md:px-4 py-2 rounded-lg transition-all border border-gray-200 shadow-sm h-10 md:h-11"
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="hidden md:inline">Menu</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-0 overflow-hidden bg-white border-gray-200 shadow-xl rounded-xl" align="end" sideOffset={8}>
        {/* SEÇÃO 1: Profile Active */}
        <div className="bg-blue-50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl shadow-sm border-2 border-white">
              {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-0.5">Perfil Ativo</p>
              <p className="font-bold text-gray-900 truncate text-lg leading-tight">
                {user?.nome || 'Usuário'}
              </p>
            </div>
          </div>
          <div className="inline-block bg-white/60 px-3 py-1 rounded-md border border-blue-100/50">
             <p className="text-xs text-gray-600 font-mono font-medium">
              CPF: {user?.cpf || '000.000.000-00'}
             </p>
          </div>
        </div>

        <div className="py-2">
          {/* Mobile Navigation Section - Visible only on small screens conceptually, but we include it here for the merged menu */}
          <div className="lg:hidden">
            <DropdownMenuLabel className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Navegação
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {navItems.map((item, idx) => (
                <DropdownMenuItem 
                  key={idx}
                  onClick={() => handleNavigate(item.path)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:text-blue-600"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2 bg-gray-100" />
          </div>

          {/* SEÇÃO 2: Profile Actions */}
          <DropdownMenuLabel className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Conta
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => handleNavigate('/dashboard/perfil')}
              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
            >
              <User className="w-4 h-4" /> Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleNavigate('/dashboard/configuracoes')}
              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
            >
              <Settings className="w-4 h-4" /> Configurações
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleNavigate('/dashboard/ajuda')}
              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
            >
              <MessageSquare className="w-4 h-4" /> Suporte
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </div>

        {/* SEÇÃO 3: Logout */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-2">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:bg-red-700 focus:text-white rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sair da Conta
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;