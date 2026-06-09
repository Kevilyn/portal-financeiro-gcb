import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const QuickSimulator = ({ contract, onProceed }) => {
  const { calculateDiscount } = useAuth();
  const [advanceCount, setAdvanceCount] = useState(1);
  
  const future = contract?.futureInstallments || [];
  const max = future.length;
  
  if (max === 0) return null;

  const totalValue = future.slice(0, advanceCount).reduce((acc, curr) => acc + curr.value, 0);
  const discountRate = calculateDiscount(advanceCount);
  const discountVal = totalValue * discountRate;
  const finalVal = totalValue - discountVal;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600 fill-blue-600" />
        <h3 className="font-bold text-blue-900">Simulador Rápido</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Adiantar parcelas</span>
          <span className="font-bold text-blue-900">{advanceCount} de {max}</span>
        </div>
        <input 
            type="range" 
            min="1" 
            max={max} 
            value={advanceCount} 
            onChange={(e) => setAdvanceCount(parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <div className="flex justify-between items-end mb-6 bg-white/60 p-4 rounded-lg">
        <div>
          <p className="text-xs text-gray-500">Economia estimada</p>
          <p className="text-green-600 font-bold text-lg">R$ {discountVal.toFixed(2)}</p>
          <p className="text-[10px] text-green-700 font-medium bg-green-100 px-1.5 py-0.5 rounded-full w-fit">
            {(discountRate * 100).toFixed(0)}% OFF
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Valor final</p>
          <p className="text-2xl font-bold text-blue-900">R$ {finalVal.toFixed(2)}</p>
        </div>
      </div>

      <Button onClick={() => onProceed(advanceCount)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
        Confirmar e Adiantar <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default QuickSimulator;