import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, Banknote, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/currencyUtils';

const CreditoPreAprovadoSection = () => {
  const { user, isOverdue, isSuspended } = useAuth();
  const navigate = useNavigate();

  // Hide if user has overdue contracts or is suspended
  if (isOverdue() || isSuspended()) return null;

  const creditLimit = user?.financialProfile?.creditLimit || 0;

  if (creditLimit <= 0) return null;

  const limitValue = formatCurrency(creditLimit);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">Crédito Pré-Aprovado</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-lg border border-red-100 p-6 relative overflow-hidden hover:shadow-xl transition-shadow">
          <div className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pré-aprovado
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Carnê Digital</h3>
          <p className="text-2xl font-black text-red-600 mb-4">{limitValue}</p>
          <p className="text-xs text-gray-500 mb-6 h-8">
            Compre agora e pague parcelado no Carnê Digital. *Sujeito à análise de crédito
          </p>
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm text-xs sm:text-sm"
              onClick={() => navigate('/dashboard/carne-digital')}
            >
              Solicitar Carnê
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
              onClick={() => navigate('/dashboard/carne-digital')}
            >
              Consultar
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 relative overflow-hidden hover:shadow-xl transition-shadow">
          <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pré-aprovado
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Banknote className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Empréstimo Pessoal</h3>
          <p className="text-2xl font-black text-blue-600 mb-4">{limitValue}</p>
          <p className="text-xs text-gray-500 mb-6 h-8">
            Dinheiro na conta rápido e fácil. *Sujeito à análise de crédito
          </p>
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs sm:text-sm"
              onClick={() => navigate('/dashboard/emprestimo')}
            >
              Solicitar Empréstimo
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
              onClick={() => navigate('/dashboard/emprestimo')}
            >
              Consultar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditoPreAprovadoSection;