import React, { useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TermosRenegociacao = ({ onAcceptChange, onConfirm }) => {
  const [hasReadBottom, setHasReadBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Check if scrolled to bottom (with small buffer)
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setHasReadBottom(true);
    }
  };

  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
    if (onAcceptChange) {
      onAcceptChange(checked);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-500" />
        <h3 className="font-bold text-gray-700">Termos e Condições do Acordo</h3>
      </div>

      <div 
        className="h-64 overflow-y-auto p-6 text-sm text-gray-600 leading-relaxed custom-scrollbar"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        <p className="mb-4">
          <strong>1. Objeto do Acordo:</strong> Este instrumento tem por objetivo a renegociação de débitos referentes ao contrato especificado, mediante as condições de pagamento (valor, prazo e juros) aceitas neste ato pelo CLIENTE.
        </p>
        <p className="mb-4">
          <strong>2. Do Pagamento:</strong> O CLIENTE compromete-se a quitar as parcelas nas datas de vencimento acordadas. O não pagamento da primeira parcela na data estipulada implicará no CANCELAMENTO imediato deste acordo, retornando a dívida ao seu valor original, acrescido de encargos contratuais.
        </p>
        <p className="mb-4">
          <strong>3. Da Quebra de Acordo:</strong> O atraso superior a 10 (dez) dias no pagamento de qualquer parcela subsequente à entrada poderá acarretar a rescisão deste acordo e o vencimento antecipado das parcelas vincendas.
        </p>
        <p className="mb-4">
          <strong>4. Dos Encargos:</strong> Em caso de atraso no pagamento das parcelas deste acordo, incidirão multa de 2% (dois por cento) e juros de mora de 1% (um por cento) ao mês, calculados pro rata die.
        </p>
        <p className="mb-4">
          <strong>5. Da Baixa de Restrição:</strong> A baixa de eventuais restrições nos órgãos de proteção ao crédito (SPC/Serasa) ocorrerá em até 5 (cinco) dias úteis após a compensação bancária do pagamento da primeira parcela ou parcela única.
        </p>
        <p className="mb-4">
          <strong>6. Disposições Gerais:</strong> O CLIENTE declara estar ciente de que este acordo não representa novação da dívida original até o efetivo pagamento.
        </p>
        <div className="h-4"></div> {/* Spacer for easier scrolling to bottom */}
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-start gap-3">
            <Checkbox 
                id="termos-check" 
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
                disabled={!hasReadBottom}
                className={cn(
                  "mt-1",
                  !hasReadBottom && "opacity-50 cursor-not-allowed"
                )}
            />
            <div className="grid gap-1.5 leading-none">
                <Label 
                    htmlFor="termos-check" 
                    className={cn(
                        "text-sm font-medium leading-snug cursor-pointer",
                        !hasReadBottom ? "text-gray-400" : "text-gray-900"
                    )}
                >
                    Li e concordo com os termos e condições da renegociação.
                </Label>
                {!hasReadBottom && (
                    <p className="text-[11px] text-orange-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Role até o fim do texto para habilitar o aceite.
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TermosRenegociacao;