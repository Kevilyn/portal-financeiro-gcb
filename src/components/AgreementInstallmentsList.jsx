import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currencyUtils';
import { QrCode, Download, Check } from 'lucide-react';

const AgreementInstallmentsList = ({ installments }) => {
  if (!installments || installments.length === 0) {
    return <div className="p-4 text-center text-gray-500 text-sm">Nenhuma parcela encontrada.</div>;
  }

  const getStatusBadge = (status) => {
      switch(status) {
          case 'paga': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Paga</Badge>;
          case 'vencida': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Vencida</Badge>;
          default: return <Badge variant="outline" className="text-blue-600 border-blue-200">Aberta</Badge>;
      }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((inst) => (
            <TableRow key={inst.id}>
              <TableCell className="font-medium">{inst.numero}</TableCell>
              <TableCell>{new Date(inst.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{formatCurrency(inst.valor)}</TableCell>
              <TableCell>{getStatusBadge(inst.status)}</TableCell>
              <TableCell className="text-right">
                 {inst.status === 'paga' ? (
                     <Button variant="ghost" size="sm" className="text-green-600 h-8 w-8 p-0">
                        <Check className="w-4 h-4" />
                     </Button>
                 ) : (
                     <div className="flex justify-end gap-2">
                         <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Boleto">
                             <Download className="w-4 h-4" />
                         </Button>
                         <Button size="sm" className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700" title="Pagar com PIX">
                             <QrCode className="w-4 h-4" />
                         </Button>
                     </div>
                 )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgreementInstallmentsList;