import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import PagamentoEntradaFlow from './PagamentoEntradaFlow';

const NegociarDividaFlow = ({ debtAmount, onClose, onComplete, contractData }) => {
  const [step, setStep] = useState(1);
  const [downPayment, setDownPayment] = useState('');
  const [installments, setInstallments] = useState(3);
  const [dueDate, setDueDate] = useState('');
  
  // Use passed contract data or debtAmount fallback
  const totalDebt = contractData?.valueOpen || debtAmount || 2500.00;
  
  const minDownPayment = 10.00;
  const currentDownPayment = parseFloat(downPayment) || 0;
  const remainingBalance = totalDebt - currentDownPayment;
  const discount = remainingBalance * 0.10; // 10% discount on remaining
  const finalBalance = remainingBalance - discount;
  const installmentValue = installments > 0 ? finalBalance / installments : 0;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setStep(4); // Go to payment flow
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (step === 4) {
    return (
      <PagamentoEntradaFlow 
        amount={currentDownPayment} 
        onBack={() => setStep(3)}
        onSuccess={onComplete}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Negociar Dívida</h2>
          <span className="text-sm text-gray-500">Passo {step} de 3</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#E31C23]" 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-sm text-gray-600 mb-1">Total da Dívida {contractData ? `(Contrato ${contractData.contractNumber})` : ''}</p>
                <p className="text-2xl font-bold text-[#E31C23]">R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quanto você pode pagar de entrada?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="0,00"
                    min={minDownPayment}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#E31C23] focus:ring-2 focus:ring-[#E31C23]/20 outline-none text-lg font-bold text-gray-900"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Mínimo de R$ 10,00</p>
              </div>

              {currentDownPayment >= minDownPayment && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Saldo restante:</span>
                    <span className="font-bold">R$ {remainingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Em quantas vezes deseja parcelar o restante?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 9, 12].map((num) => (
                    <button
                      key={num}
                      onClick={() => setInstallments(num)}
                      className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
                        installments === num 
                          ? 'border-[#E31C23] bg-red-50 text-[#E31C23]' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Melhor dia para vencimento
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[5, 10, 15, 20, 25].map((day) => (
                    <button
                      key={day}
                      onClick={() => setDueDate(day)}
                      className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                        dueDate === day
                          ? 'border-[#E31C23] bg-[#E31C23] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-bold text-gray-900">Resumo da Proposta</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valor Original</span>
                    <span className="text-gray-900 line-through">R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Entrada</span>
                    <span className="text-green-600 font-medium">- R$ {currentDownPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Desconto (10%)</span>
                    <span className="text-green-600 font-medium">- R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-dashed pt-3 mt-2">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-gray-900">Total do Acordo</span>
                      <span className="text-xl font-bold text-[#E31C23]">R$ {finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">
                      {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t flex gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}
        <Button 
          onClick={handleNext} 
          disabled={step === 1 && currentDownPayment < minDownPayment || step === 2 && !dueDate}
          className="flex-1 bg-[#E31C23] hover:bg-[#c41a1f] text-white"
        >
          {step === 3 ? 'Confirmar e Pagar Entrada' : 'Continuar'}
          {step < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default NegociarDividaFlow;