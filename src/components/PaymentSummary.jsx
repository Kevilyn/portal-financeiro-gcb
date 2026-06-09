import React from 'react';
import { CheckCircle, Calendar, CreditCard, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/currencyUtils';

const PaymentSummary = ({ contract, installment, paymentMethod }) => {
  const methodLabels = {
    pix: 'Pix (Transferência Instantânea)',
    credit_card: 'Cartão de Crédito',
    boleto: 'Boleto Bancário'
  };

  const today = new Date().toLocaleDateString('pt-BR');
  
  // Defensive checks
  const valor = installment?.valor || 0;
  const desconto = installment?.desconto || 0;
  const valorComDesconto = installment?.valorComDesconto || valor;
  const dataVencimento = installment?.dataVencimento ? new Date(installment.dataVencimento).toLocaleDateString('pt-BR') : 'N/A';

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
           <CheckCircle className="w-5 h-5 text-green-600" />
           <h3 className="font-bold text-green-800 text-lg">Resumo do Pagamento</h3>
        </div>
        <p className="text-green-700 text-sm">Confira os detalhes antes de finalizar.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
         <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">Contrato</span>
            <span className="font-medium text-gray-900">{contract?.numero || 'N/A'}</span>
         </div>
         <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">Produto</span>
            <span className="font-medium text-gray-900 text-right">{contract?.produto || 'N/A'}</span>
         </div>
         <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">Parcela</span>
            <span className="font-medium text-gray-900">#{installment?.numero || '0'} - Venc. {dataVencimento}</span>
         </div>
         <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
               <span className="text-gray-500">Valor Original</span>
               <span className="text-gray-900 line-through">{formatCurrency(valor)}</span>
            </div>
            <div className="flex justify-between text-sm">
               <span className="text-green-600 font-bold">Desconto</span>
               <span className="text-green-600 font-bold">- {formatCurrency(desconto)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
               <span className="font-bold text-gray-900">Valor a Pagar</span>
               <span className="font-bold text-2xl text-green-600">{formatCurrency(valorComDesconto)}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
               <CreditCard className="w-3 h-3" /> Forma de Pagamento
            </div>
            <p className="font-bold text-sm text-gray-900">{methodLabels[paymentMethod] || 'Não selecionado'}</p>
         </div>
         <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
               <Calendar className="w-3 h-3" /> Data
            </div>
            <p className="font-bold text-sm text-gray-900">{today}</p>
         </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
         <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
         <div>
            <h4 className="font-bold text-blue-800 text-sm mb-2">Informações Importantes</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
               <li>O desconto é válido apenas para pagamento hoje.</li>
               <li>O comprovante será enviado para seu e-mail cadastrado.</li>
               <li>O pagamento via Pix é processado imediatamente.</li>
               <li>Em caso de dúvidas, contate nosso suporte 0800.</li>
            </ul>
         </div>
      </div>
    </div>
  );
};

export default PaymentSummary;