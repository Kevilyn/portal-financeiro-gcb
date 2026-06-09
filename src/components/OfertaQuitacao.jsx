import React from 'react';
import { Check, ArrowRight, Wallet, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currencyUtils';

const OfertaQuitacao = ({ originalValue, onOptionSelect, selectedOption }) => {
  const discountRate = 0.10; // 10%
  const discountedValue = originalValue * (1 - discountRate);
  const savings = originalValue * discountRate;

  return (
    <div className="w-full space-y-6">
       <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900">Escolha seu plano</h3>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
             Total Original: {formatCurrency(originalValue)}
          </span>
       </div>

       <div className="grid grid-cols-1 gap-4">
          {/* Option 1: Quitação à vista */}
          <div 
             onClick={() => onOptionSelect('vista')}
             className={cn(
               "relative group cursor-pointer border-2 rounded-xl p-5 transition-all duration-300 overflow-hidden",
               selectedOption === 'vista' 
                 ? "border-green-500 bg-green-50 shadow-md ring-1 ring-green-500" 
                 : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
             )}
          >
             {selectedOption === 'vista' && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-xl text-xs font-bold shadow-sm">
                   SELECIONADO
                </div>
             )}
             
             <div className="flex justify-between items-center mb-3 relative z-10">
                <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-lg", selectedOption === 'vista' ? "bg-green-200 text-green-800" : "bg-gray-100 text-gray-500")}>
                      <Wallet className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">Quitar à vista</h4>
                      <p className="text-sm text-green-600 font-medium">10% de desconto aplicado</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-400 line-through">{formatCurrency(originalValue)}</p>
                   <p className="text-2xl font-bold text-green-600">{formatCurrency(discountedValue)}</p>
                </div>
             </div>
             
             <div className="bg-white/60 p-2 rounded-lg text-sm text-green-800 flex items-center gap-2 border border-green-100/50">
                <Check className="w-4 h-4 bg-green-500 text-white rounded-full p-0.5" />
                Economize <strong>{formatCurrency(savings)}</strong> pagando hoje
             </div>
          </div>

          {/* Option 2: Parcelado */}
          <div 
             onClick={() => onOptionSelect('parcelado')}
             className={cn(
               "relative group cursor-pointer border-2 rounded-xl p-5 transition-all duration-300",
               selectedOption === 'parcelado' 
                 ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500" 
                 : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
             )}
          >
             {selectedOption === 'parcelado' && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-xl text-xs font-bold shadow-sm">
                   SELECIONADO
                </div>
             )}
             
             <div className="flex justify-between items-center mb-3 relative z-10">
                <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-lg", selectedOption === 'parcelado' ? "bg-blue-200 text-blue-800" : "bg-gray-100 text-gray-500")}>
                      <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">Parcelar Dívida</h4>
                      <p className="text-sm text-gray-500">Cabe no seu bolso</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-400">Total a prazo</p>
                   <p className="text-2xl font-bold text-blue-600">{formatCurrency(originalValue)}</p>
                </div>
             </div>

             <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Até 24x</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Entrada flexível</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default OfertaQuitacao;