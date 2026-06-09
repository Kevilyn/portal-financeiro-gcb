import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Calendar, DollarSign, ArrowRight, X, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';

const OpportunityDetailsModal = ({ isOpen, onClose, opportunity, contract, onConfirm }) => {
  if (!opportunity || !contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
        
        {/* Header - Simplified & Clean */}
        <div className="relative p-6 pb-2 text-center">
            <button 
                onClick={onClose} 
                className="absolute right-4 top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            >
               <X className="w-4 h-4" />
            </button>

            <Badge variant="secondary" className="mb-3 px-3 py-1 bg-gray-100 text-gray-600 border-0">
                {opportunity.label}
            </Badge>
            
            <DialogTitle className="text-xl font-bold text-gray-900 mb-1">
                {opportunity.title}
            </DialogTitle>
            
            <p className="text-sm text-gray-500">
                Resumo da condição selecionada
            </p>
        </div>

        {/* Main Content - Center Aligned Comparator Style */}
        <div className="px-6 py-2 space-y-6">
            
            {/* Price Highlight */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Valor Total do Acordo</p>
                <div className="flex items-center justify-center gap-1 text-gray-900 mb-2">
                    <span className="text-4xl font-extrabold tracking-tight">
                        {formatCurrency(opportunity.valorTotal)}
                    </span>
                </div>
                
                {opportunity.desconto > 0 && (
                     <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <TrendingDown className="w-3 h-3" />
                        Economia de {formatCurrency(opportunity.desconto)}
                     </div>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl border border-gray-100 bg-white text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5">Parcelamento</p>
                    <p className="font-bold text-gray-900 text-sm">{opportunity.parcelas}x Parcelas</p>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 bg-white text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <DollarSign className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5">Valor Parcela</p>
                    <p className="font-bold text-gray-900 text-sm">
                        {formatCurrency(opportunity.valorParcela)}
                    </p>
                </div>
            </div>

            {/* Original Debt Comparison (Subtle) */}
            <div className="text-center pb-2">
                <p className="text-xs text-gray-400">
                    Dívida Original: <span className="line-through decoration-red-400">{formatCurrency(contract.valorEmAberto)}</span>
                </p>
            </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-white">
           <Button 
                onClick={() => onConfirm(opportunity)} 
                className={cn("w-full h-12 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-xl", opportunity.color)}
           >
              Confirmar e Prosseguir <ArrowRight className="w-4 h-4 ml-2" />
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailsModal;