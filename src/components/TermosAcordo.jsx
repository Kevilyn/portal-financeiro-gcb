import React, { useState, useEffect } from 'react';
import { Check, FileText, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const TermosAcordo = ({ onAcceptChange, onConfirm }) => {
  const [terms, setTerms] = useState({
    termosCondicoes: false,
    privacidade: false,
    debitoAutomatico: false,
    confirmacao: false
  });

  const allAccepted = Object.values(terms).every(Boolean);

  useEffect(() => {
    onAcceptChange(allAccepted);
  }, [terms, onAcceptChange, allAccepted]);

  const handleToggleAll = (checked) => {
    const newState = {
      termosCondicoes: !!checked,
      privacidade: !!checked,
      debitoAutomatico: !!checked,
      confirmacao: !!checked
    };
    setTerms(newState);
  };

  const handleToggleTerm = (key) => {
    setTerms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const termItems = [
    { key: 'termosCondicoes', title: 'Termos e Condições', desc: 'Concordo com os termos do acordo e condições de pagamento.' },
    { key: 'privacidade', title: 'Política de Privacidade', desc: 'Aceito o processamento dos meus dados para fins de cobrança.' },
    { key: 'debitoAutomatico', title: 'Débito Automático', desc: 'Autorizo o débito automático caso essa opção tenha sido selecionada.' },
    { key: 'confirmacao', title: 'Confirmação de Identidade', desc: 'Confirmo que sou o titular da conta e estou autorizado a realizar este acordo.' }
  ];

  return (
    <div className="w-full space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Termos e Finalização
        </h3>
        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 gap-2">
          <Download className="w-4 h-4" /> Baixar PDF
        </Button>
      </div>

      <div className="space-y-3">
        {/* Select All */}
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 transition-colors">
          <Checkbox 
            id="select-all" 
            checked={allAccepted}
            onCheckedChange={handleToggleAll}
            className="mt-1 border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="select-all" className="text-base font-bold text-blue-900 cursor-pointer">
              Aceitar todos os termos
            </Label>
            <p className="text-sm text-blue-700">
              Selecione para concordar com todos os requisitos listados abaixo.
            </p>
          </div>
        </div>

        {/* Individual Terms */}
        {termItems.map((item) => (
          <div 
            key={item.key}
            className={cn(
              "flex items-start space-x-3 p-3 rounded-lg border transition-all hover:bg-gray-50",
              terms[item.key] ? "border-green-200 bg-green-50/30" : "border-gray-100"
            )}
          >
            <Checkbox 
              id={item.key}
              checked={terms[item.key]}
              onCheckedChange={() => handleToggleTerm(item.key)}
              className="mt-1"
            />
            <div className="grid gap-1 leading-none">
              <Label htmlFor={item.key} className="font-semibold text-gray-700 cursor-pointer">
                {item.title}
              </Label>
              <p className="text-sm text-gray-500">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Warning if not accepted */}
      {!allAccepted && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>Por favor, aceite todos os termos para prosseguir.</span>
        </div>
      )}

      <Button 
        className={cn(
          "w-full h-12 text-lg font-bold transition-all duration-300",
          allAccepted 
            ? "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl text-white transform hover:-translate-y-0.5" 
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        )}
        disabled={!allAccepted}
        onClick={onConfirm}
      >
        {allAccepted ? (
           <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Confirmar e Finalizar</span>
        ) : (
           "Aguardando aceite..."
        )}
      </Button>
    </div>
  );
};

export default TermosAcordo;