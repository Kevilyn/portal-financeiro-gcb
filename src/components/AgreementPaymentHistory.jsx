import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currencyUtils';

const AgreementPaymentHistory = ({ history }) => {
  if (!history || history.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed">
           <FileText className="w-12 h-12 text-gray-300 mb-3" />
           <p className="text-gray-500 font-medium">Nenhum pagamento registrado</p>
           <p className="text-xs text-gray-400">Os pagamentos realizados aparecerão aqui.</p>
        </div>
     );
  }

  return (
    <div className="space-y-4">
       {history.map((payment, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                   <FileText className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-bold text-gray-900">{payment.description || 'Pagamento de Parcela'}</p>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(payment.date).toLocaleDateString('pt-BR')} • {payment.method || 'Boleto'}
                   </div>
                </div>
             </div>
             <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 text-xs">
                   <Download className="w-3 h-3 mr-1" /> Comprovante
                </Button>
             </div>
          </div>
       ))}
    </div>
  );
};

export default AgreementPaymentHistory;