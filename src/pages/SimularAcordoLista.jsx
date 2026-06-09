import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HeartHandshake as Handshake, Calendar, Wallet, PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SimularAcordoLista = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // All contracts are eligible for simulation/viewing here, but we highlight overdue ones
  const allContracts = user?.contratos || [];

  const handleSelect = (contract) => {
      // Navigate to the simulation page with contract ID
      navigate(`/dashboard/simular-acordo/${contract.id || contract.numero}`);
  };

  const getStatusBadge = (status) => {
      if (status === 'em_atraso' || status === 'suspenso') {
          return (
              <span className="text-red-600 bg-red-50 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-red-100">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Em Atraso
              </span>
          );
      }
      return (
          <span className="text-green-600 bg-green-50 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Em Dia
          </span>
      );
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
        <Helmet><title>Simular Acordo - Seleção</title></Helmet>

        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar ao Dashboard
        </Button>

        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Handshake className="w-8 h-8 text-blue-600" /> Simular Acordo
            </h1>
            <p className="text-gray-600">
                Escolha um contrato para ver as opções de negociação e pagamento disponíveis.
            </p>
        </div>

        {allContracts.length > 0 ? (
            <div className="grid gap-4">
                {allContracts.map((contract, index) => (
                    <motion.div 
                        key={contract.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "bg-white rounded-xl border shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow",
                            (contract.status === 'em_atraso' || contract.status === 'suspenso') ? "border-l-4 border-l-red-500" : "border-gray-200"
                        )}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                    {contract.numero}
                                </span>
                                {getStatusBadge(contract.status)}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{contract.produto}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                                <div className="flex items-center gap-1.5">
                                    <Wallet className="w-4 h-4 text-gray-400" />
                                    <span>Saldo: <strong>R$ {contract.valorEmAberto?.toLocaleString('pt-BR')}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Vencimento: <strong>{new Date(contract.proximoVencimento).toLocaleDateString('pt-BR')}</strong></span>
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={() => handleSelect(contract)}
                            className={cn(
                                "shadow-md min-w-[140px]",
                                (contract.status === 'em_atraso' || contract.status === 'suspenso') 
                                    ? "bg-red-600 hover:bg-red-700 text-white" 
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                        >
                            {(contract.status === 'em_atraso' || contract.status === 'suspenso') ? "Negociar" : "Simular"}
                        </Button>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Nenhum contrato encontrado</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                    Você não possui contratos ativos no momento.
                </p>
                <Button variant="outline" onClick={() => navigate('/dashboard/produtos')}>
                    Ver Meus Produtos
                </Button>
            </div>
        )}
    </div>
  );
};

export default SimularAcordoLista;