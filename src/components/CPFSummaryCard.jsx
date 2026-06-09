import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CPFSummaryCard = ({ data, onNext }) => {
  if (!data) return null;

  const getStatusConfig = (status) => {
    switch(status) {
      case 'em_dia':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          title: 'Tudo certo com seu CPF!',
          badge: 'Em dia',
          msg: 'Você tem parcelas a vencer e benefícios disponíveis.',
          action: 'Acessar minha conta'
        };
      case 'em_atraso':
        return {
          icon: AlertTriangle,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          title: 'Atenção ao seu CPF',
          badge: 'Em atraso',
          msg: 'Identificamos pendências que precisam da sua atenção.',
          action: 'Ver opções de acordo'
        };
      case 'suspenso':
        return {
          icon: Lock,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'Conta Suspensa',
          badge: 'Bloqueado',
          msg: 'Entre em contato para regularizar sua situação.',
          action: 'Resolver agora'
        };
      default: // novo
        return {
          icon: UserPlus,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          title: 'Bem-vindo!',
          badge: 'Novo Cliente',
          msg: 'Ainda não tem produtos ativos? Venha conhecer!',
          action: 'Criar cadastro grátis'
        };
    }
  };

  const config = getStatusConfig(data.status || 'novo');
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full p-6 rounded-2xl border-2 ${config.border} ${config.bg} shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-white ${config.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${config.color}`}>{config.title}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white border ${config.border} ${config.color}`}>
              {config.badge}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 font-medium mb-6">{config.msg}</p>
      
      {/* Dynamic Summary Data */}
      {data.produtosAtivos && data.produtosAtivos.length > 0 && (
         <div className="flex gap-4 mb-6 text-sm text-gray-600">
             <div className="bg-white/60 p-2 rounded-lg flex-1">
                 <span className="block font-bold text-gray-900">{data.produtosAtivos.length}</span>
                 Contratos
             </div>
             {data.overdueBalance && (
                <div className="bg-white/60 p-2 rounded-lg flex-1">
                    <span className="block font-bold text-red-600">R$ {data.overdueBalance}</span>
                    Em aberto
                </div>
             )}
         </div>
      )}

      <Button 
        onClick={onNext}
        className={`w-full h-12 text-lg font-bold text-white shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 ${
            data.status === 'em_atraso' ? 'bg-orange-600 hover:bg-orange-700' :
            data.status === 'suspenso' ? 'bg-red-600 hover:bg-red-700' :
            'bg-[#0066CC] hover:bg-[#0052a3]'
        }`}
      >
        {config.action} <ArrowRight className="w-5 h-5" />
      </Button>
    </motion.div>
  );
};

export default CPFSummaryCard;