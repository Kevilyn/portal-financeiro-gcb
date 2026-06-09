import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, Clock, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currencyUtils';

const ContractInstallmentList = ({ contract }) => {
  const navigate = useNavigate();
  const { setAdiantamentoAction } = useAuth();

  if (!contract || !contract.installments || contract.installments.length === 0) {
    return (
      <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 text-sm md:text-base">Nenhuma parcela encontrada para este contrato.</p>
      </div>
    );
  }

  const handleAdiantar = (installment) => {
    const value = installment.value || 0;
    const discountedValue = value * 0.9;
    
    setAdiantamentoAction({
      contractId: contract.id,
      contractNumber: contract.contractNumber,
      product: contract.product,
      installmentId: installment.id,
      installmentNumber: installment.number,
      actionType: 'adiantamento',
      originalValue: value,
      discountedValue: discountedValue,
      dueDate: installment.dueDate,
      status: installment.status
    });
    
    navigate('/dashboard/processar-adiantamento');
  };

  const getStatusConfig = (status, dueDate) => {
    const isLate = new Date(dueDate) < new Date() && status !== 'pago';
    
    if (status === 'pago') return { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Pago' };
    if (isLate) return { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, label: 'Em Atraso' };
    return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock, label: 'Pendente' };
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {contract.installments.map((installment, index) => {
        const config = getStatusConfig(installment.status, installment.dueDate);
        const value = installment.value || 0;
        
        return (
          <motion.div
            key={installment.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-100 rounded-lg p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4"
          >
            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
              <div className="bg-gray-100 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-gray-600 font-bold shrink-0 text-xs md:text-sm">
                {installment.number}
              </div>
              <div>
                <p className="text-[10px] md:text-sm text-gray-500">Vencimento</p>
                <div className="flex items-center gap-1 font-medium text-gray-900 text-xs md:text-base">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                  {installment.dueDate ? new Date(installment.dueDate).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <p className="text-[10px] md:text-sm text-gray-500">Valor</p>
                <p className="font-bold text-gray-900 text-sm md:text-base">
                  {formatCurrency(value)}
                </p>
              </div>

              <div className={cn("px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border flex items-center gap-1", config.color)}>
                <config.icon className="w-2 h-2 md:w-3 md:h-3" />
                {config.label}
              </div>
            </div>

            {installment.status === 'pendente' && (
              <Button 
                onClick={() => handleAdiantar(installment)}
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-1 md:gap-2 shadow-sm text-xs md:text-sm"
              >
                <FastForward className="w-3 h-3 md:w-4 md:h-4" />
                Adiantar Parcela
              </Button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ContractInstallmentList;