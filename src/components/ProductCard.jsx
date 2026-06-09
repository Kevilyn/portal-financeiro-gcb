import React, { useState } from 'react';
import { 
  Package, 
  Calendar, 
  Wallet, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ contract, onViewDetails, onRenegotiate, onPayInstallment }) => {
  const { getProductAgreements } = useAuth();
  const [showAgreements, setShowAgreements] = useState(false);
  
  const isOverdue = contract.status === 'em_atraso' || contract.status === 'suspenso';
  const agreements = getProductAgreements(contract.id || contract.numero);
  const hasAgreements = agreements && agreements.length > 0;
  
  // Sort agreements by date desc
  const sortedAgreements = hasAgreements ? [...agreements].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
  const latestAgreement = sortedAgreements[0];

  return (
    <motion.div 
       layout
       className={cn(
        "bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md",
        isOverdue ? "border-red-100" : (hasAgreements ? "border-green-200" : "border-gray-100")
      )}
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
           <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-lg shrink-0", isOverdue ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                 <Package className="w-6 h-6" />
              </div>
              <div>
                 <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{contract.produto}</h3>
                    {isOverdue && (
                       <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Em Atraso
                       </span>
                    )}
                    {!isOverdue && (
                       <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Em Dia
                       </span>
                    )}
                 </div>
                 <p className="text-sm text-gray-500">Contrato: {contract.numero}</p>
                 
                 {/* Latest Agreement Status Badge */}
                 {hasAgreements && (
                     <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-100 rounded-md text-xs font-medium text-green-800">
                        <FileCheck className="w-3.5 h-3.5 text-green-600" />
                        <span>{latestAgreement.type === 'Adiantamento' ? 'Adiantamento realizado' : 'Acordo ativo'} em {new Date(latestAgreement.date).toLocaleDateString('pt-BR')}</span>
                     </div>
                 )}
              </div>
           </div>

           <div className="text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Valor Atual</p>
              <p className={cn("text-2xl font-bold", isOverdue ? "text-red-600" : "text-gray-900")}>
                 R$ {contract.valorEmAberto?.toLocaleString('pt-BR')}
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-b border-gray-50">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                 <Calendar className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-xs text-gray-500">Vencimento</p>
                 <p className={cn("text-sm font-semibold", isOverdue ? "text-red-600" : "text-gray-700")}>
                    {new Date(contract.proximoVencimento).toLocaleDateString('pt-BR')}
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                 <Wallet className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-xs text-gray-500">Parcelas</p>
                 <p className="text-sm font-semibold text-gray-700">
                    {contract.parcelas?.filter(p => p.status === 'pendente').length || 0} de {contract.totalParcelas} restantes
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                 <Clock className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-xs text-gray-500">Dias em Atraso</p>
                 <p className={cn("text-sm font-semibold", contract.diasAtraso > 0 ? "text-red-600" : "text-gray-700")}>
                    {contract.diasAtraso > 0 ? `${contract.diasAtraso} dias` : 'Nenhum'}
                 </p>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 justify-end">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(contract)}>
               Ver Detalhes
            </Button>
            
            {hasAgreements && (
                <Button variant="outline" size="sm" onClick={() => setShowAgreements(!showAgreements)} className="gap-1">
                   {showAgreements ? 'Ocultar Histórico' : 'Ver Histórico'}
                   {showAgreements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
            )}

            {isOverdue ? (
               <Button 
                 size="sm" 
                 onClick={() => onRenegotiate(contract)}
                 className="bg-red-600 hover:bg-red-700 text-white shadow-sm border-0"
               >
                  Negociar Dívida
               </Button>
            ) : (
               <Button 
                  size="sm"
                  onClick={() => onPayInstallment(contract.parcelas?.find(p => p.status === 'pendente'), contract.numero)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
               >
                  Pagar Parcela
               </Button>
            )}
        </div>
      </div>

      {/* Agreements History Section */}
      <AnimatePresence>
         {showAgreements && hasAgreements && (
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="bg-gray-50 border-t border-gray-100 px-6 py-4"
             >
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                   <FileCheck className="w-4 h-4 text-green-600" /> Histórico de Acordos
                </h4>
                <div className="space-y-3">
                   {sortedAgreements.map((agreement) => (
                      <div key={agreement.id} className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
                         <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-gray-800">{agreement.type || 'Renegociação'}</span>
                            <span className="text-gray-500 text-xs">{new Date(agreement.date).toLocaleDateString('pt-BR')}</span>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                            <div>
                               <p className="text-gray-400">Valor Original</p>
                               <p>R$ {agreement.originalValue?.toLocaleString('pt-BR') || agreement.originalAmount?.toLocaleString('pt-BR')}</p>
                            </div>
                            <div>
                               <p className="text-gray-400">Novo Valor</p>
                               <p className="font-semibold text-green-600">R$ {agreement.value?.toLocaleString('pt-BR') || agreement.agreedAmount?.toLocaleString('pt-BR')}</p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </motion.div>
         )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;