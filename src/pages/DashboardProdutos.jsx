import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { 
   PackageOpen, 
   AlertTriangle, 
   Info, 
   X, 
   Wallet, 
   Clock, 
   FileWarning,
   Filter
} from 'lucide-react';
import DashboardProdutosEducacional from '@/components/DashboardProdutosEducacional';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// New Components
import ProductCard from '@/components/ProductCard';
import ContractDetailModal from '@/components/ContractDetailModal';
import InstallmentPaymentModal from '@/components/InstallmentPaymentModal';
import RenegotiationModal from '@/components/RenegotiationModal';

const DashboardProdutos = () => {
  const { user, isNewUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(location.state || null);
  
  // Modal States
  const [detailModal, setDetailModal] = useState({ isOpen: false, contract: null });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, installment: null, contractNumber: '' });
  const [renegotiationModal, setRenegotiationModal] = useState({ isOpen: false, contract: null });

  // Filter State
  const [filter, setFilter] = useState('all'); // all, atrasados, em_dia

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
        window.history.replaceState({}, document.title);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  if (isNewUser()) {
    return (
      <>
        <Helmet><title>Conheça nossos Produtos</title></Helmet>
        <DashboardProdutosEducacional />
      </>
    );
  }

  // Robust data retrieval
  const contracts = user?.detalhes?.contratos || user?.contratos || [];
  
  // Calculate Summaries
  const summaryStats = contracts.reduce((acc, curr) => {
     acc.totalContracts++;
     acc.totalValue += (curr.valorOriginal || 0);
     acc.totalOpen += (curr.valorEmAberto || 0);
     if (curr.status === 'em_atraso' || curr.status === 'suspenso') acc.overdueCount++;
     return acc;
  }, { totalContracts: 0, totalValue: 0, totalOpen: 0, overdueCount: 0 });

  // Filter Logic
  const filteredContracts = contracts.filter(c => {
     if (filter === 'all') return true;
     if (filter === 'atrasados') return c.status === 'em_atraso' || c.status === 'suspenso';
     if (filter === 'em_dia') return c.status === 'em_dia' || c.status === 'active';
     return true;
  });

  // Handlers
  const handleViewDetails = (contract) => setDetailModal({ isOpen: true, contract });
  
  // Update to navigate to negotiation page with ID
  const handleRenegotiate = (contract) => {
      // Navigate to simulation page with contract ID
      navigate(`/dashboard/simular-acordo/${contract.id || contract.numero}`);
  };

  const handlePayInstallment = (installment, contractNumber) => setPaymentModal({ isOpen: true, installment, contractNumber });

  return (
    <>
      <Helmet><title>Meus Produtos - banQi Casas Bahia</title></Helmet>

      <div className="max-w-6xl mx-auto pb-12 space-y-8">
        
        {/* Notification Banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "p-4 rounded-lg flex items-start gap-3 shadow-sm relative pr-10",
                notification.type === 'warning' ? "bg-yellow-50 border border-yellow-200 text-yellow-800" : "bg-blue-50 border border-blue-200 text-blue-800"
              )}
            >
              {notification.type === 'warning' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <Info className="w-5 h-5 shrink-0" />}
              <div><p className="font-medium text-sm">{notification.message}</p></div>
              <button 
                onClick={() => setNotification(null)}
                className="absolute top-3 right-3 p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 opacity-60" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Produtos</h1>
              <p className="text-gray-500 mt-2 text-lg">Gerencie todos os seus contratos e pagamentos em um só lugar.</p>
           </div>
           
           {/* Summary Cards Row */}
           <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm min-w-[140px]">
                 <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> Total em Aberto
                 </p>
                 <p className="text-lg font-bold text-gray-900 mt-1">R$ {summaryStats.totalOpen.toLocaleString('pt-BR')}</p>
              </div>
              <div className={cn("p-3 rounded-xl border shadow-sm min-w-[140px]", summaryStats.overdueCount > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100")}>
                 <p className={cn("text-xs uppercase font-bold flex items-center gap-1", summaryStats.overdueCount > 0 ? "text-red-600" : "text-green-600")}>
                    <FileWarning className="w-3 h-3" /> Contratos em Atraso
                 </p>
                 <p className={cn("text-lg font-bold mt-1", summaryStats.overdueCount > 0 ? "text-red-700" : "text-green-700")}>
                    {summaryStats.overdueCount}
                 </p>
              </div>
           </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
           <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('all')}
              className={filter === 'all' ? "bg-gray-900 text-white" : "text-gray-600"}
           >
              Todos
           </Button>
           <Button 
              variant={filter === 'atrasados' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('atrasados')}
              className={filter === 'atrasados' ? "bg-red-600 hover:bg-red-700 text-white border-transparent" : "text-gray-600"}
           >
              Em Atraso
           </Button>
           <Button 
              variant={filter === 'em_dia' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('em_dia')}
              className={filter === 'em_dia' ? "bg-green-600 hover:bg-green-700 text-white border-transparent" : "text-gray-600"}
           >
              Em Dia
           </Button>
        </div>

        {/* Product List */}
        {filteredContracts.length > 0 ? (
           <div className="grid gap-6">
              {filteredContracts.map((contract) => (
                 <ProductCard 
                    key={contract.id} 
                    contract={contract} 
                    onViewDetails={handleViewDetails}
                    onRenegotiate={handleRenegotiate}
                    onPayInstallment={handlePayInstallment}
                 />
              ))}
           </div>
        ) : (
           <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <PackageOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Nenhum contrato encontrado</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-2">
                 Não encontramos contratos com o filtro selecionado.
              </p>
              {filter !== 'all' && (
                 <Button variant="link" onClick={() => setFilter('all')} className="mt-2 text-blue-600">
                    Limpar filtros
                 </Button>
              )}
           </div>
        )}

        {/* Modals */}
        <ContractDetailModal 
           isOpen={detailModal.isOpen} 
           onClose={() => setDetailModal({ ...detailModal, isOpen: false })} 
           contract={detailModal.contract} 
        />
        
        <InstallmentPaymentModal
           isOpen={paymentModal.isOpen}
           onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
           installment={paymentModal.installment}
           contractNumber={paymentModal.contractNumber}
        />

        <RenegotiationModal
           isOpen={renegotiationModal.isOpen}
           onClose={() => setRenegotiationModal({ ...renegotiationModal, isOpen: false })}
           contract={renegotiationModal.contract}
        />
      </div>
    </>
  );
};

export default DashboardProdutos;