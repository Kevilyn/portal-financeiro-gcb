import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';

const ContractDetailsCard = ({ contract }) => {
  if (!contract) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'em_atraso': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'suspenso': return 'text-red-600 bg-red-50 border-red-200';
      case 'em_dia': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'em_atraso': return 'Em Atraso';
      case 'suspenso': return 'Suspenso';
      case 'em_dia': return 'Em Dia';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border-t-4 border-blue-600 p-6 mb-8 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <FileText size={120} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Contrato {contract.numero || contract.id || 'N/A'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{contract.produto || contract.product || 'Produto'}</p>
        </div>
        <div className={cn("px-4 py-2 rounded-full border font-bold text-sm flex items-center gap-2 mt-2 md:mt-0", getStatusColor(contract.status))}>
          {contract.status === 'suspenso' && <AlertCircle className="w-4 h-4" />}
          {contract.status === 'em_atraso' && <AlertTriangle className="w-4 h-4" />}
          {getStatusLabel(contract.status)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Valor Original</p>
          <p className="font-semibold text-gray-900">{formatCurrency(contract.valorOriginal)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Valor em Aberto</p>
          <p className="font-bold text-blue-600 text-lg">{formatCurrency(contract.valorEmAberto)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Próximo Vencimento</p>
          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            {contract.proximoVencimento ? new Date(contract.proximoVencimento).toLocaleDateString('pt-BR') : 'N/A'}
          </div>
        </div>
        {(contract.diasAtraso > 0) && (
           <div className="space-y-1">
             <p className="text-xs text-gray-500 uppercase tracking-wide">Dias em Atraso</p>
             <p className="font-bold text-red-600">{contract.diasAtraso} dias</p>
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContractDetailsCard;