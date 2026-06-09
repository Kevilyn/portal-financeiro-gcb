import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, List, Loader2, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';

const ModalFacaSuaProposta = ({ isOpen, onClose, contract, onSuccess }) => {
  const [step, setStep] = useState('form'); // form, analyzing, result
  const [result, setResult] = useState(null); // approved, rejected
  const [formData, setFormData] = useState({
    valor: '',
    parcelas: '1',
    data: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTimeout(() => {
          setStep('form');
          setResult(null);
          setFormData({ valor: '', parcelas: '1', data: '' });
      }, 200);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const amount = parseFloat(formData.valor);
    if (!formData.valor || isNaN(amount) || amount < 10) {
      toast({
        title: "Valor inválido",
        description: "O valor mínimo para proposta é R$ 10,00.",
        variant: "destructive"
      });
      return;
    }
    
    // Logic: Validate against contract debt if available
    if (contract && amount > contract.valorEmAberto) {
        toast({
            title: "Valor excede o débito",
            description: `Sua proposta não pode ser maior que o saldo devedor de ${formatCurrency(contract.valorEmAberto)}.`,
            variant: "destructive"
        });
        return;
    }

    if (!formData.data) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione uma data para o primeiro pagamento.",
        variant: "destructive"
      });
      return;
    }

    // Move to analyzing step
    setStep('analyzing');

    // Simulate analysis delay
    setTimeout(() => {
      // Logic: If offer > 30% of debt, approve. 
      const threshold = contract ? contract.valorEmAberto * 0.3 : 100;
      const isApproved = amount >= threshold;
      
      setResult(isApproved ? 'approved' : 'rejected');
      setStep('result');
    }, 2000);
  };

  const handleAccept = () => {
    toast({
      title: "Proposta aceita!",
      description: "Sua proposta foi processada com sucesso.",
      className: "bg-green-600 text-white border-none"
    });
    
    if (onSuccess) {
        onSuccess({
            valor: parseFloat(formData.valor),
            parcelas: parseInt(formData.parcelas),
            data: formData.data
        });
    }
  };

  const handleRetry = () => {
    setStep('form');
    setResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Faça sua Proposta
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full h-8 w-8"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[360px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Form */}
            {step === 'form' && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="bg-indigo-50 p-3 rounded-lg mb-4 text-xs text-indigo-700 leading-relaxed border border-indigo-100">
                    Dica: Ofertas com valores à vista têm maior chance de aprovação imediata.
                    {contract && <span className="block mt-1 font-bold">Saldo Devedor: {formatCurrency(contract.valorEmAberto)}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Valor da Entrada</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-bold text-lg">R$</span>
                    <Input
                      type="number"
                      name="valor"
                      value={formData.valor}
                      onChange={handleChange}
                      placeholder="0,00"
                      className="flex-1 h-11 text-lg font-semibold"
                      min="10"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Parcelas Restantes</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <List className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      name="parcelas"
                      value={formData.parcelas}
                      onChange={handleChange}
                      className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}x {formData.valor ? `de ${formatCurrency(parseFloat(formData.valor) / (i+1))}` : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Data do Pagamento</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="date"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4 h-11 font-bold shadow-lg shadow-indigo-200">
                  Analisar Proposta
                </Button>
              </motion.form>
            )}

            {/* Step 2: Analyzing */}
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-4 py-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                  <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mt-4">Analisando sua oferta...</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  Estamos verificando a viabilidade da sua proposta com nosso sistema inteligente.
                </p>
              </motion.div>
            )}

            {/* Step 3: Result */}
            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                {result === 'approved' ? (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700">Proposta Aprovada!</h3>
                    <div className="bg-green-50 p-4 rounded-lg w-full text-left border border-green-100 shadow-inner">
                      <div className="flex justify-between border-b border-green-200 pb-2 mb-2">
                        <span className="text-sm text-gray-600">Valor Total</span>
                        <span className="font-bold text-gray-900">{formatCurrency(parseFloat(formData.valor))}</span>
                      </div>
                      <div className="flex justify-between border-b border-green-200 pb-2 mb-2">
                        <span className="text-sm text-gray-600">Parcelamento</span>
                        <span className="font-bold text-gray-900">{formData.parcelas}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Vencimento</span>
                        <span className="font-bold text-gray-900">{new Date(formData.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <Button onClick={handleAccept} className="w-full bg-green-600 hover:bg-green-700 text-white h-11 font-bold shadow-lg shadow-green-200">
                      Confirmar e Gerar Acordo
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-2">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-700">Proposta Recusada</h3>
                    <p className="text-gray-600 text-sm">
                      Infelizmente não conseguimos aceitar este valor no momento. Tente aumentar o valor da entrada ou diminuir o número de parcelas.
                    </p>
                    <div className="flex flex-col gap-2 w-full mt-2">
                        <Button onClick={handleRetry} className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 font-bold">
                        Tentar Outro Valor
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="w-full text-gray-500">
                        Cancelar
                        </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalFacaSuaProposta;