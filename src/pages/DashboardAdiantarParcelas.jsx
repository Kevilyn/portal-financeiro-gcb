import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, CreditCard, Banknote, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const DashboardAdiantarParcelas = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const products = [
    { id: 'carne', name: 'Carnê Digital - iPhone 16 Pro', nextDue: '19/02/2026' },
    { id: 'cartao', name: 'Cartão Casas Bahia', nextDue: '25/02/2026' }
  ];

  const installments = [
    { id: 1, date: '19/02/2026', value: 337.00 },
    { id: 2, date: '19/03/2026', value: 337.00 },
    { id: 3, date: '19/04/2026', value: 337.00 },
    { id: 4, date: '19/05/2026', value: 337.00 },
  ];

  const toggleInstallment = (id) => {
    if (selectedInstallments.includes(id)) {
      setSelectedInstallments(selectedInstallments.filter(i => i !== id));
    } else {
      setSelectedInstallments([...selectedInstallments, id]);
    }
  };

  const calculateTotal = () => {
    const total = selectedInstallments.length * 337.00;
    const discount = total * 0.10; // 10% discount
    return { total, discount, final: total - discount };
  };

  const handleFinish = () => {
    setStep(5);
    toast({
      title: "Sucesso!",
      description: "Adiantamento realizado com sucesso.",
      className: "bg-green-50 border-green-200"
    });
  };

  return (
    <>
      <Helmet>
        <title>Adiantar Parcelas - Portal Financeiro Casas Bahia</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Adiantar Parcelas
          </h1>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-[#E31C23]' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Selecione o produto</h2>
              <div className="space-y-3">
                {products.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedProduct(p.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-all ${selectedProduct === p.id ? 'border-[#E31C23] bg-red-50' : 'border-gray-200'}`}
                  >
                    <div>
                      <p className="font-bold text-gray-900">{p.name}</p>
                      <p className="text-sm text-gray-500">Próximo vencto: {p.nextDue}</p>
                    </div>
                    {selectedProduct === p.id && <CheckCircle className="text-[#E31C23]" />}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedProduct}
                className="w-full mt-6 bg-[#E31C23] hover:bg-[#c41a1f] text-white"
              >
                Continuar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Selecione as parcelas</h2>
              <div className="space-y-3">
                {installments.map((inst) => (
                  <div 
                    key={inst.id}
                    onClick={() => toggleInstallment(inst.id)}
                    className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-all ${selectedInstallments.includes(inst.id) ? 'border-[#E31C23] bg-red-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 border rounded flex items-center justify-center ${selectedInstallments.includes(inst.id) ? 'bg-[#E31C23] border-[#E31C23]' : 'border-gray-300'}`}>
                        {selectedInstallments.includes(inst.id) && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-gray-900 font-medium">Vencimento {inst.date}</span>
                    </div>
                    <span className="font-bold">R$ {inst.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Voltar</Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={selectedInstallments.length === 0}
                  className="flex-1 bg-[#E31C23] hover:bg-[#c41a1f] text-white"
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Revisão e Pagamento</h2>
              <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedInstallments.length} parcelas)</span>
                  <span>R$ {calculateTotal().total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Desconto (10%)</span>
                  <span>- R$ {calculateTotal().discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total a Pagar</span>
                  <span>R$ {calculateTotal().final.toFixed(2)}</span>
                </div>
              </div>

              <h3 className="font-semibold mb-3">Forma de Pagamento</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'pix', label: 'Pix', icon: QrCode },
                  { id: 'boleto', label: 'Boleto', icon: Banknote },
                  { id: 'cartao', label: 'Cartão', icon: CreditCard }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === pm.id ? 'border-[#E31C23] bg-red-50 text-[#E31C23]' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <pm.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{pm.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Voltar</Button>
                <Button 
                  onClick={() => setStep(4)} 
                  disabled={!paymentMethod}
                  className="flex-1 bg-[#E31C23] hover:bg-[#c41a1f] text-white"
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Termos e Condições</h2>
              <div className="bg-gray-50 p-4 rounded-xl h-48 overflow-y-auto mb-4 text-sm text-gray-600">
                <p>1. O adiantamento de parcelas concede desconto de 10% sobre o valor original.</p>
                <p className="mt-2">2. O pagamento deve ser efetuado até a data de vencimento do boleto ou código Pix gerado.</p>
                <p className="mt-2">3. Após a confirmação do pagamento, as parcelas selecionadas serão baixadas automaticamente em até 2 dias úteis.</p>
                <p className="mt-2">4. Esta operação é irreversível após o pagamento.</p>
              </div>
              
              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 mb-6">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 text-[#E31C23]" 
                />
                <span className="text-sm font-medium text-gray-900">Li e concordo com os termos apresentados</span>
              </label>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Voltar</Button>
                <Button 
                  onClick={handleFinish}
                  disabled={!termsAccepted}
                  className="flex-1 bg-[#E31C23] hover:bg-[#c41a1f] text-white"
                >
                  Finalizar
                </Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-xl shadow-lg text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sucesso!</h2>
              <p className="text-gray-600 mb-8">Seu pedido de adiantamento foi gerado. As informações de pagamento foram enviadas para seu e-mail.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="bg-[#E31C23] hover:bg-[#c41a1f] text-white w-full">
                  Voltar ao Início
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DashboardAdiantarParcelas;