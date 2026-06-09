import React from 'react';
import { CreditCard, Smartphone, FileText, CheckCircle, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/currencyUtils';

const PaymentOptions = ({ contract, installment, selectedPayment, onSelectPayment }) => {
  const handleCopyPix = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText("00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Casas Bahia...");
    toast({ title: "Código Pix copiado!", description: "Cole no app do seu banco ou BanQi para pagar." });
  };

  const handleDownloadBoleto = (e) => {
    e.stopPropagation();
    toast({ title: "Download iniciado", description: "Seu boleto será baixado em instantes." });
  };

  const options = [
    {
      id: 'pix',
      label: 'Pix',
      icon: Smartphone,
      description: 'Aprovação imediata',
      details: (
        <div className="mt-3 bg-white p-3 rounded border border-gray-200">
           <p className="text-xs text-gray-500 font-mono break-all mb-2">00020126360014BR.GOV.BCB.PIX0114+551199999999...</p>
           <Button size="sm" variant="outline" className="w-full gap-2 text-blue-600 hover:text-blue-700" onClick={handleCopyPix}>
             <Copy className="w-3 h-3" /> Copiar Código Pix
           </Button>
        </div>
      )
    },
    {
      id: 'credit_card',
      label: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Até 3x sem juros',
      details: selectedPayment === 'credit_card' && (
        <div className="mt-3">
          <select className="w-full p-2 border rounded text-sm bg-white" onClick={(e) => e.stopPropagation()}>
            <option>Mastercard final 8899</option>
            <option>Visa final 4242</option>
            <option>Adicionar novo cartão</option>
          </select>
        </div>
      )
    },
    {
      id: 'boleto',
      label: 'Boleto',
      icon: FileText,
      description: 'Vencimento em 3 dias',
      details: selectedPayment === 'boleto' && (
        <div className="mt-3">
          <Button size="sm" variant="outline" className="w-full gap-2 text-blue-600" onClick={handleDownloadBoleto}>
             <Download className="w-3 h-3" /> Baixar Boleto PDF
          </Button>
        </div>
      )
    }
  ];

  // Defensive values
  const valor = installment?.valor || 0;
  const valorComDesconto = installment?.valorComDesconto || valor;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-800 text-sm mb-3 border-b border-blue-200 pb-2">Detalhes do Pagamento</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-blue-600 text-xs uppercase tracking-wide">Contrato</span>
            <span className="font-medium text-gray-900">{contract?.numero || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-blue-600 text-xs uppercase tracking-wide">Parcela</span>
            <span className="font-medium text-gray-900">#{installment?.numero || '0'}</span>
          </div>
          <div>
            <span className="block text-blue-600 text-xs uppercase tracking-wide">Valor Original</span>
            <span className="font-medium text-gray-500 line-through">{formatCurrency(valor)}</span>
          </div>
          <div>
            <span className="block text-green-600 text-xs uppercase tracking-wide font-bold">A Pagar</span>
            <span className="font-bold text-green-700">{formatCurrency(valorComDesconto)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-bold text-gray-700">Escolha a forma de pagamento:</p>
        {options.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => onSelectPayment(opt.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPayment === opt.id 
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPayment === opt.id ? 'border-blue-600 bg-white' : 'border-gray-300'}`}>
                {selectedPayment === opt.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
              </div>
              <div className="p-2 bg-white rounded-full border border-gray-100 text-blue-600">
                <opt.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
            </div>
            {selectedPayment === opt.id && opt.details}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;