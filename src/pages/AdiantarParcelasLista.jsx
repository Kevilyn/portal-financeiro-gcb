import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
    ChevronLeft, 
    FastForward, 
    Calendar, 
    Wallet, 
    AlertCircle,
    PackageOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdiantarParcelasLista = () => {
  const { user, selectContract } = useAuth();
  const navigate = useNavigate();

  // Filter for contracts that are up to date (em_dia or active)
  const eligibleContracts = (user?.contratos || []).filter(c => 
    c.status === 'em_dia' || c.status === 'active' || c.status === 'misto'
  );

  const handleSelect = (contract) => {
      selectContract(contract);
      // Navigate to the adiantamento page (ID param is technically redundant if context is set, but good for URL structure)
      navigate(`/dashboard/adiantamento?contract=${contract.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
        <Helmet><title>Adiantar Parcelas - Seleção</title></Helmet>

        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar ao Dashboard
        </Button>

        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FastForward className="w-8 h-8 text-green-600" /> Adiantar Parcelas
            </h1>
            <p className="text-gray-600">
                Selecione um contrato para antecipar pagamentos e ganhar descontos.
            </p>
        </div>

        {eligibleContracts.length > 0 ? (
            <div className="grid gap-4">
                {eligibleContracts.map((contract, index) => (
                    <motion.div 
                        key={contract.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                    {contract.numero}
                                </span>
                                <span className="text-green-600 bg-green-50 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-green-100">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Em Dia
                                </span>
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
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md min-w-[140px]"
                        >
                            Selecionar
                        </Button>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Nenhum contrato elegível</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                    Você não possui contratos ativos elegíveis para adiantamento no momento.
                </p>
                <Button variant="outline" onClick={() => navigate('/dashboard/produtos')}>
                    Ver Meus Produtos
                </Button>
            </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Apenas contratos em dia podem ter parcelas adiantadas. Se você possui parcelas em atraso, utilize a opção "Simular Acordo" para regularizar.
            </p>
        </div>
    </div>
  );
};

export default AdiantarParcelasLista;