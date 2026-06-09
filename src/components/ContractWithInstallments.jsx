import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, Calendar, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import InstallmentModal from '@/components/InstallmentModal';

const ContractWithInstallments = ({ contract }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'em_atraso': return 'bg-red-100 text-red-700 border-red-200';
      case 'em_dia': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
     switch(status) {
        case 'pendente': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pendente', icon: Clock };
        case 'paga': return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Paga', icon: CheckCircle };
        case 'atrasada': return { color: 'bg-red-100 text-red-800 border-red-200', label: 'Atrasada', icon: AlertCircle };
        default: return { color: 'bg-gray-100 text-gray-800', label: status, icon: Clock };
     }
  };

  const handleAdiantar = (inst) => {
    setSelectedInstallment(inst);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInstallment(null);
  };

  // Defensive check for contract existence
  if (!contract) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 transition-all hover:shadow-md">
        {/* Contract Header */}
        <div 
           className="p-5 cursor-pointer bg-white" 
           onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                 <Package className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-gray-900">{contract.produto || 'Produto Desconhecido'}</h3>
                 <p className="text-sm text-gray-500 font-mono">{contract.numero || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <span className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5", getStatusColor(contract.status))}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {contract.status === 'em_atraso' ? 'Em Atraso' : 'Em Dia'}
               </span>
               <div className="text-gray-400 bg-gray-50 p-2 rounded-full">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
               </div>
            </div>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
             <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Valor Original</p>
                <p className="font-semibold text-gray-900">R$ {(contract.valorOriginal || 0).toFixed(2)}</p>
             </div>
             <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Valor em Aberto</p>
                <p className="font-bold text-gray-900">R$ {(contract.valorEmAberto || 0).toFixed(2)}</p>
             </div>
             <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Próximo Vencimento</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                   <Calendar className="w-3 h-3 text-gray-400" />
                   {contract.proximoVencimento ? new Date(contract.proximoVencimento).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
             </div>
             <div className="flex items-end justify-end">
                <span className="text-xs text-blue-600 font-bold hover:underline">
                   {isExpanded ? 'Ocultar Detalhes' : 'Ver Parcelas'}
                </span>
             </div>
          </div>
        </div>

        {/* Expandable Installments Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 border-t border-gray-200"
            >
              <div className="p-5 space-y-3">
                 <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Parcelas do Contrato
                 </h4>
                 
                 {(contract.parcelas || []).map((inst) => {
                    const badge = getStatusBadge(inst.status);
                    const valor = inst.valor || 0;
                    const desconto = inst.desconto || 0;
                    const valorComDesconto = inst.valorComDesconto || valor;
                    
                    return (
                       <div key={inst.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4 w-full md:w-auto">
                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
                                {inst.numero}
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <p className="font-bold text-gray-900">Venc. {inst.dataVencimento ? new Date(inst.dataVencimento).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                   <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 uppercase", badge.color)}>
                                      <badge.icon className="w-3 h-3" /> {badge.label}
                                   </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                   Valor Original: R$ {valor.toFixed(2)}
                                </p>
                             </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                             <div className="text-right w-full md:w-auto">
                                {inst.diasAtraso > 0 && (
                                   <p className="text-xs text-red-600 font-bold flex items-center justify-end gap-1">
                                      <AlertCircle className="w-3 h-3" /> {inst.diasAtraso} dias de atraso
                                   </p>
                                )}
                                <div className="flex flex-col items-end">
                                   {inst.status === 'pendente' && (
                                      <span className="text-xs text-green-600 font-bold">
                                         Desconto: R$ {desconto.toFixed(2)}
                                      </span>
                                   )}
                                   <span className="text-lg font-bold text-gray-900">
                                      R$ {valorComDesconto.toFixed(2)}
                                   </span>
                                </div>
                             </div>
                             
                             {inst.status === 'pendente' && (
                                <Button 
                                   onClick={() => handleAdiantar(inst)}
                                   className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                >
                                   Adiantar Parcela
                                </Button>
                             )}
                          </div>
                       </div>
                    );
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InstallmentModal 
         isOpen={showModal} 
         onClose={handleCloseModal} 
         contract={contract} 
         installment={selectedInstallment} 
      />
    </>
  );
};

export default ContractWithInstallments;