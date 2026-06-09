import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CartaoCasasBahiaCard = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paga': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Atrasada': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAction = (action) => {
    toast({
      title: "Ação Iniciada",
      description: `Você clicou em: ${action}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-4 md:p-6 border border-gray-100 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#003DA5]/10 to-transparent rounded-bl-full -mr-8 md:-mr-10 -mt-8 md:-mt-10 pointer-events-none" />

      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#003DA5] to-[#002d7a] rounded-lg flex items-center justify-center text-white shadow-md">
            <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base md:text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Cartão Casas Bahia</h3>
            <p className="text-[10px] md:text-xs text-gray-500">Final 8842</p>
          </div>
        </div>
        <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border ${getStatusColor(data.status)}`}>
          {data.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
          <p className="text-[10px] md:text-xs text-gray-500 mb-1">Limite Disponível</p>
          <p className="font-bold text-gray-900 text-sm md:text-base lg:text-lg">R$ {data.availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="w-full bg-gray-200 h-1 md:h-1.5 rounded-full mt-2 overflow-hidden">
             <div 
               className="bg-green-500 h-full rounded-full" 
               style={{ width: `${(data.availableLimit / data.totalLimit) * 100}%` }} 
             />
          </div>
        </div>
        <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
          <p className="text-[10px] md:text-xs text-gray-500 mb-1">Fatura Atual</p>
          <p className="font-bold text-[#E31C23] text-sm md:text-base lg:text-lg">R$ {data.currentInvoice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center text-[10px] md:text-xs text-gray-500 mt-2">
            <Calendar className="w-2 h-2 md:w-3 md:h-3 mr-1" />
            Vence {data.dueDate}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => handleAction('Ver Fatura')} variant="outline" size="sm" className="flex-1 text-[10px] md:text-xs">
          Ver Fatura
        </Button>
        <Button onClick={() => handleAction('Pagar Fatura')} size="sm" className="flex-1 text-[10px] md:text-xs bg-[#003DA5] hover:bg-[#002d7a] text-white">
          Pagar Fatura
        </Button>
        {data.status === 'Atrasada' && (
           <Button onClick={() => handleAction('Negociar')} size="sm" className="flex-1 text-[10px] md:text-xs bg-[#E31C23] hover:bg-[#c41a1f] text-white">
             Negociar
           </Button>
        )}
      </div>
    </motion.div>
  );
};

export default CartaoCasasBahiaCard;