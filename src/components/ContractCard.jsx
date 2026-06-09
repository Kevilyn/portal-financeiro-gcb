import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, Package, DollarSign, Calendar, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';

const ContractCard = ({ contract, onSelectInstallment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!contract) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'em_atraso': return 'text-red-600 bg-red-50 border-red-200';
      case 'em_dia': return 'text-green-600 bg-green-50 border-green-200';
      case 'suspenso': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'em_atraso': return 'Em Atraso';
      case 'em_dia': return 'Em Dia';
      case 'suspenso': return 'Suspenso';
      default: return status;
    }
  };

  const getInstallmentStatus = (status, dueDate) => {
    const isLate = new Date(dueDate) < new Date() && status !== 'pago';
    if (status === 'pago') return { label: 'Pago', icon: CheckCircle, color: 'text-green-600 bg-green-50' };
    if (isLate) return { label: 'Atrasado', icon: AlertCircle, color: 'text-red-600 bg-red-50' };
    return { label: 'Pendente', icon: Clock, color: 'text-blue-600 bg-blue-50' };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{contract.produto || 'Produto'}</h3>
              <p className="text-sm text-gray-500 font-mono">{contract.numero || contract.contractNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
             <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Valor Aberto</p>
                <p className="font-bold text-gray-900">
                  {formatCurrency(contract.valorEmAberto || contract.valueOpen || 0)}
                </p>
             </div>
             
             <div className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5", getStatusColor(contract.status))}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {getStatusLabel(contract.status)}
             </div>

             <div className="text-gray-400">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50/50"
          >
            <div className="p-6 space-y-3">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Parcelas do Contrato
              </h4>
              
              {(!contract.parcelas && !contract.installments) ? (
                 <p className="text-sm text-gray-500 italic">Nenhuma parcela disponível.</p>
              ) : (
                (contract.parcelas || contract.installments).map((installment, idx) => {
                   const statusConfig = getInstallmentStatus(installment.status, installment.dueDate);
                   
                   return (
                     <div key={installment.id || idx} className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
                              {installment.number}
                           </div>
                           <div>
                              <p className="text-sm text-gray-500">Vencimento: <span className="text-gray-900 font-medium">{installment.dueDate ? new Date(installment.dueDate).toLocaleDateString('pt-BR') : 'N/A'}</span></p>
                              <p className="font-bold text-gray-900">{formatCurrency(installment.value || 0)}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                           <div className={cn("px-2 py-1 rounded text-xs font-bold flex items-center gap-1", statusConfig.color)}>
                              <statusConfig.icon className="w-3 h-3" />
                              {statusConfig.label}
                           </div>
                           
                           {installment.status !== 'pago' && (
                             <Button 
                               size="sm" 
                               onClick={() => onSelectInstallment(contract, installment)}
                               className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                             >
                                <FastForward className="w-3 h-3" /> Adiantar
                             </Button>
                           )}
                        </div>
                     </div>
                   );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContractCard;