import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
import { ChevronLeft, ArrowRight, Settings2, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import useContractData from '@/hooks/useContractData';

// Components
import ContractDetailsCard from '@/components/ContractDetailsCard';
import SimuladorValor from '@/components/SimuladorValor';
import DatePickerVencimento from '@/components/DatePickerVencimento';
import AgreementPaymentOptions from '@/components/AgreementPaymentOptions'; 
import TermosRenegociacao from '@/components/TermosRenegociacao';
import PropostaAcordo from '@/components/PropostaAcordo';
import DicaInteligente from '@/components/DicaInteligente';
import AgreementConfirmation from '@/components/AgreementConfirmation';
import OpportunitiesSection from '@/components/OpportunitiesSection';
import OpportunityDetailsModal from '@/components/OpportunityDetailsModal';
import ModalFacaSuaProposta from '@/components/ModalFacaSuaProposta';
import FacaSuaPropostaButton from '@/components/FacaSuaPropostaButton';

const DashboardSimularAcordo = () => {
  const { isNewUser, createAgreement, recordAgreement } = useAuth();
  const navigate = useNavigate();
  const { contractId } = useParams();
  
  // Use custom hook to get contract data
  const { contract: selectedContract, loading } = useContractData(contractId);

  // Wizard State
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customProposalData, setCustomProposalData] = useState(null);
  const [createdAgreement, setCreatedAgreement] = useState(null);
  
  // UI State
  const [showCustomSimulator, setShowCustomSimulator] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [facaPropostaModalOpen, setFacaPropostaModalOpen] = useState(false);

  // Data State
  const [simulacao, setSimulacao] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);

  if (isNewUser()) return <div className="p-8 text-center text-gray-500">Funcionalidade indisponível para novos usuários.</div>;
  
  if (loading || !selectedContract) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const handleOpportunitySelect = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setDetailsModalOpen(true);
  };

  const handleOpportunityConfirm = (opportunity) => {
    setDetailsModalOpen(false);
    // Convert opportunity format to simulation format
    setSimulacao({
        valorTotal: opportunity.valorTotal,
        parcelas: opportunity.parcelas,
        valorParcela: opportunity.valorParcela,
        economia: opportunity.economia,
        economiaPorcentagem: opportunity.economiaPorcentagem,
        type: opportunity.type
    });
    setStep(2); // Move to Date selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (step === 1 && !simulacao) {
      toast({ title: "Simulação incompleta", description: "Escolha um plano ou simule um valor.", variant: "destructive" });
      return;
    }
    if (step === 2 && !dataSelecionada) {
      toast({ title: "Data obrigatória", description: "Selecione uma data de vencimento.", variant: "destructive" });
      return;
    }
    if (step === 3 && !paymentMethod) {
      toast({ title: "Pagamento obrigatório", description: "Escolha uma forma de pagamento.", variant: "destructive" });
      return;
    }
    if (step === 4 && !termosAceitos) {
      toast({ title: "Termos obrigatórios", description: "Você precisa aceitar os termos para prosseguir.", variant: "destructive" });
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    // Determine data source
    const finalData = customProposalData 
        ? {
            value: customProposalData.valor,
            installments: customProposalData.parcelas,
            dueDate: customProposalData.data,
            paymentMethod: 'boleto', // Default for custom proposal until refined
            originalValue: selectedContract.valorEmAberto,
            discount: selectedContract.valorEmAberto - customProposalData.valor,
            contractId: selectedContract.id,
            product: selectedContract.produto || selectedContract.product
          }
        : {
            value: simulacao.valorTotal,
            installments: simulacao.parcelas,
            dueDate: dataSelecionada,
            paymentMethod: paymentMethod,
            originalValue: selectedContract.valorEmAberto,
            discount: simulacao.economia,
            contractId: selectedContract.id,
            product: selectedContract.produto || selectedContract.product
          };

    // Create Agreement via Context (Global List)
    const newAgreement = createAgreement(finalData);
    
    // Also record specifically for product card history
    recordAgreement(selectedContract.id || selectedContract.numero, {
        type: 'Acordo',
        originalAmount: finalData.originalValue,
        agreedAmount: finalData.value,
        discount: finalData.discount,
        paymentMethod: finalData.paymentMethod,
        newDueDate: finalData.dueDate
    });

    if (newAgreement) {
        setCreatedAgreement(newAgreement);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        toast({ title: "Erro", description: "Falha ao criar acordo. Tente novamente.", variant: "destructive" });
    }
  };

  const handleCustomProposalSuccess = (proposalData) => {
      setCustomProposalData(proposalData);
      setFacaPropostaModalOpen(false);
      setStep(5); // Jump directly to Review step
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinished = () => {
    navigate('/dashboard/produtos'); // Redirect to products to see new status
  };

  const steps = [
    { num: 1, label: 'Plano' },
    { num: 2, label: 'Data' },
    { num: 3, label: 'Pagamento' },
    { num: 4, label: 'Termos' },
    { num: 5, label: 'Revisão' }
  ];

  return (
    <>
      <Helmet><title>Simular Acordo - Portal Financeiro</title></Helmet>

      <div className="max-w-6xl mx-auto pb-16 px-4">
        {/* Navigation Breadcrumb */}
        <Button variant="ghost" onClick={() => navigate('/dashboard/simular-acordo-lista')} className="mb-4 pl-0 text-gray-500 hover:text-blue-600 transition-colors">
           <ChevronLeft className="w-4 h-4 mr-1" /> Voltar à Seleção
        </Button>

        {isSuccess ? (
            <AgreementConfirmation 
                agreement={createdAgreement} 
                onNext={handleFinished} 
            />
        ) : (
            <div className="space-y-8">
                {/* 1. Contract Header Section */}
                <div>
                   <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">
                       Negociação de Dívida
                   </h1>
                   <p className="text-gray-500">
                       Encontramos as melhores condições para você regularizar seu contrato.
                   </p>
                </div>
                
                <DicaInteligente />
                
                <ContractDetailsCard contract={selectedContract} />

                {/* Main Content Area */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full relative overflow-hidden">
                    
                    {/* Stepper (Only show if not in custom proposal mode) */}
                    {!customProposalData && (
                        <div className="mb-10 px-2 max-w-4xl mx-auto w-full">
                            <div className="flex items-center justify-between relative z-10">
                                {steps.map((s) => (
                                <div key={s.num} className="flex flex-col items-center">
                                    <div 
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 
                                        ${step >= s.num ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-110' : 'bg-white border-gray-200 text-gray-400'}`}
                                    >
                                        {step > s.num ? "✓" : s.num}
                                    </div>
                                    <span className={`text-[10px] mt-2 font-bold uppercase tracking-wide transition-colors duration-300 ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                ))}
                            </div>
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -z-0 mx-8">
                                <div 
                                    className="h-full bg-blue-600 transition-all duration-500 ease-in-out" 
                                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Plan Selection */}
                            {step === 1 && !customProposalData && (
                                <motion.div key="step1" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                                    
                                    {!showCustomSimulator ? (
                                        <>
                                            <div className="flex items-center gap-2 mb-6">
                                                <Sparkles className="w-5 h-5 text-blue-600" />
                                                <h3 className="text-xl font-bold text-gray-900">Escolha seu Plano Ideal</h3>
                                            </div>

                                            <OpportunitiesSection 
                                                contract={selectedContract} 
                                                onSelectOpportunity={handleOpportunitySelect}
                                            />

                                            <div className="my-8 flex items-center gap-4">
                                                <div className="h-px bg-gray-100 flex-1"></div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">OU</span>
                                                <div className="h-px bg-gray-100 flex-1"></div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Advanced Mode Button */}
                                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center items-center text-center">
                                                    <Settings2 className="w-8 h-8 text-gray-400 mb-3" />
                                                    <h4 className="font-bold text-gray-800 mb-1">Simulador Detalhado</h4>
                                                    <p className="text-sm text-gray-500 mb-4">Escolha exatamente quanto quer pagar.</p>
                                                    <Button variant="outline" onClick={() => setShowCustomSimulator(true)} className="w-full">
                                                        Abrir Simulador
                                                    </Button>
                                                </div>

                                                {/* Custom Proposal Button (Standalone) */}
                                                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex flex-col justify-center items-center text-center">
                                                     <FacaSuaPropostaButton onClick={() => setFacaPropostaModalOpen(true)} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="max-w-2xl mx-auto">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                    <Settings2 className="w-5 h-5 text-blue-600" /> Simulador Detalhado
                                                </h3>
                                                <Button variant="ghost" size="sm" onClick={() => setShowCustomSimulator(false)}>
                                                    Voltar às opções
                                                </Button>
                                            </div>
                                            <SimuladorValor 
                                                contract={selectedContract} 
                                                onSimulationChange={setSimulacao}
                                            />
                                            <div className="mt-8 flex justify-end">
                                                <Button onClick={handleNextStep} disabled={!simulacao} className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold h-12 rounded-xl shadow-lg shadow-blue-200">
                                                    Continuar <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    
                                </motion.div>
                            )}

                            {/* STEP 2: Date Selection */}
                            {step === 2 && !customProposalData && (
                                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="max-w-3xl mx-auto">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Quando você pode pagar a entrada?</h3>
                                    <DatePickerVencimento selectedDate={dataSelecionada} onDateSelect={setDataSelecionada} />
                                    <div className="mt-10 flex justify-between">
                                        <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500">Voltar</Button>
                                        <Button onClick={handleNextStep} disabled={!dataSelecionada} className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold h-12 rounded-xl shadow-lg shadow-blue-200">
                                            Continuar para Pagamento <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Payment Method */}
                            {step === 3 && !customProposalData && (
                                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="max-w-2xl mx-auto">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Como deseja pagar?</h3>
                                    <AgreementPaymentOptions 
                                        selectedMethod={paymentMethod} 
                                        onSelect={setPaymentMethod}
                                        value={simulacao?.valorParcela || simulacao?.valorTotal}
                                        dueDate={dataSelecionada}
                                    />
                                    <div className="mt-10 flex justify-between">
                                        <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-500">Voltar</Button>
                                        <Button onClick={handleNextStep} disabled={!paymentMethod} className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold h-12 rounded-xl shadow-lg shadow-blue-200">
                                            Revisar Termos <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: Terms */}
                            {step === 4 && !customProposalData && (
                                <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="max-w-3xl mx-auto">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Termos do Acordo</h3>
                                    <TermosRenegociacao onAcceptChange={setTermosAceitos} />
                                    <div className="mt-10 flex justify-between">
                                        <Button variant="ghost" onClick={() => setStep(3)} className="text-gray-500">Voltar</Button>
                                        <Button onClick={handleNextStep} disabled={!termosAceitos} className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold h-12 rounded-xl shadow-lg shadow-blue-200">
                                            Revisar e Enviar <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: Final Review */}
                            {step === 5 && (
                                <motion.div key="step5" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-3xl mx-auto">
                                    <PropostaAcordo 
                                        simulacao={simulacao}
                                        customProposal={customProposalData}
                                        contrato={selectedContract}
                                        dataSelecionada={customProposalData ? customProposalData.data : dataSelecionada}
                                        formaPagamento={paymentMethod || (customProposalData ? 'Boleto Bancário' : '')}
                                        onPropostaSubmit={handleFinalSubmit}
                                    />
                                    
                                    <div className="mt-6 flex justify-center">
                                        {!customProposalData ? (
                                            <Button variant="ghost" onClick={() => setStep(4)} className="text-gray-500 hover:text-gray-800">
                                                Voltar e editar
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" onClick={() => { setCustomProposalData(null); setStep(1); }} className="text-gray-500 hover:text-gray-800">
                                                Cancelar e Começar Novamente
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        )}
      </div>

      <OpportunityDetailsModal 
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        opportunity={selectedOpportunity}
        contract={selectedContract}
        onConfirm={handleOpportunityConfirm}
      />

      <ModalFacaSuaProposta 
        isOpen={facaPropostaModalOpen}
        onClose={() => setFacaPropostaModalOpen(false)}
        contract={selectedContract}
        onSuccess={handleCustomProposalSuccess}
      />
    </>
  );
};

export default DashboardSimularAcordo;