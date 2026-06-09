import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Wallet, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currencyUtils';

const PremiumContractCard = ({ contract, onClick }) => {
  if (!contract) return null;

  const getStatusConfig = () => {
    const status = contract.status;
    if (status === 'em_atraso' || status === 'suspenso') {
      return {
        label: 'Em Atraso',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
      };
    }
    return {
      label: 'Em Dia',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    };
  };

  const statusConfig = getStatusConfig();

  // Get next installment info
  const nextInstallment = contract.parcelas?.find(p => p.status !== 'paga');
  const nextDate = nextInstallment?.dataVencimento 
    ? new Date(nextInstallment.dataVencimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'N/A';
  const nextValue = nextInstallment?.valor || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 opacity-95"></div>
      
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
              <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            
            <div>
              <p className="text-xs md:text-sm font-medium text-blue-100 mb-1 uppercase tracking-wider">
                Contrato Principal
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                {contract.numero}
              </h3>
              <p className="text-sm md:text-base text-blue-100 font-medium">
                {contract.produto}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusConfig.borderColor} shrink-0 self-start sm:self-auto`}>
            {statusConfig.label}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20 mb-6"></div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Next Due Date */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-0.5 uppercase tracking-wide">Próximo Vencimento</p>
              <p className="text-base md:text-lg font-bold text-white">{nextDate}</p>
            </div>
          </div>

          {/* Installment Value */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-0.5 uppercase tracking-wide">Valor da Parcela</p>
              <p className="text-base md:text-lg font-bold text-white">{formatCurrency(nextValue)}</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          className="w-full bg-white hover:bg-blue-50 text-blue-900 font-bold py-3 md:py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group/btn h-auto text-sm md:text-base"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
        >
          <span className="flex items-center justify-center gap-2">
            Ver Detalhes Completos
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
      </div>
    </motion.div>
  );
};

export default PremiumContractCard;