import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
import { AlertTriangle, CheckCircle, XCircle, Package, Lock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import DashboardProdutosEducacional from '@/components/DashboardProdutosEducacional';
import { formatCurrency } from '@/lib/currencyUtils';

const DashboardCarneDigital = () => {
  const { user, isOverdue, isSuspended, hasProduct } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(isSuspended() ? 'atraso' : isOverdue() ? 'atraso' : 'em-dia');

  useEffect(() => {
    setActiveTab(isSuspended() ? 'atraso' : isOverdue() ? 'atraso' : 'em-dia');
  }, [user]);

  // Validate Product Availability
  if (!hasProduct('carne_digital')) {
      return (
          <>
            <Helmet><title>Carnê Digital - Indisponível</title></Helmet>
             <div className="max-w-4xl mx-auto py-10">
                <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-xl text-center mb-8">
                    <Package className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Este produto não está ativo</h1>
                    <p className="text-gray-600 mb-6">Parece que você ainda não possui um Carnê Digital Casas Bahia.</p>
                    <Button onClick={() => window.open('https://www.casasbahia.com.br/hotsite/carne-digital.aspx', '_blank')}>
                        Saiba como solicitar
                    </Button>
                </div>
                <DashboardProdutosEducacional />
             </div>
          </>
      );
  }

  const tabs = [
    { id: 'em-dia', label: 'Em dia' },
    { id: 'atraso', label: isSuspended() ? 'Suspenso/Atraso' : 'Em atraso' },
    { id: 'encerrados', label: 'Contratos encerrados' }
  ];

  // Get real user contracts or mock if empty
  const getUserContracts = () => {
      if (!user || !user.contratos) return [];
      return user.contratos.filter(c => c.produto && c.produto.toLowerCase().includes('carnê') || c.produto.toLowerCase().includes('carne'));
  };

  const userContracts = getUserContracts();

  // Filter Logic
  const filteredContracts = userContracts.filter(c => {
      if (activeTab === 'em-dia') return c.status === 'em_dia' || c.status === 'active';
      if (activeTab === 'atraso') return c.status === 'em_atraso' || c.status === 'suspenso';
      return false; // Encerrados not implemented in mock yet
  });

  const handleAction = (action, contractId) => {
    if (action === 'simular') navigate(`/dashboard/simular-acordo/${contractId}`);
    else if (action === 'adiantar') navigate('/dashboard/adiantar-parcelas');
    else toast({ title: "Ação iniciada", description: action });
  };

  return (
    <>
      <Helmet>
        <title>Carnê Digital - Portal Financeiro Casas Bahia</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Carnê Digital</h1>

        {isSuspended() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Lock className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm font-medium">Sua conta está suspensa. Funcionalidades limitadas.</p>
            </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? isSuspended() && tab.id === 'atraso' ? 'bg-gray-900 text-white shadow-md' : 'bg-[#E31C23] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
            {filteredContracts.length > 0 ? (
                filteredContracts.map((c) => (
                    <div key={c.id} className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${c.status === 'suspenso' ? 'border-gray-800' : c.status === 'em_atraso' ? 'border-red-500' : 'border-green-500'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{c.produto}</h3>
                                <p className="text-sm text-gray-500">Contrato: {c.numero || c.id}</p>
                            </div>
                            {c.status === 'suspenso' ? (
                                <span className="bg-red-900 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <XCircle className="w-3 h-3" /> Suspenso
                                </span>
                            ) : c.status === 'em_atraso' ? (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Atrasado
                                </span>
                            ) : (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Em dia
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <p className="text-xs text-gray-500">Valor Total</p>
                                <p className="font-bold">{formatCurrency(c.valorOriginal || c.total)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Em Aberto</p>
                                <p className="font-bold">{formatCurrency(c.valorEmAberto)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Vencimento</p>
                                <p className="font-bold">{c.proximoVencimento ? new Date(c.proximoVencimento).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            {!isSuspended() && c.status === 'em_dia' && (
                                <Button onClick={() => handleAction('adiantar', c.id)} className="bg-green-600 hover:bg-green-700 text-white" aria-label="Adiantar parcelas">Adiantar parcelas</Button>
                            )}
                            
                            {!isSuspended() && (c.status === 'em_atraso' || c.status === 'suspenso') && (
                                 <Button onClick={() => handleAction('simular', c.id)} className="bg-[#E31C23] hover:bg-[#c41a1f] text-white" aria-label="Renegociar dívida">
                                    Renegociar dívida
                                 </Button>
                            )}

                             {isSuspended() && (
                                <Button disabled variant="outline" className="opacity-70 cursor-not-allowed">
                                    Ações Bloqueadas
                                </Button>
                             )}
                        </div>
                    </div>
                ))
            ) : (
                 <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">Nenhum contrato encontrado nesta categoria.</div>
            )}
        </motion.div>
      </div>
    </>
  );
};

export default DashboardCarneDigital;