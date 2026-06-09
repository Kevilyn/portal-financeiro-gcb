import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Banknote, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/currencyUtils';

const AdiantarParcelasFlow = ({ contract, onClose }) => {
  const [selectedParcelas, setSelectedParcelas] = useState([]);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('pix');

  // Filter only future installments from the contract history
  const futureParcelas = contract.history.filter(h => h.status !== 'Paga');

  const toggleParcela = (id) => {
    if (selectedParcelas.includes(id)) {
      setSelectedParcelas(selectedParcelas.filter(pid => pid !== id));
    } else {
      setSelectedParcelas([...selectedParcelas, id]);
    }
  };

  const calculateTotal = () => {
    const selected = futureParcelas.filter(p => selectedParcelas.includes(p.number));
    const rawTotal = selected.reduce((acc, curr) => acc + curr.value, 0);
    const discount = rawTotal * 0.10; // 10% discount
    return { rawTotal, discount, finalTotal: rawTotal - discount };
  };

  const { rawTotal, discount, finalTotal } = calculateTotal();

  const handlePayment = () => {
    toast({
      title: "Pagamento Confirmado!",
      description: `Pagamento de ${formatCurrency(finalTotal)} realizado com sucesso.`,
      className: "bg-green-50 border-green-200"
    });
    setStep(3); // Success step
  };

  if (step === 3) {
    return (
      <div className="text-center py-8">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Tudo certo!</h3>
        <p className="text-gray-600 mb-6">Suas parcelas foram adiantadas com sucesso.</p>
        <Button onClick={onClose} className="bg-[#E31C23] text-white hover:bg-[#c41a1f] w-full">
          Concluir
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="font-semibold text-gray-900 mb-4">Selecione as parcelas para adiantar:</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {futureParcelas.map((parcela) => (
              <div 
                key={parcela.number}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedParcelas.includes(parcela.number) ? 'border-[#E31C23] bg-red-50' : 'border-gray-200'
                }`}
                onClick={() => toggleParcela(parcela.number)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedParcelas.includes(parcela.number) ? 'bg-[#E31C23] border-[#E31C23]' : 'border-gray-400'}`}>
                    {selectedParcelas.includes(parcela.number) && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{parcela.number}ª Parcela</p>
                    <p className="text-xs text-gray-500">Vence em: {parcela.date}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-700">{formatCurrency(parcela.value)}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Valor original:</span>
              <span>{formatCurrency(rawTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Desconto (10%):</span>
              <span>- {formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total a pagar:</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <Button 
            onClick={() => setStep(2)} 
            disabled={selectedParcelas.length === 0}
            className="w-full mt-4 bg-[#E31C23] hover:bg-[#c41a1f] text-white"
          >
            Continuar para Pagamento
          </Button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="font-semibold text-gray-900 mb-4">Escolha a forma de pagamento:</h3>
          
          <div className="space-y-3 mb-6">
            {[
              { id: 'pix', label: 'Pix', icon: QrCode },
              { id: 'boleto', label: 'Boleto Bancário', icon: Banknote },
              { id: 'cartao', label: 'Cartão de Crédito', icon: CreditCard }
            ].map((pm) => (
              <div
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === pm.id ? 'border-[#E31C23] bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <pm.icon className={`w-5 h-5 mr-3 ${paymentMethod === pm.id ? 'text-[#E31C23]' : 'text-gray-500'}`} />
                <span className="font-medium text-gray-900">{pm.label}</span>
                {paymentMethod === pm.id && (
                  <div className="ml-auto w-3 h-3 rounded-full bg-[#E31C23]" />
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-xl mb-4 text-center">
             <span className="text-gray-600 text-sm">Total a pagar:</span>
             <p className="text-2xl font-bold text-[#E31C23]">{formatCurrency(finalTotal)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
            <Button onClick={handlePayment} className="bg-[#E31C23] hover:bg-[#c41a1f] text-white">Confirmar Pagamento</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdiantarParcelasFlow;