import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, QrCode, Banknote, CreditCard, ArrowLeft } from 'lucide-react';

const PagamentoEntradaFlow = ({ amount, onBack, onSuccess }) => {
  const [method, setMethod] = useState('');
  const [terms, setTerms] = useState({
    agreement: false,
    service: false,
    privacy: false,
    conduct: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const allTermsAccepted = Object.values(terms).every(Boolean);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const toggleTerm = (key) => {
    setTerms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para proposta
        </button>
        <h2 className="text-xl font-bold text-gray-900">Pagamento da Entrada</h2>
        <p className="text-gray-500 mt-1">Valor a pagar: <span className="font-bold text-[#E31C23]">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Escolha como pagar</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'pix', label: 'Pix (Aprovação imediata)', icon: QrCode },
              { id: 'boleto', label: 'Boleto Bancário', icon: Banknote },
              { id: 'cartao', label: 'Cartão de Crédito', icon: CreditCard }
            ].map((pm) => (
              <div
                key={pm.id}
                onClick={() => setMethod(pm.id)}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  method === pm.id ? 'border-[#E31C23] bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <pm.icon className={`w-5 h-5 mr-3 ${method === pm.id ? 'text-[#E31C23]' : 'text-gray-500'}`} />
                <span className="font-medium text-gray-900">{pm.label}</span>
                {method === pm.id && (
                  <div className="ml-auto w-4 h-4 bg-[#E31C23] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {method && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 p-4 rounded-xl space-y-3"
          >
            <h3 className="text-sm font-medium text-gray-700">Termos obrigatórios</h3>
            {[
              { key: 'agreement', label: 'Li e concordo com os termos do acordo' },
              { key: 'service', label: 'Aceito a descrição do serviço' },
              { key: 'privacy', label: 'Concordo com a política de privacidade' },
              { key: 'conduct', label: 'Aceito a conduta do usuário' }
            ].map((term) => (
              <label key={term.key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={terms[term.key]}
                  onChange={() => toggleTerm(term.key)}
                  className="w-4 h-4 text-[#E31C23] rounded border-gray-300 focus:ring-[#E31C23]"
                />
                <span className="text-sm text-gray-600">{term.label}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t">
        <Button
          onClick={handlePay}
          disabled={!method || !allTermsAccepted || isProcessing}
          className="w-full py-6 text-lg font-bold bg-[#E31C23] hover:bg-[#c41a1f] text-white rounded-xl shadow-lg shadow-red-100"
        >
          {isProcessing ? 'Processando...' : 'Confirmar Acordo'}
        </Button>
        <p className="text-xs text-center text-gray-400 mt-3">
          Ambiente seguro e criptografado
        </p>
      </div>
    </div>
  );
};

export default PagamentoEntradaFlow;