import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Loader2, CheckCircle, XCircle, ArrowRight, RefreshCw, Coins as HandCoins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const FacaSuaProposta = ({ contract, onSuccess, variant = 'default' }) => {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    valor: '',
    parcelas: '1',
    data: ''
  });
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const MIN_VALUE = 10.00;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(formData.valor);
    if (!formData.valor || isNaN(val) || val < MIN_VALUE) {
        toast({ title: "Valor inválido", description: `O valor mínimo é R$ ${MIN_VALUE.toFixed(2)}`, variant: "destructive" });
        return;
    }
    // For card variant, we might skip data check initially or use default
    if (variant === 'default' && !formData.data) {
        toast({ title: "Data obrigatória", description: "Selecione uma data de vencimento.", variant: "destructive" });
        return;
    }

    setStep('analyzing');
    
    setTimeout(() => {
        const isApproved = Math.random() < 0.7;
        setResult(isApproved ? 'approved' : 'rejected');
        setStep('result');
    }, 2000);
  };

  const handleAccept = () => {
     if (onSuccess) {
         onSuccess({
            id: `PRO-${Date.now()}`,
            contrato: contract,
            valor: parseFloat(formData.valor),
            parcelas: parseInt(formData.parcelas),
            data: formData.data || new Date().toISOString().split('T')[0],
            status: 'aprovado',
            validade: '24 horas'
         });
     }
  };

  const handleRetry = () => {
      setStep('form');
      setResult(null);
  };

  if (!contract) return null;

  // Render simplified Card version for grid layout
  if (variant === 'card') {
      return (
        <div className="flex flex-col h-full min-h-[380px] bg-white rounded-xl border border-gray-200 border-dashed hover:border-blue-300 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
             <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
             
             <div className="flex-1 flex flex-col p-5">
                <div className="flex flex-col items-center gap-3 mb-4">
                     <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Gavel className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-gray-900 text-center text-lg leading-tight">Faça sua Proposta</h4>
                     <span className="text-[10px] font-medium px-2 py-0.5 h-5 text-gray-400 uppercase tracking-wide">
                        Personalizado
                     </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                     <AnimatePresence mode="wait">
                        {step === 'form' ? (
                            <motion.form 
                                key="form-mini"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="w-full space-y-3"
                            >
                                <div className="text-center space-y-1 mb-2">
                                    <Label className="text-xs text-gray-500 uppercase font-semibold">Quanto quer pagar?</Label>
                                    <div className="relative max-w-[140px] mx-auto">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm z-10">R$</span>
                                        <Input 
                                            type="number" 
                                            placeholder="0,00"
                                            value={formData.valor}
                                            onChange={(e) => handleInputChange('valor', e.target.value)}
                                            className="pl-8 h-10 text-center font-bold text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <select 
                                        value={formData.parcelas}
                                        onChange={(e) => handleInputChange('parcelas', e.target.value)}
                                        className="h-9 rounded-md border border-gray-200 text-sm px-2 bg-white text-gray-600 focus:outline-none focus:border-blue-500"
                                    >
                                        {[1,2,3,4,5,6,10,12,24].map(n => <option key={n} value={n}>{n}x</option>)}
                                    </select>
                                    <Input 
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.data}
                                        onChange={(e) => handleInputChange('data', e.target.value)}
                                        className="h-9 text-xs px-1"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 mt-2">
                                    Analisar
                                </Button>
                            </motion.form>
                        ) : step === 'analyzing' ? (
                            <motion.div 
                                key="analyzing-mini"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center text-center py-4"
                            >
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                                <p className="text-sm font-medium text-gray-600">Negociando...</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="result-mini"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center text-center w-full"
                            >
                                {result === 'approved' ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                                        <h5 className="font-bold text-green-700 text-sm">Aprovada!</h5>
                                        <p className="text-xs text-gray-500 mb-3">R$ {parseFloat(formData.valor).toLocaleString('pt-BR', {minimumFractionDigits:2})} em {formData.parcelas}x</p>
                                        <Button onClick={handleAccept} size="sm" className="w-full bg-green-600 hover:bg-green-700 h-9 text-xs">
                                            Aceitar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-10 h-10 text-red-500 mb-2" />
                                        <h5 className="font-bold text-gray-700 text-sm">Recusada</h5>
                                        <Button onClick={handleRetry} variant="outline" size="sm" className="w-full mt-3 h-9 text-xs">
                                            Tentar Outro Valor
                                        </Button>
                                    </>
                                )}
                            </motion.div>
                        )}
                     </AnimatePresence>
                </div>
             </div>
        </div>
      );
  }

  // Original Layout (Default)
  return (
    <Card className="w-full h-full border-2 border-blue-100 shadow-lg bg-white overflow-hidden flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
           <Gavel className="w-5 h-5 md:w-6 md:h-6 text-blue-200" />
           Faça sua Proposta
        </CardTitle>
        <p className="text-blue-100 text-xs md:text-sm opacity-90">
            Defina quanto quer pagar e nós analisamos na hora.
        </p>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-center">
         <div className="text-center p-4">Use variant="card" for the new layout</div>
      </CardContent>
    </Card>
  );
};

export default FacaSuaProposta;