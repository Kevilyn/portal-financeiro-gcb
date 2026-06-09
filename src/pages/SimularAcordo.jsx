import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { FileText, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SimularAcordo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Normalize contracts access
  const contracts = user?.detalhes?.contratos || user?.contratos || [];

  useEffect(() => {
    if (contracts.length === 0) {
      navigate('/dashboard/produtos', { 
        state: { 
          message: 'Você não possui contratos elegíveis para negociação no momento.', 
          type: 'warning' 
        } 
      });
    }
  }, [contracts, navigate]);

  if (contracts.length === 0) {
    return null; // Render nothing while redirecting
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'em_atraso':
      case 'suspenso':
      case 'Overdue':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertCircle,
          label: 'Em Atraso'
        };
      case 'em_dia':
      case 'Active':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          label: 'Em Dia'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: Clock,
          label: status
        };
    }
  };

  return (
    <>
      <Helmet><title>Selecionar Contrato - Simular Acordo</title></Helmet>

      <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Simular Acordo</h1>
          <p className="text-gray-500 mt-1">Selecione um contrato abaixo para ver opções de pagamento e negociação.</p>
        </div>

        <div className="grid gap-4">
          {contracts.map((contract) => {
            const statusInfo = getStatusInfo(contract.status);
            const StatusIcon = statusInfo.icon;
            
            // Handle different data structures for amount and installments
            const amount = contract.valorEmAberto || contract.valueOpen || 0;
            const installmentsCount = (contract.parcelas || contract.installments || []).length;
            const contractId = contract.id;
            const contractNumber = contract.numero || contract.contractNumber || contract.id;
            const productName = contract.produto || contract.product;

            return (
              <Card 
                key={contractId}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md border-l-4", 
                  statusInfo.borderColor
                )}
                onClick={() => navigate(`/dashboard/simular-acordo/${contractId}`)}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-full", statusInfo.bgColor)}>
                      <FileText className={cn("w-6 h-6", statusInfo.color)} />
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{productName}</h3>
                      <p className="text-sm text-gray-500 font-mono mb-2">Contrato: {contractNumber}</p>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <span className={cn("flex items-center gap-1 font-medium", statusInfo.color)}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-600">
                          {installmentsCount > 0 ? `${installmentsCount} parcelas` : 'Sem parcelas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Valor em Aberto</p>
                    <p className="text-xl font-bold text-gray-900 mb-2">
                      R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-medium">
                      Simular agora <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SimularAcordo;