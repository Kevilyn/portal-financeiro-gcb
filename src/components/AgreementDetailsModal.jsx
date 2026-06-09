import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, Download, X } from 'lucide-react';

const AgreementDetailsModal = ({ isOpen, onClose, agreement }) => {
  if (!agreement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
            <div className="flex justify-between items-start">
                <div>
                    <DialogTitle className="text-xl font-bold">Detalhes do Acordo</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Acordo #{agreement.id}</p>
                </div>
                <Badge className={agreement.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {agreement.status === 'paid' ? 'Pago' : 'Pendente'}
                </Badge>
            </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 pt-2">
            <div className="space-y-6">
                {/* Value Summary */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Valor Negociado</p>
                        <p className="text-xl font-bold text-gray-900">R$ {agreement.value?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Vencimento</p>
                        <p className="text-xl font-bold text-gray-900">{agreement.dueDate ? new Date(agreement.dueDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Resumo da Negociação</h4>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <span className="text-gray-500">Dívida Original:</span>
                        <span className="text-right font-medium">R$ {agreement.originalValue?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '---'}</span>
                        
                        <span className="text-gray-500">Desconto Aplicado:</span>
                        <span className="text-right font-medium text-green-600">- R$ {agreement.discount?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '---'}</span>
                        
                        <span className="text-gray-500">Forma de Pagamento:</span>
                        <span className="text-right font-medium capitalize">{agreement.paymentMethod}</span>
                        
                        <span className="text-gray-500">Parcelamento:</span>
                        <span className="text-right font-medium">{agreement.installments}x Parcelas</span>
                    </div>
                </div>

                {/* Installments Table */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Cronograma de Pagamentos</h4>
                    <div className="space-y-2">
                        {Array.from({ length: agreement.installments || 1 }).map((_, i) => (
                            <div key={i} className="flex justify-between text-sm py-1">
                                <span className="text-gray-600">{i + 1}ª Parcela</span>
                                <span className="font-medium">
                                    R$ {(agreement.value / (agreement.installments || 1)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Terms Footer */}
                <div className="text-xs text-gray-400 mt-8 pt-4 border-t">
                    <p>Este documento serve como comprovante da realização do acordo. A quitação definitiva ocorre após o pagamento de todas as parcelas.</p>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t bg-gray-50/50">
            <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Imprimir
            </Button>
            <Button variant="outline">
                <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button onClick={onClose} className="ml-2">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementDetailsModal;