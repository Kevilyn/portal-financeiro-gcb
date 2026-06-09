import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Copy, Download, CreditCard, Barcode, CheckCircle } from 'lucide-react';

const ProcessarAdiantamento = () => {
  const navigate = useNavigate();
  const { getAdiantamentoContext, clearAdiantamentoContext } = useAuth();
  const [context, setContext] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null); // 'pix', 'cartao', 'boleto'
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState('mastercard');

  useEffect(() => {
    const data = getAdiantamentoContext();
    if (!data) {
      toast({
        variant: "destructive",
        title: "Erro de Contexto",
        description: "Nenhuma parcela selecionada para adiantamento.",
      });
      navigate('/dashboard/produtos');
      return;
    }
    setContext(data);
  }, [getAdiantamentoContext, navigate]);

  if (!context) return null;

  const handleBack = () => {
    clearAdiantamentoContext();
    navigate('/dashboard/produtos');
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard/confirmacao-pagamento', {
        state: {
          contractNumber: context.contractNumber,
          installmentNumber: context.installmentNumber,
          paymentMethod: selectedPayment,
          amount: context.discountedValue,
          originalAmount: context.originalValue,
          date: new Date().toISOString()
        }
      });
    }, 1500);
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText("00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Casas Bahia6008Sao Paulo62070503***6304E2CA");
    toast({
      title: "Código Copiado",
      description: "Código Pix copiado para a área de transferência.",
    });
  };

  const handleDownloadBoleto = () => {
    toast({
      title: "Download Iniciado",
      description: "O download do seu boleto começará em instantes.",
    });
  };

  return (
    <>
      <Helmet><title>Processar Adiantamento - Portal Financeiro</title></Helmet>
      
      <div className="max-w-3xl mx-auto pb-16">
        <Button variant="ghost" onClick={handleBack} className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Produtos
        </Button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Adiantar Parcela</h1>

        {/* Parcel Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Detalhes da Parcela</h2>
              <p className="text-sm text-gray-500">{context.product} - {context.contractNumber}</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              Parcela {context.installmentNumber}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Valor Original</p>
              <p className="text-gray-900 font-medium line-through">R$ {context.originalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Vencimento Original</p>
              <p className="text-gray-900 font-medium">{new Date(context.dueDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm text-green-600 font-bold mb-1">Valor com Desconto (10%)</p>
              <p className="text-2xl font-bold text-green-700">R$ {context.discountedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </motion.div>

        <h2 className="text-lg font-bold text-gray-900 mb-4">Escolha a forma de pagamento</h2>

        {/* Payment Options */}
        <div className="space-y-4 mb-8">
          
          {/* Pix */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`cursor-pointer border rounded-xl p-5 transition-all ${selectedPayment === 'pix' ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-blue-200'}`}
            onClick={() => setSelectedPayment('pix')}
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 mt-1 rounded-full border border-gray-300 flex items-center justify-center">
                {selectedPayment === 'pix' && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">Pix</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Aprovação Imediata</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Pague com QR Code ou Pix Copia e Cola. O reconhecimento é instantâneo.</p>
                
                {selectedPayment === 'pix' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white p-4 rounded-lg border border-gray-200 mt-2"
                  >
                     <p className="text-xs text-gray-500 mb-2 font-mono break-all bg-gray-50 p-2 rounded border">
                       00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Casas Bahia...
                     </p>
                     <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleCopyPixCode(); }} className="w-full gap-2">
                       <Copy className="w-4 h-4" /> Copiar Código Pix
                     </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Credit Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`cursor-pointer border rounded-xl p-5 transition-all ${selectedPayment === 'cartao' ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-blue-200'}`}
            onClick={() => setSelectedPayment('cartao')}
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 mt-1 rounded-full border border-gray-300 flex items-center justify-center">
                {selectedPayment === 'cartao' && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">Cartão de Crédito</span>
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">Parcele em até 3x sem juros no seu cartão.</p>
                
                {selectedPayment === 'cartao' && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     onClick={(e) => e.stopPropagation()}
                     className="mt-2"
                   >
                     <select 
                        className="w-full p-2 border rounded-md text-sm bg-white focus:border-blue-500 outline-none"
                        value={cardType}
                        onChange={(e) => setCardType(e.target.value)}
                     >
                        <option value="mastercard">Mastercard terminado em 8899</option>
                        <option value="visa">Visa terminado em 4455</option>
                        <option value="new">+ Adicionar novo cartão</option>
                     </select>
                   </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Boleto */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`cursor-pointer border rounded-xl p-5 transition-all ${selectedPayment === 'boleto' ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-blue-200'}`}
            onClick={() => setSelectedPayment('boleto')}
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 mt-1 rounded-full border border-gray-300 flex items-center justify-center">
                {selectedPayment === 'boleto' && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
              </div>
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">Boleto Bancário</span>
                    <Barcode className="w-4 h-4 text-gray-400" />
                 </div>
                 <p className="text-sm text-gray-500 mb-4">Pagamento aprovado em até 3 dias úteis.</p>
                 
                 {selectedPayment === 'boleto' && (
                    <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="mt-2"
                    >
                       <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDownloadBoleto(); }} className="w-full gap-2">
                          <Download className="w-4 h-4" /> Baixar Boleto
                       </Button>
                    </motion.div>
                 )}
              </div>
            </div>
          </motion.div>

        </div>

        <Button 
           onClick={handleConfirmPayment} 
           disabled={!selectedPayment || loading}
           className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
        >
           {loading ? 'Processando...' : 'Confirmar Pagamento'}
        </Button>
      </div>
    </>
  );
};

export default ProcessarAdiantamento;