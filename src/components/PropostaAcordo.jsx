import React, { useState } from 'react';
import { Check, FileText, Calendar, CreditCard, ArrowRight, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const PropostaAcordo = ({ 
  simulacao, // From Standard Flow
  customProposal, // From "Faça sua Proposta" Flow
  contrato, 
  dataSelecionada, 
  formaPagamento, 
  onPropostaSubmit 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalize data based on source
  const finalData = customProposal 
    ? {
        valor: customProposal.valor,
        parcelas: customProposal.parcelas,
        data: customProposal.data,
        source: 'custom'
      }
    : {
        valor: simulacao?.valorTotal,
        parcelas: simulacao?.parcelas,
        data: dataSelecionada,
        source: 'standard'
      };

  // Validation logic
  const isValid = 
    contrato && 
    (
      (finalData.source === 'custom') || // Custom flow comes pre-validated
      (finalData.source === 'standard' && simulacao && dataSelecionada && formaPagamento) // Standard flow needs all steps
    );

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Proposta Enviada com Sucesso!",
      description: "Sua solicitação de acordo foi recebida e está em processamento.",
      className: "bg-green-50 border-green-200 text-green-900",
    });

    setIsSubmitting(false);
    onPropostaSubmit();
  };

  if (!contrato) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className={cn("shadow-lg border-t-4", customProposal ? "border-t-indigo-600" : "border-t-blue-600")}>
        <CardHeader className="pb-4 bg-gray-50/50">
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {customProposal ? <Award className="w-6 h-6 text-indigo-600" /> : <FileText className="w-6 h-6 text-blue-600" />}
                    {customProposal ? "Resumo da Proposta Personalizada" : "Resumo do Acordo"}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Confirme os detalhes abaixo para finalizar.</p>
            </div>
            {customProposal && (
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full border border-indigo-200">
                    OFERTA ESPECIAL
                </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* Section 1: Contract Info */}
          <div className="grid grid-cols-2 gap-4 text-sm border-b border-gray-100 pb-4">
            <div>
              <p className="text-gray-500 mb-1">Produto</p>
              <p className="font-semibold text-gray-900">{contrato.produto}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Saldo Original</p>
              <p className="font-semibold text-gray-900 line-through decoration-red-400">
                R$ {contrato.valorEmAberto?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Section 2: Values */}
          <div className={cn("p-4 rounded-lg border space-y-3", customProposal ? "bg-indigo-50/50 border-indigo-100" : "bg-blue-50/50 border-blue-100")}>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Final</span>
              <span className={cn("font-bold text-xl", customProposal ? "text-indigo-700" : "text-blue-700")}>
                R$ {finalData.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Parcelamento</span>
              <span className="font-medium text-gray-900">
                {finalData.parcelas}x de R$ {(finalData.valor / finalData.parcelas)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Section 3: Date & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white shadow-sm">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                   <Calendar className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-xs text-gray-500">Vencimento</p>
                   <p className="text-sm font-semibold text-gray-900">
                     {finalData.data ? new Date(finalData.data).toLocaleDateString('pt-BR') : <span className="text-red-400">Pendente</span>}
                   </p>
                </div>
             </div>

             <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white shadow-sm">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                   <CreditCard className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-xs text-gray-500">Pagamento via</p>
                   <p className="text-sm font-semibold text-gray-900 uppercase">
                     {formaPagamento || (customProposal ? "A definir no Boleto" : <span className="text-red-400">Pendente</span>)}
                   </p>
                </div>
             </div>
          </div>
          
          <div className="pt-2">
            {!isValid && (
              <p className="text-center text-sm text-red-500 mb-3 bg-red-50 p-2 rounded flex items-center justify-center gap-2">
                 <span className="w-2 h-2 bg-red-500 rounded-full"></span> Preencha todas as etapas anteriores.
              </p>
            )}
            
            <Button 
              className={cn(
                "w-full h-14 text-lg font-bold shadow-lg transition-all rounded-xl",
                isValid 
                    ? (customProposal ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]" : "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02]") 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Gerando Boleto...
                </>
              ) : (
                <>
                  <Check className="w-6 h-6 mr-2" /> Confirmar Acordo
                </>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default PropostaAcordo;