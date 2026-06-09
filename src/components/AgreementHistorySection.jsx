import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { History, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';

const AgreementHistorySection = ({ contract }) => {
  if (!contract) return null;

  const agreements = contract.acordos || [];
  const hasAgreements = agreements.length > 0;
  
  // Status Helpers
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'quebrado' || s === 'não pago') return (
      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md">
        <AlertOctagon className="w-3 h-3" /> Quebrado
      </span>
    );
    if (s === 'pago') return (
      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">
        <CheckCircle2 className="w-3 h-3" /> Pago
      </span>
    );
    if (s === 'em_negociacao' || s === 'em negociação') return (
      <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-md">
        <Clock className="w-3 h-3" /> Em Negociação
      </span>
    );
    return <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">{status}</span>;
  };

  const hasBroken = agreements.some(a => ['quebrado', 'não pago'].includes(a.status?.toLowerCase()));

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          Histórico de Acordos
        </h3>
        {hasBroken && (
           <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 animate-pulse">
             Atenção: Acordos anteriores não cumpridos
           </span>
        )}
      </div>

      {!hasAgreements ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 text-sm">
          Não existem acordos anteriores para este contrato.
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
           {hasBroken && (
             <div className="bg-red-50 p-3 border-b border-red-100 flex items-center gap-2 text-sm text-red-800">
               <AlertOctagon className="w-4 h-4" />
               Este contrato teve um acordo anterior que não foi cumprido.
             </div>
           )}
           
           <Accordion type="single" collapsible className="w-full">
             {agreements.map((agreement, index) => (
               <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 px-4">
                 <AccordionTrigger className="hover:no-underline py-4">
                   <div className="flex items-center justify-between w-full pr-4">
                     <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-gray-900">Versão {agreement.versao?.toString().padStart(2, '0')}</span>
                        <span className="text-xs text-gray-500">{new Date(agreement.data).toLocaleDateString('pt-BR')}</span>
                     </div>
                     <div className="flex items-center gap-4">
                       <span className="font-medium text-gray-700 text-sm hidden sm:block">
                         R$ {agreement.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                       </span>
                       {getStatusBadge(agreement.status)}
                     </div>
                   </div>
                 </AccordionTrigger>
                 <AccordionContent className="bg-gray-50 rounded-lg p-4 mb-2">
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Parcelas</p>
                        <p className="font-medium">{agreement.parcelas}x</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Valor Total</p>
                        <p className="font-medium">R$ {agreement.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                      {agreement.motivo && (
                        <div className="col-span-2 border-t pt-2 mt-2">
                          <p className="text-gray-500">Motivo / Obs</p>
                          <p className="font-medium text-gray-700">{agreement.motivo}</p>
                        </div>
                      )}
                   </div>
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
        </div>
      )}
    </div>
  );
};

export default AgreementHistorySection;