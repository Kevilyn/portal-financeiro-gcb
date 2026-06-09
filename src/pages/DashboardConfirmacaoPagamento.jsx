import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const DashboardConfirmacaoPagamento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  
  const { 
      contractNumber = 'N/A', 
      installmentNumber = 'N/A', 
      amount = 0, 
      paymentMethod = 'N/A',
      originalAmount = 0
  } = state;

  const savings = originalAmount - amount;

  return (
    <>
      <Helmet><title>Pagamento Confirmado</title></Helmet>
      
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
           <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Sua solicitação de adiantamento foi processada com sucesso.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 text-left">
           <h3 className="font-bold text-gray-800 border-b pb-4 mb-4">Resumo da Transação</h3>
           
           <div className="space-y-4">
              <div className="flex justify-between">
                 <span className="text-gray-500">Contrato</span>
                 <span className="font-medium text-gray-900">{contractNumber}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-gray-500">Parcela</span>
                 <span className="font-medium text-gray-900">#{installmentNumber}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-gray-500">Método de Pagamento</span>
                 <span className="font-medium text-gray-900 capitalize">{paymentMethod}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                 <span className="font-bold text-gray-800">Valor Pago</span>
                 <div className="text-right">
                    <span className="block font-bold text-2xl text-green-600">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    {savings > 0 && (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                           Você economizou R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    )}
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <Button 
             variant="outline" 
             onClick={() => navigate('/dashboard')}
             className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
           >
              <Home className="mr-2 w-4 h-4" /> Voltar ao Início
           </Button>
           <Button 
             onClick={() => navigate('/dashboard/comprovantes')}
             className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
           >
              <Receipt className="mr-2 w-4 h-4" /> Ver Comprovante
           </Button>
        </div>
      </div>
    </>
  );
};

export default DashboardConfirmacaoPagamento;