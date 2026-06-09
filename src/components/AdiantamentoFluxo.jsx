import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, QrCode, ScanBarcode as FileBarcode, DollarSign, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmationModal from '@/components/ConfirmationModal';
import ValueBreakdownModal from '@/components/ValueBreakdownModal';
import { formatCurrency } from '@/lib/currencyUtils';

const AdiantamentoFluxo = ({ contract, onClose }) => {
  const { calculateDiscount } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const futureInstallments = contract?.futureInstallments || [];

  const handleToggleInstallment = (idx) => {
    setSelectedInstallments(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      return [...prev, idx];
    });
  };

  const getCalculations = () => {
    const totalOriginal = selectedInstallments.reduce((acc, idx) => acc + futureInstallments[idx].value, 0);
    const discountRate = calculateDiscount(selectedInstallments.length);
    const discountAmount = totalOriginal * discountRate;
    const finalAmount = totalOriginal - discountAmount;
    
    return { 
        total: finalAmount, 
        original: totalOriginal, 
        discount: discountAmount, 
        interest: 0, 
        penalty: 0,
        discountRate 
    };
  };

  const calc = getCalculations();

  const handleConfirmPayment = () => {
    toast({
      title: "Solicitação Recebida!",
      description: "O código de pagamento foi enviado para seu e-mail.",
      duration: 5000,
      className: "bg-green-50 border-green-200"
    });
    onClose();
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            step === i ? 'bg-blue-600 text-white' : 
            step > i ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {step > i ? <Check className="w-4 h-4" /> : i}
          </div>
          {i < 4 && <div className={`w-12 h-1 mx-2 ${step > i ? 'bg-green-500' : 'bg-gray-100'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full max-h-[80vh] overflow-y-auto custom-scrollbar relative">
      <div className="sticky top-0 bg-white z-10 pt-4 pb-2 border-b mb-6">
        <h2 className="text-xl font-bold text-center mb-4">Adiantar Parcelas</h2>
        <StepIndicator />
      </div>

      <div className="flex-1 px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="font-bold text-lg mb-4">Selecione as parcelas:</h3>
              {futureInstallments.map((inst, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border mb-2 cursor-pointer transition-all ${selectedInstallments.includes(idx) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => handleToggleInstallment(idx)}>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={selectedInstallments.includes(idx)} />
                    <div>
                        <p className="font-bold text-gray-900">{inst.number}ª Parcela</p>
                        <p className="text-sm text-gray-500">Vence em {inst.date}</p>
                    </div>
                  </div>
                  <p className="font-bold">{formatCurrency(inst.value)}</p>
                </div>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="font-bold text-lg mb-2">Simulação de Desconto</h3>
              <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                 <div className="flex justify-between">
                    <span className="text-gray-600">Valor Original</span>
                    <span className="font-medium">{formatCurrency(calc.original)}</span>
                 </div>
                 <div className="flex justify-between text-green-600">
                    <span className="font-medium">Desconto ({(calc.discountRate * 100).toFixed(0)}%)</span>
                    <span className="font-bold">- {formatCurrency(calc.discount)}</span>
                 </div>
                 <div className="h-px bg-blue-200 my-2"></div>
                 <div className="flex justify-between text-lg">
                    <span className="font-bold text-blue-900">Total</span>
                    <span className="font-bold text-blue-900">{formatCurrency(calc.total)}</span>
                 </div>
                 <button onClick={() => setShowBreakdown(true)} className="text-xs text-blue-600 underline flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Ver detalhes do cálculo
                 </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="font-bold text-lg">Resumo</h3>
               <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <p className="font-bold mb-4">{contract.product}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(calc.total)}</p>
                  <p className="text-sm text-gray-500">Referente a {selectedInstallments.length} parcelas</p>
               </div>
            </motion.div>
          )}

          {step === 4 && (
             <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-bold text-lg">Pagamento</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                   <div className="flex items-center space-x-2 border p-4 rounded-xl">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex gap-2 items-center"><QrCode className="w-5 h-5"/> Pix</Label>
                   </div>
                   <div className="flex items-center space-x-2 border p-4 rounded-xl">
                      <RadioGroupItem value="boleto" id="boleto" />
                      <Label htmlFor="boleto" className="flex gap-2 items-center"><FileBarcode className="w-5 h-5"/> Boleto</Label>
                   </div>
                </RadioGroup>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t flex gap-3 z-10">
        <Button variant="outline" onClick={() => step === 1 ? setShowExitConfirm(true) : setStep(s => s - 1)} className="flex-1">
           {step === 1 ? 'Cancelar' : 'Voltar'}
        </Button>
        <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700" 
            disabled={(step === 1 && selectedInstallments.length === 0) || (step === 4 && !paymentMethod)}
            onClick={() => {
                if (step < 4) setStep(s => s + 1);
                else handleConfirmPayment();
            }}
        >
            {step === 4 ? 'Finalizar' : 'Continuar'}
        </Button>
      </div>

      <ConfirmationModal 
         isOpen={showExitConfirm}
         onClose={() => setShowExitConfirm(false)}
         onConfirm={onClose}
         title="Sair da simulação?"
         description="Se você sair agora, as opções selecionadas serão perdidas."
      />

      <ValueBreakdownModal 
         isOpen={showBreakdown}
         onClose={() => setShowBreakdown(false)}
         data={calc}
      />
    </div>
  );
};

export default AdiantamentoFluxo;