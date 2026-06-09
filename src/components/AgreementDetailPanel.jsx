import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, CreditCard, RefreshCcw, FileText, ArrowLeft, Printer } from 'lucide-react';
import { formatCurrency } from '@/lib/currencyUtils';

import AgreementInstallmentsList from './AgreementInstallmentsList';
import AgreementPaymentHistory from './AgreementPaymentHistory';

const AgreementDetailPanel = ({ agreement, onBack }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!agreement) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
       <FileText className="w-16 h-16 mb-4 opacity-20" />
       <p className="text-lg font-medium">Selecione um acordo</p>
       <p className="text-sm">Clique em um item da lista para ver os detalhes completos.</p>
    </div>
  );

  // Mock installments if not present
  const installments = agreement.installmentsData || Array.from({length: agreement.installments || 1}).map((_, i) => ({
      id: i,
      numero: i + 1,
      valor: agreement.value / (agreement.installments || 1),
      dataVencimento: new Date(new Date(agreement.createdAt || Date.now()).setMonth(new Date().getMonth() + i)).toISOString(),
      status: i === 0 && agreement.status === 'paid' ? 'paga' : 'pendente'
  }));

  // Mock history
  const history = agreement.status === 'paid' ? [{
      date: new Date().toISOString(),
      amount: agreement.value,
      method: 'PIX',
      description: 'Pagamento Total'
  }] : [];

  return (
    <div className="h-full flex flex-col bg-white md:rounded-l-none md:rounded-r-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
         <div className="flex items-center gap-2 mb-4 md:hidden">
            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 text-gray-500">
               <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
         </div>

         <div className="flex justify-between items-start">
            <div>
               <h2 className="text-2xl font-bold text-gray-900">Acordo #{agreement.id}</h2>
               <p className="text-sm text-gray-500">Criado em {new Date(agreement.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
            </div>
            <Badge className={agreement.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
               {agreement.status === 'paid' ? 'Pago' : 'Ativo'}
            </Badge>
         </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
         <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 grid grid-cols-2 gap-4">
               <div>
                  <p className="text-xs text-gray-500 uppercase">Valor Total</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(agreement.value)}</p>
               </div>
               <div>
                  <p className="text-xs text-gray-500 uppercase">Próximo Vencimento</p>
                  <p className="text-xl font-bold text-gray-900">{agreement.dueDate ? new Date(agreement.dueDate).toLocaleDateString('pt-BR') : '---'}</p>
               </div>
            </div>

            <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
               <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="parcelas">Parcelas</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
               </TabsList>

               <TabsContent value="info" className="space-y-6">
                  <div className="space-y-4">
                     <h3 className="font-semibold text-gray-900">Dados do Contrato</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
                        <div className="flex flex-col">
                           <span className="text-gray-500">Produto</span>
                           <span className="font-medium">{agreement.product || 'Renegociação Geral'}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-gray-500">Forma de Pagamento</span>
                           <span className="font-medium capitalize">{agreement.paymentMethod || 'Boleto'}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-gray-500">Parcelamento</span>
                           <span className="font-medium">{agreement.installments}x</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-gray-500">Valor Original</span>
                           <span className="font-medium">{formatCurrency(agreement.originalValue || agreement.value * 1.2)}</span>
                        </div>
                     </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                     <h3 className="font-semibold text-gray-900">Documentos</h3>
                     <div className="flex flex-col gap-2">
                        <Button variant="outline" className="justify-start h-auto py-3">
                           <FileText className="w-4 h-4 mr-2 text-blue-600" />
                           <div className="text-left">
                              <p className="font-medium">Termo de Acordo.pdf</p>
                              <p className="text-xs text-gray-500">Assinado digitalmente</p>
                           </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3">
                            <Printer className="w-4 h-4 mr-2 text-gray-600" />
                            <div className="text-left">
                                <p className="font-medium">Boletos em Lote</p>
                                <p className="text-xs text-gray-500">Todas as parcelas</p>
                            </div>
                        </Button>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent value="parcelas">
                  <AgreementInstallmentsList installments={installments} />
               </TabsContent>

               <TabsContent value="historico">
                  <AgreementPaymentHistory history={history} />
               </TabsContent>
            </Tabs>
         </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 gap-3">
         <Button variant="outline" className="w-full border-gray-300">
            <RefreshCcw className="w-4 h-4 mr-2" /> Renegociar
         </Button>
         <Button className="w-full bg-[#E31C23] hover:bg-[#c41a1f] text-white">
            <CreditCard className="w-4 h-4 mr-2" /> Pagar Agora
         </Button>
      </div>
    </div>
  );
};

export default AgreementDetailPanel;