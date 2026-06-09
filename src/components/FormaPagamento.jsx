import React from 'react';
import { Smartphone, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const FormaPagamento = ({ selectedMethod, onPaymentMethodSelect }) => {
  const methods = [
    {
      id: 'pix',
      title: 'PIX',
      description: 'Aprovação imediata, 24h por dia.',
      icon: Smartphone,
      badge: 'Sem taxa',
      color: 'blue'
    },
    {
      id: 'boleto',
      title: 'Boleto',
      description: 'Pode levar até 2 dias úteis para compensar.',
      icon: FileText,
      badge: 'Sem taxa',
      color: 'gray'
    }
  ];

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Como deseja pagar?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;
          
          return (
            <div
              key={method.id}
              onClick={() => onPaymentMethodSelect(method.id)}
              className={cn(
                "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md",
                isSelected 
                  ? "border-blue-600 bg-blue-50 shadow-sm" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-blue-600">
                  <CheckCircle2 className="w-5 h-5 fill-blue-100" />
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-lg", 
                  isSelected ? "bg-white shadow-sm text-blue-600" : "bg-gray-100 text-gray-500"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn("font-bold text-base", isSelected ? "text-blue-900" : "text-gray-900")}>
                      {method.title}
                    </h4>
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-green-100 text-green-700 hover:bg-green-100">
                      {method.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm border border-yellow-100">
         <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
         <p>Cartão de crédito <strong>não está disponível</strong> para este tipo de transação no momento.</p>
      </div>
    </div>
  );
};

export default FormaPagamento;