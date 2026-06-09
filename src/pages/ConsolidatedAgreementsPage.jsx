import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

// Components
import AgreementFiltersBar from '@/components/AgreementFiltersBar';
import AgreementSummaryCard from '@/components/AgreementSummaryCard';
import AgreementDetailPanel from '@/components/AgreementDetailPanel';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ConsolidatedAgreementsPage = () => {
  const { getAgreements, user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // State
  const [agreements, setAgreements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'newest'
  });

  // Load Data
  useEffect(() => {
    // Combine context agreements with simulated data if context is empty for demo
    let data = getAgreements();
    
    // Simulate data if empty (for demonstration purposes as per prompt req)
    if (data.length === 0 && user) {
       data = [
           { 
               id: 'AG-DEMO-01', 
               value: 1200.50, 
               status: 'active', 
               product: 'Acordo Carnê Digital', 
               dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
               installments: 4,
               createdAt: new Date().toISOString()
           },
           { 
               id: 'AG-DEMO-02', 
               value: 450.00, 
               status: 'paid', 
               product: 'Cartão Casas Bahia', 
               dueDate: new Date(Date.now() - 86400000 * 10).toISOString(),
               installments: 1,
               createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
           }
       ];
    }
    
    setAgreements(data);
    
    // Auto-select if ID in URL
    const urlId = searchParams.get('id');
    if (urlId) setSelectedId(urlId);
    
  }, [user, searchParams]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: 'all', sort: 'newest' });
  };

  const handleSelectAgreement = (agreement) => {
    setSelectedId(agreement.id);
    // On mobile, this will trigger a view switch via conditional rendering
  };

  const handleBackToUnknown = () => {
    setSelectedId(null);
  };

  // Filter Logic
  const filteredAgreements = agreements.filter(item => {
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesSearch = filters.search === '' || 
        item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.product && item.product.toLowerCase().includes(filters.search.toLowerCase()));
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
      if (filters.sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (filters.sort === 'highest') return b.value - a.value;
      if (filters.sort === 'lowest') return a.value - b.value;
      return 0;
  });

  const selectedAgreement = agreements.find(a => a.id === selectedId);

  return (
    <>
      <Helmet><title>Meus Acordos - Portal Financeiro</title></Helmet>

      <div className="h-[calc(100vh-140px)] flex flex-col max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 md:px-0">
           <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Acordos</h1>
              <p className="text-gray-500 text-sm">Gerencie todos os seus contratos e negociações.</p>
           </div>
           {/* <Button className="bg-[#E31C23] hover:bg-[#c41a1f] text-white">
              <Plus className="w-4 h-4 mr-2" /> Novo Acordo
           </Button> */}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 overflow-hidden relative">
            
            {/* Left Panel: List (Hidden on mobile if detail selected) */}
            <div className={`flex-1 flex flex-col gap-4 min-w-0 transition-all duration-300 ${selectedId ? 'hidden md:flex md:w-1/3 md:max-w-md' : 'w-full'}`}>
                
                <AgreementFiltersBar 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    onClear={handleClearFilters}
                />

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {filteredAgreements.length > 0 ? (
                        filteredAgreements.map(agreement => (
                            <AgreementSummaryCard 
                                key={agreement.id} 
                                agreement={agreement} 
                                isSelected={selectedId === agreement.id}
                                onClick={handleSelectAgreement}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>Nenhum acordo encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Details (Full screen on mobile, Side panel on desktop) */}
            <div className={`
                flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300
                absolute inset-0 md:relative md:inset-auto z-20 md:z-0
                ${selectedId ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 md:translate-x-0 md:opacity-100'}
            `}>
                <AgreementDetailPanel 
                    agreement={selectedAgreement} 
                    onBack={handleBackToUnknown}
                />
            </div>

            {/* Empty State for Desktop Right Panel */}
            {!selectedId && (
                <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <div className="text-center text-gray-400">
                        <p>Selecione um acordo para ver os detalhes</p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </>
  );
};

export default ConsolidatedAgreementsPage;