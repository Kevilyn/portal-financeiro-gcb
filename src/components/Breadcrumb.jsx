import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap = {
    dashboard: 'Dashboard',
    produtos: 'Produtos',
    'carne-digital': 'Carnê Digital banQi',
    'cartao-casas-bahia': 'Cartão Casas Bahia',
    'banqi': 'banQi',
    perfil: 'Perfil',
    'simular-acordo': 'Simular Acordo',
    pagamentos: 'Pagamentos e Acordos',
    ajuda: 'Ajuda',
    'adiantar-parcelas': 'Adiantar Parcelas',
    'meus-produtos': 'Meus Produtos'
  };

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link to="/dashboard" className="flex items-center hover:text-[#E31C23] transition-colors">
        <Home className="w-4 h-4 mr-1" />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = routeNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

        if (value === 'dashboard') return null;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-gray-900">{name}</span>
            ) : (
              <Link to={to} className="hover:text-[#E31C23] transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;