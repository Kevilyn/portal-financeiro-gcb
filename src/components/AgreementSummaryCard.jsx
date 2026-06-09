import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';

const AgreementSummaryCard = ({ agreement, isSelected, onClick }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'paid': return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Pago' };
      case 'overdue': return { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Atrasado' };
      case 'active':
      case 'pending': return { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Ativo' };
      default: return { color: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Desconhecido' };
    }
  };

  const statusConfig = getStatusConfig(agreement.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(agreement)}
      className={cn(
        "cursor-pointer rounded-xl border p-4 transition-all duration-200 relative overflow-hidden",
        isSelected 
          ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500" 
          : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm"
      )}
    >
      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-gray-500 font-mono mb-1">#{agreement.id}</p>
          <h4 className="font-bold text-gray-900 line-clamp-1">{agreement.product || 'Acordo Geral'}</h4>
        </div>
        <Badge className={cn("text-xs font-bold border-0 flex items-center gap-1", statusConfig.color)}>
           <StatusIcon className="w-3 h-3" /> {statusConfig.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
         <div>
            <p className="text-xs text-gray-500 mb-0.5">Valor Total</p>
            <p className="font-bold text-gray-900">{formatCurrency(agreement.value)}</p>
         </div>
         <div>
            <p className="text-xs text-gray-500 mb-0.5">Vencimento</p>
            <p className={cn("font-medium", agreement.status === 'overdue' ? 'text-red-600' : 'text-gray-700')}>
               {agreement.dueDate ? new Date(agreement.dueDate).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
         </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
         <span className="text-xs text-gray-500">{agreement.installments}x parcelas</span>
         <ChevronRight className={cn("w-4 h-4 transition-transform", isSelected ? "text-blue-600 translate-x-1" : "text-gray-300")} />
      </div>
    </motion.div>
  );
};

export default AgreementSummaryCard;