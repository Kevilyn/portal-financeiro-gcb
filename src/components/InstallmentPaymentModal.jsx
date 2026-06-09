import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, QrCode, Barcode, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/currencyUtils';

const InstallmentPaymentModal = ({ isOpen, onClose, installment, contractNumber }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('pix');

  if (!installment) return null;

  const handleConfirm = () => {
    toast({
      title: "Pagamento Iniciado",
      description: `Processando pagamento via ${paymentMethod.toUpperCase()}...`,
    });
    setTimeout(() => {
        onClose();
        setStep(1); // Reset for next time
    }, 1500);
  };

  const methodDetails = {
    pix: { icon: QrCode, label: "Pix", desc: "Aprovação imediata" },
    credit: { icon: CreditCard, label: "Cartão de Crédito", desc: "Em até 3x sem juros" },
    boleto: { icon: Barcode, label: "Boleto", desc: "Até 2 dias úteis" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
             {step === 2 && (
                <button onClick={() => setStep(1)} className="hover:bg-gray-100 p-1 rounded-full mr-1 transition-colors">
                   <ArrowLeft className="w-5 h-5" />
                </button>
             )}
             {step === 1 ? "Pagar Parcela" : "Confirmação"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
           {step === 1 ? (
             <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 py-2"
             >
                {/* Summary Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500 font-medium">Parcela {installment.numero}</span>
                      <span className="text-sm text-gray-500">{new Date(installment.dataVencimento).toLocaleDateString('pt-BR')}</span>
                   </div>
                   <div className="flex justify-between items-baseline">
                      <span className="text-gray-900 font-semibold">{contractNumber}</span>
                      <span className="text-2xl font-bold text-green-700">
                         {formatCurrency(installment.valorComDesconto)}
                      </span>
                   </div>
                   {installment.desconto > 0 && (
                      <div className="text-right text-xs text-green-600 mt-1 font-medium">
                         Economia de {formatCurrency(installment.desconto)}
                      </div>
                   )}
                </div>

                {/* Method Selection */}
                <div>
                   <h4 className="text-sm font-semibold text-gray-900 mb-3">Forma de Pagamento</h4>
                   <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-3">
                      {Object.entries(methodDetails).map(([key, info]) => {
                         const Icon = info.icon;
                         return (
                            <div key={key}>
                               <RadioGroupItem value={key} id={key} className="peer sr-only" />
                               <Label 
                                  htmlFor={key}
                                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-100 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all"
                               >
                                  <div className="flex items-center gap-3">
                                     <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                        <Icon className="w-5 h-5 text-gray-700" />
                                     </div>
                                     <div>
                                        <p className="font-semibold text-gray-900">{info.label}</p>
                                        <p className="text-xs text-gray-500">{info.desc}</p>
                                     </div>
                                  </div>
                               </Label>
                            </div>
                         );
                      })}
                   </RadioGroup>
                </div>
             </motion.div>
           ) : (
             <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-2"
             >
                <div className="text-center py-4">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      {React.createElement(methodDetails[paymentMethod].icon, { className: "w-8 h-8" })}
                   </div>
                   <h3 className="text-lg font-bold text-gray-900">Resumo do Pagamento</h3>
                   <p className="text-gray-500">Confira os dados antes de finalizar</p>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Valor da Parcela</span>
                      <span className="font-medium">{formatCurrency(installment.valor)}</span>
                   </div>
                   <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Descontos</span>
                      <span className="font-medium text-green-600">- {formatCurrency(installment.desconto)}</span>
                   </div>
                   <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Juros/Multa</span>
                      <span className="font-medium text-red-600">+ {formatCurrency(installment.juros || 0)}</span>
                   </div>
                   <div className="flex justify-between py-2 items-center">
                      <span className="font-bold text-lg text-gray-900">Total a Pagar</span>
                      <span className="font-bold text-xl text-blue-600">
                         {formatCurrency(installment.valorComDesconto)}
                      </span>
                   </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                   <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                   <p className="text-sm text-blue-800">
                      Ao confirmar, você será redirecionado para o ambiente seguro de pagamento.
                   </p>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        <DialogFooter>
           {step === 1 ? (
              <Button onClick={() => setStep(2)} className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700">
                 Continuar para Revisão
              </Button>
           ) : (
              <Button onClick={handleConfirm} className="w-full h-11 text-base bg-green-600 hover:bg-green-700">
                 Confirmar Pagamento
              </Button>
           )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstallmentPaymentModal;