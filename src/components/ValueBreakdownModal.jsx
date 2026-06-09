import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator, Plus, Minus, Equal } from 'lucide-react';
import { formatCurrency } from '@/lib/currencyUtils';

const ValueBreakdownModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const { original, interest, penalty, discount, total } = data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Calculator className="w-5 h-5 text-blue-600" />
            Entenda o cálculo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center text-gray-600">
            <span>Valor Original</span>
            <span>{formatCurrency(original)}</span>
          </div>

          {(interest > 0 || penalty > 0) && (
            <div className="flex justify-between items-center text-red-600">
              <span className="flex items-center gap-1"><Plus className="w-3 h-3" /> Juros e Multa</span>
              <span>{formatCurrency(interest + penalty)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between items-center text-green-600 font-medium">
              <span className="flex items-center gap-1"><Minus className="w-3 h-3" /> Desconto Aplicado</span>
              <span>- {formatCurrency(discount)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 my-2 pt-2">
            <div className="flex justify-between items-center font-bold text-lg text-gray-900">
              <span className="flex items-center gap-1"><Equal className="w-4 h-4" /> Total a Pagar</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mt-4">
             O cálculo considera as taxas vigentes do seu contrato e os descontos da campanha atual.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValueBreakdownModal;