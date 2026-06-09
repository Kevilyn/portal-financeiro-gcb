import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, AlertCircle, CheckCircle, Package, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const ContractDetailModal = ({ isOpen, onClose, contract }) => {
  if (!contract) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'em_atraso': return 'bg-red-100 text-red-800 border-red-200';
      case 'suspenso': return 'bg-red-100 text-red-800 border-red-200';
      case 'em_dia': return 'bg-green-100 text-green-800 border-green-200';
      case 'paga': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'em_atraso': return 'Em Atraso';
      case 'suspenso': return 'Suspenso';
      case 'em_dia': return 'Em Dia';
      case 'paga': return 'Quitado';
      case 'pendente': return 'A Vencer';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-blue-50 p-1.5 md:p-2 rounded-full">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg md:text-xl">Detalhes do Contrato</DialogTitle>
                <DialogDescription className="text-xs md:text-sm">{contract.numero}</DialogDescription>
              </div>
            </div>
            <Badge className={cn("text-xs md:text-sm px-2 md:px-3 py-1", getStatusColor(contract.status))}>
              {getStatusLabel(contract.status)}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="grid gap-4 md:gap-6">
            
            <section>
              <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">Informações Gerais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Card className="bg-gray-50 border-none shadow-sm">
                  <CardContent className="p-3 md:p-4 flex items-start gap-2 md:gap-3">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-500 font-medium">Produto</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{contract.produto}</p>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1">{contract.descricao}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-none shadow-sm">
                  <CardContent className="p-3 md:p-4 flex items-start gap-2 md:gap-3">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-500 font-medium">Contratação</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                         {new Date(contract.dataContratacao).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1">Categoria: {contract.categoria}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">Resumo Financeiro</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="bg-blue-50 p-3 md:p-4 rounded-xl">
                   <p className="text-[10px] md:text-xs text-blue-600 font-bold uppercase">Valor Original</p>
                   <p className="text-lg md:text-xl font-bold text-blue-900 mt-1">
                     R$ {contract.valorOriginal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                   </p>
                </div>
                <div className="bg-green-50 p-3 md:p-4 rounded-xl">
                   <p className="text-[10px] md:text-xs text-green-600 font-bold uppercase">Total Pago</p>
                   <p className="text-lg md:text-xl font-bold text-green-900 mt-1">
                     R$ {(contract.valorPago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                   </p>
                </div>
                <div className="bg-red-50 p-3 md:p-4 rounded-xl">
                   <p className="text-[10px] md:text-xs text-red-600 font-bold uppercase">Em Aberto</p>
                   <p className="text-lg md:text-xl font-bold text-red-900 mt-1">
                     R$ {contract.valorEmAberto?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                   </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Detalhamento de Parcelas</h3>
                <span className="text-[10px] md:text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                   {contract.parcelas?.length || 0} parcelas
                </span>
              </div>
              
              <div className="border rounded-xl overflow-hidden divide-y">
                 <div className="bg-gray-50 p-2 md:p-3 grid grid-cols-5 text-[10px] md:text-xs font-semibold text-gray-500 gap-2">
                    <div className="col-span-1">Vencimento</div>
                    <div className="col-span-2">Descrição</div>
                    <div className="col-span-1 text-right">Valor</div>
                    <div className="col-span-1 text-center">Status</div>
                 </div>
                 {contract.parcelas?.map((parcela) => (
                    <div key={parcela.id} className="p-2 md:p-3 grid grid-cols-5 items-center gap-2 hover:bg-gray-50 transition-colors text-xs md:text-sm">
                       <div className="col-span-1 font-medium text-gray-700">
                          {new Date(parcela.dataVencimento).toLocaleDateString('pt-BR')}
                       </div>
                       <div className="col-span-2 text-gray-600">
                          Parcela {parcela.numero} de {contract.totalParcelas}
                          {parcela.diasAtraso > 0 && (
                            <span className="block text-[10px] md:text-xs text-red-600 font-medium">
                              {parcela.diasAtraso} dias de atraso
                            </span>
                          )}
                       </div>
                       <div className="col-span-1 text-right font-bold text-gray-900">
                          R$ {parcela.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                       </div>
                       <div className="col-span-1 flex justify-center">
                          <span className={cn(
                             "px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-semibold flex items-center gap-1",
                             parcela.status === 'paga' ? "bg-green-100 text-green-700" :
                             parcela.status === 'pendente' && parcela.diasAtraso === 0 ? "bg-yellow-100 text-yellow-700" :
                             "bg-red-100 text-red-700"
                          )}>
                             {parcela.status === 'paga' && <CheckCircle className="w-2 h-2 md:w-3 md:h-3" />}
                             {parcela.status === 'pendente' && parcela.diasAtraso > 0 && <AlertCircle className="w-2 h-2 md:w-3 md:h-3" />}
                             {parcela.status === 'paga' ? 'Pago' : 
                              parcela.status === 'pendente' && parcela.diasAtraso === 0 ? 'A Vencer' : 'Atrasado'}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDetailModal;