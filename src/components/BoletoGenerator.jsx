import React, { useState } from 'react';
import { Copy, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const BoletoGenerator = ({ value, dueDate }) => {
  const { toast } = useToast();
  // Mock barcode
  const barcode = "34191.79001 01043.510047 91020.150008 8 91230000015000";

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(barcode.replace(/\s/g, '').replace(/\./g, ''));
    toast({
      title: "Código de barras copiado!",
      description: "Cole no seu aplicativo BanQi ou do seu banco para pagar.",
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="text-center">
        <h4 className="font-bold text-gray-900">Boleto</h4>
        <p className="text-sm text-gray-500">Vencimento em {new Date(dueDate).toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded text-center break-all font-mono text-sm border border-gray-300">
        {barcode}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleCopyBarcode} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Copy className="w-4 h-4 mr-2" /> Copiar Código
        </Button>
      </div>
      
      <div className="flex gap-2">
         <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" /> Baixar PDF
         </Button>
         <Button variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" /> Imprimir
         </Button>
      </div>

      <p className="text-xs text-center text-gray-500 mt-2">
        Pode levar até 3 dias úteis para a compensação do pagamento.
      </p>
    </div>
  );
};

export default BoletoGenerator;