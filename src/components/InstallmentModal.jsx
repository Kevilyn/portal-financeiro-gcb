import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentOptions from '@/components/PaymentOptions';
import PaymentSummary from '@/components/PaymentSummary';

const InstallmentModal = ({ isOpen, onClose, contract, installment }) => {
  const [step, setStep] = useState('payment');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !contract || !installment) return null;

  const handleNext = () => {
    if (selectedPayment) {
      setStep('summary');
    }
  };

  const handleBack = () => {
    setStep('payment');
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep('payment');
    setSelectedPayment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 md:p-4 flex items-center justify-between shrink-0">
          <h3 className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-200" />
            {step === 'payment' ? 'Adiantar Parcela' : 'Confirmar Pagamento'}
          </h3>
          <button onClick={handleClose} className="text-blue-100 hover:text-white hover:bg-blue-600/50 p-1 md:p-1.5 rounded-full transition-colors">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 'payment' ? (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PaymentOptions 
                  contract={contract} 
                  installment={installment} 
                  selectedPayment={selectedPayment}
                  onSelectPayment={setSelectedPayment}
                />
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <PaymentSummary 
                  contract={contract} 
                  installment={installment} 
                  paymentMethod={selectedPayment}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          {step === 'payment' ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                Cancelar
              </Button>
              <Button 
                size="sm"
                onClick={handleNext} 
                disabled={!selectedPayment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6"
              >
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center gap-2">
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Voltar
              </Button>
              <Button 
                size="sm"
                onClick={handleConfirm} 
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 flex items-center gap-2"
              >
                {isProcessing ? 'Processando...' : (
                  <>
                    <Check className="w-3 h-3 md:w-4 md:h-4" /> Confirmar Pagamento
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InstallmentModal;