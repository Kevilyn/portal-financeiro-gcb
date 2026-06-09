import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle, DollarSign, UserPlus } from 'lucide-react';

const CPFStatusSummary = ({ data }) => {
  const totalUsers = data.length;
  const statusCounts = data.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const totalOverdue = data.reduce((acc, curr) => acc + (curr.overdueAmount || 0), 0);
  const overdueCount = data.filter(c => c.daysOverdue > 0).length;
  
  const avgDaysOverdue = overdueCount > 0 
    ? Math.round(data.reduce((acc, curr) => acc + (curr.daysOverdue || 0), 0) / overdueCount)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <div className="text-xs text-gray-500 mt-1 flex gap-2">
             <span className="text-green-600">{statusCounts['Em dia'] || 0} em dia</span>
             <span className="text-red-600">{statusCounts['Em atraso'] || 0} em atraso</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor em Atraso</CardTitle>
          <DollarSign className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            R$ {totalOverdue.toLocaleString('pt-BR', { notation: 'compact' })}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            De {overdueCount} clientes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média de Atraso</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{avgDaysOverdue} dias</div>
          <p className="text-xs text-gray-500 mt-1">
            Tempo médio de inadimplência
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos / Leads</CardTitle>
          <UserPlus className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {(statusCounts['Novo cliente'] || 0) + (statusCounts['Lead'] || 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Oportunidades de conversão
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CPFStatusSummary;