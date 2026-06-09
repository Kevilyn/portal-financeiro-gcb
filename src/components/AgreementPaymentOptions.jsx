import React from 'react';
import { CreditCard, QrCode, ScanBarcode as FileBarcode, Wallet, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/currencyUtils';

const AgreementPaymentOptions = ({ selectedMethod, onSelect, value, dueDate }) => {
  const options = [
    {
      id: 'pix',
      title: 'PIX (Instantâneo)',
      description: 'Aprovação imediata e liberação do limite em até 30 min.',
      icon: <QrCode className="w-6 h-6 text-teal-600" />,
      color: 'border-teal-200 bg-teal-50 hover:bg-teal-100',
      activeColor: 'border-teal-600 bg-teal-100 ring-1 ring-teal-600'
    },
    {
      id: 'boleto',
      title: 'Boleto',
      description: 'Pode levar até 3 dias úteis para compensar.',
      icon: <FileBarcode className="w-6 h-6 text-orange-600" />,
      color: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
      activeColor: 'border-orange-600 bg-orange-100 ring-1 ring-orange-600'
    },
    {
      id: 'banqi',
      title: 'Saldo BanQi',
      description: 'Pague direto com seu saldo da conta BanQi.',
      icon: <Wallet className="w-6 h-6 text-pink-600" />,
      color: 'border-pink-200 bg-pink-50 hover:bg-pink-100',
      activeColor: 'border-pink-600 bg-pink-100 ring-1 ring-pink-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Resumo do Pagamento</h3>
        <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor da Entrada / Parcela Única</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(value)}</span>
        </div>
        {dueDate && (
            <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600 text-sm">Vencimento</span>
                <span className="text-sm font-medium text-gray-900">{new Date(dueDate).toLocaleDateString('pt-BR')}</span>
            </div>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4",
              selectedMethod === option.id ? option.activeColor : `border-gray-100 bg-white hover:border-gray-200`
            )}
          >
            <div className="p-2 bg-white rounded-full shadow-sm shrink-0">
                {option.icon}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-gray-900">{option.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </div>
            {selectedMethod === option.id && (
                <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-5 h-5 text-gray-900" />
                </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgreementPaymentOptions;