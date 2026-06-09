import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

// New Components
import DatePickerVencimento from '@/components/DatePickerVencimento';
import TermosAcordo from '@/components/TermosAcordo';
import FormaPagamento from '@/components/FormaPagamento';

const DashboardAdiantamento = () => {
  const { user, selectedContract, selectContract, recordAgreement } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractIdParam = searchParams.get('contract');
  
  // Initialize contract from URL if present
  useEffect(() => {
     if (contractIdParam && user?.contratos) {
         // Flexible ID matching
         const found = user.contratos.find(c => String(c.id) === String(contractIdParam) || String(c.numero) === String(contractIdParam));
         if (found) {
             selectContract(found);
         }
     }
  }, [contractIdParam, user]);

  // Selection State
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If no contract selected and no ID in URL, redirect
  if (!selectedContract && !contractIdParam) {
      return (
          <div className="max-w-4xl mx-auto py-12 text-center">
              <h2 className="text-xl font-bold mb-4">Nenhum contrato selecionado</h2>
              <Button onClick={() => navigate('/dashboard/adiantar-parcelas-lista')}>Voltar para Seleção</Button>
          </div>
      );
  }
  
  // Loading state while waiting for effect to select contract
  if (!selectedContract) return <div className="p-8 text-center">Carregando contrato...</div>;

  const pendingInstallments = selectedContract.parcelas?.filter(p => p.status !== 'paga') || [];

  const handleToggle = (id) => {
      const strId = String(id);
      setSelectedInstallments(prev => 
          prev.includes(strId) 
             ? prev.filter(item => item !== strId)
             : [...prev, strId]
      );
  };

  const calculateTotal = () => {
      const subtotal = pendingInstallments
        .filter(p => selectedInstallments.includes(String(p.id)))
        .reduce((sum, p) => sum + p.valor, 0);
      return subtotal * 0.95; // 5% Discount logic
  };

  const calculateOriginalTotal = () => {
      return pendingInstallments
        .filter(p => selectedInstallments.includes(String(p.id)))
        .reduce((sum, p) => sum + p.valor, 0);
  };

  const handleNextStep = () => {
      if (step === 1 && selectedInstallments.length === 0) {
          toast({ title: "Selecione parcelas", description: "Escolha ao menos uma parcela para adiantar.", variant: "destructive" });
          return;
      }
      if (step === 2 && !paymentMethod) {
          toast({ title: "Pagamento", description: "Selecione a forma de pagamento.", variant: "destructive" });
          return;
      }
      setStep(prev => prev + 1);
  };

  const handleFinalize = () => {
      if (!termsAccepted) return;
      
      const originalValue = calculateOriginalTotal();
      const finalValue = calculateTotal();
      
      // Record the agreement
      recordAgreement(selectedContract.id || selectedContract.numero, {
          type: 'Adiantamento',
          originalAmount: originalValue,
          agreedAmount: finalValue,
          discount: originalValue - finalValue,
          installmentsCount: selectedInstallments.length,
          paymentMethod: paymentMethod,
          newDueDate: new Date().toISOString() // Immediate
      });

      setIsSuccess(true);
      toast({ 
          title: "Adiantamento Confirmado!", 
          description: "Economia de 5% aplicada com sucesso." 
      });
  };

  return (
    <>
      <Helmet><title>Adiantamento de Parcelas</title></Helmet>

      <div className="max-w-3xl mx-auto pb-12">
        {isSuccess ? (
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
                 <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-blue-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Solicitação Recebida!</h2>
                 <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Você economizou <strong>5%</strong> nesta transação. O histórico foi salvo em "Meus Produtos".
                 </p>
                 <Button onClick={() => navigate('/dashboard/produtos')} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Voltar aos Meus Produtos
                 </Button>
            </motion.div>
        ) : (
            <div className="space-y-6">
                 {/* Header */}
                 <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <FastForward className="w-8 h-8 text-blue-200" />
                        <h1 className="text-2xl font-bold">Adiantamento com Desconto</h1>
                    </div>
                    <p className="text-blue-100">Antecipe parcelas do contrato <strong>{selectedContract.numero}</strong> e ganhe 5% de desconto automático.</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between px-4 text-sm text-gray-500 font-medium">
                    <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>1. Seleção</span>
                    <span className="w-8 h-0.5 bg-gray-200"></span>
                    <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>2. Pagamento</span>
                    <span className="w-8 h-0.5 bg-gray-200"></span>
                    <span className={step >= 3 ? "text-blue-600 font-bold" : ""}>3. Confirmação</span>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="divide-y">
                                    {pendingInstallments.length > 0 ? pendingInstallments.map((p) => (
                                        <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Checkbox 
                                                    id={`inst-${p.id}`} 
                                                    checked={selectedInstallments.includes(String(p.id))}
                                                    onCheckedChange={() => handleToggle(p.id)}
                                                    className="border-gray-300 data-[state=checked]:bg-blue-600"
                                                />
                                                <Label htmlFor={`inst-${p.id}`} className="cursor-pointer">
                                                    <p className="font-bold text-gray-900">Parcela {p.numero}</p>
                                                    <p className="text-sm text-gray-500">Vence em {new Date(p.dataVencimento).toLocaleDateString('pt-BR')}</p>
                                                </Label>
                                            </div>
                                            <span className="font-bold text-gray-900">R$ {p.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-gray-500">
                                            Não há parcelas pendentes para este contrato.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {selectedInstallments.length > 0 && (
                                <div className="bg-gray-900 text-white p-5 rounded-xl shadow-xl flex items-center justify-between sticky bottom-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total com desconto (5%)</p>
                                        <p className="text-2xl font-bold">R$ {calculateTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                                    </div>
                                    <Button onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-400 text-white font-bold h-10 px-6">
                                        Pagar Agora <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                            
                            <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard/adiantar-parcelas-lista')}>
                                Escolher outro contrato
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                         <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                             <h3 className="text-xl font-bold text-gray-900">Resumo do Pagamento</h3>
                             <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center text-green-900 border border-green-100">
                                 <span>Total a pagar ({selectedInstallments.length} parcelas)</span>
                                 <span className="text-xl font-bold">R$ {calculateTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                             </div>
                             
                             <FormaPagamento selectedMethod={paymentMethod} onPaymentMethodSelect={setPaymentMethod} />

                             <div className="flex justify-between pt-4">
                                 <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                                 <Button onClick={handleNextStep} disabled={!paymentMethod} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                                     Revisar <ArrowRight className="ml-2 w-4 h-4" />
                                 </Button>
                             </div>
                         </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                            <TermosAcordo onAcceptChange={setTermsAccepted} onConfirm={handleFinalize} />
                            <Button variant="ghost" onClick={() => setStep(2)} className="mt-4 text-gray-500">Voltar</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}
      </div>
    </>
  );
};

export default DashboardAdiantamento;