import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, TrendingDown, Layers, Calculator, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/currencyUtils';

const RenegotiationModal = ({ isOpen, onClose, contract }) => {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  if (!contract) return null;

  const options = [
    {
      id: 'extend',
      title: 'Estender Prazo',
      desc: 'Aumente o número de parcelas para reduzir o valor mensal.',
      icon: CalendarClock,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'reduce',
      title: 'Reduzir Valor Total',
      desc: 'Pague à vista com super desconto sobre juros e multa.',
      icon: TrendingDown,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'restructure',
      title: 'Reestruturar Parcelas',
      desc: 'Junte parcelas atrasadas em uma nova configuração.',
      icon: Layers,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'custom',
      title: 'Plano Personalizado',
      desc: 'Simule uma proposta que caiba no seu bolso.',
      icon: Calculator,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const handleConfirm = () => {
    toast({
      title: "Solicitação Enviada",
      description: "Um especialista analisará sua proposta em instantes.",
    });
    setTimeout(() => {
        onClose();
        setStep(1);
        setSelectedOption(null);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Renegociar Contrato</DialogTitle>
          <DialogDescription>
            Contrato: <span className="font-mono font-medium text-gray-700">{contract.numero}</span> • 
            Saldo Devedor: <span className="font-bold text-red-600">{formatCurrency(contract.valorEmAberto)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
           {step === 1 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                 <p className="text-sm text-gray-500 mb-4">Selecione uma das opções abaixo para visualizar as condições disponíveis para o seu perfil.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((opt) => (
                       <button
                          key={opt.id}
                          onClick={() => setSelectedOption(opt.id)}
                          className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left h-full ${
                             selectedOption === opt.id 
                             ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                             : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50'
                          }`}
                       >
                          <div className={`p-3 rounded-lg mb-3 ${opt.color}`}>
                             <opt.icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-bold text-gray-900">{opt.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 leading-snug">{opt.desc}</p>
                       </button>
                    ))}
                 </div>
              </motion.div>
           ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 text-center">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                       Simulação: {options.find(o => o.id === selectedOption)?.title}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                       Esta opção permite que você regularize sua situação com condições especiais. Selecione o número de parcelas desejado:
                    </p>
                    
                    <RadioGroup defaultValue="opt1" className="grid gap-3 max-w-sm mx-auto text-left">
                       <div className="flex items-center space-x-2 border p-3 rounded-lg bg-white">
                          <RadioGroupItem value="opt1" id="r1" />
                          <Label htmlFor="r1" className="flex-1 cursor-pointer">
                             <div className="flex justify-between font-medium">
                                <span>1x (À vista)</span>
                                <span className="text-green-600 font-bold">R$ 550,00</span>
                             </div>
                             <span className="text-xs text-green-600">Desconto de R$ 50,00</span>
                          </Label>
                       </div>
                       <div className="flex items-center space-x-2 border p-3 rounded-lg bg-white">
                          <RadioGroupItem value="opt2" id="r2" />
                          <Label htmlFor="r2" className="flex-1 cursor-pointer">
                             <div className="flex justify-between font-medium">
                                <span>3x de R$ 200,00</span>
                                <span>Total: R$ 600,00</span>
                             </div>
                             <span className="text-xs text-gray-500">Sem juros</span>
                          </Label>
                       </div>
                       <div className="flex items-center space-x-2 border p-3 rounded-lg bg-white">
                          <RadioGroupItem value="opt3" id="r3" />
                          <Label htmlFor="r3" className="flex-1 cursor-pointer">
                             <div className="flex justify-between font-medium">
                                <span>6x de R$ 110,00</span>
                                <span>Total: R$ 660,00</span>
                             </div>
                             <span className="text-xs text-gray-500">1.5% a.m.</span>
                          </Label>
                       </div>
                    </RadioGroup>
                 </div>
              </motion.div>
           )}
        </div>

        <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
           {step === 2 && (
              <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500">
                 Voltar
              </Button>
           )}
           <div className="flex-1 flex justify-end">
             {step === 1 ? (
                <Button 
                   onClick={() => setStep(2)} 
                   disabled={!selectedOption}
                   className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                   Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
             ) : (
                <Button 
                   onClick={handleConfirm}
                   className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                   Confirmar Acordo <Check className="ml-2 w-4 h-4" />
                </Button>
             )}
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenegotiationModal;