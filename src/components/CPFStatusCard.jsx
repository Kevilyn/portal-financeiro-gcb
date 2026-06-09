import React from 'react';
import { User, Calendar, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStatusColor } from '@/lib/cpfStatusUtils';
import { cn } from '@/lib/utils';

const CPFStatusCard = ({ data, onViewDetails }) => {
  const getSeverityIcon = (days) => {
    if (days > 90) return <AlertCircle className="w-4 h-4 text-red-700" />;
    if (days > 0) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900 truncate pr-2">{data.name}</h3>
          <p className="text-sm text-gray-500 font-mono">{data.cpf}</p>
        </div>
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", getStatusColor(data.status))}>
          {data.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {data.daysOverdue > 0 && (
          <div className="flex items-center gap-2 text-red-600 font-medium bg-red-50 p-1.5 rounded">
            {getSeverityIcon(data.daysOverdue)}
            <span>{data.daysOverdue} dias em atraso</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <User className="w-3.5 h-3.5" /> Perfil
          </span>
          <span className={data.profileComplete ? "text-green-600 font-medium" : "text-orange-500 font-medium"}>
            {data.profileComplete ? "Completo" : "Incompleto"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <CreditCard className="w-3.5 h-3.5" /> Contratos
          </span>
          <span className="font-medium text-gray-900">{data.contracts?.length || 0}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5" /> Cadastro
          </span>
          <span className="text-gray-900">
            {data.registrationDate ? new Date(data.registrationDate).toLocaleDateString('pt-BR') : 'N/A'}
          </span>
        </div>
      </div>

      <Button 
        onClick={() => onViewDetails(data)}
        variant="outline" 
        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        Ver Detalhes
      </Button>
    </div>
  );
};

export default CPFStatusCard;