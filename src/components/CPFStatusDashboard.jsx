import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CPFStatusCard from '@/components/CPFStatusCard';
import CPFDetailModal from '@/components/CPFDetailModal';
import CPFStatusSummary from '@/components/CPFStatusSummary';
import { fetchAllCPFStatuses, generateStatusReport } from '@/api/cpfStatusApi';
import { toast } from '@/components/ui/use-toast';

const CPFStatusDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedCPF, setSelectedCPF] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchAllCPFStatuses();
      setData(result);
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao carregar dados.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const csv = await generateStatusReport();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpf-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({ title: "Sucesso", description: "Relatório baixado com sucesso." });
  };

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.cpf.includes(searchTerm);
    
    const matchesFilter = activeFilter === 'Todos' || item.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filters = ['Todos', 'Em dia', 'Em atraso', 'Novo cliente', 'Lead'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Status CPF</h1>
          <p className="text-gray-500">Monitoramento detalhado de clientes e leads.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={loadData} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
           </Button>
           <Button variant="default" size="sm" onClick={handleExport} className="gap-2 bg-gray-900">
              <Download className="w-4 h-4" /> Exportar CSV
           </Button>
        </div>
      </div>

      <CPFStatusSummary data={data} />

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Buscar por CPF ou Nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
             {filters.map(filter => (
               <Button
                 key={filter}
                 variant={activeFilter === filter ? 'default' : 'outline'}
                 onClick={() => setActiveFilter(filter)}
                 size="sm"
                 className={activeFilter === filter ? 'bg-blue-600 hover:bg-blue-700' : ''}
               >
                 {filter}
               </Button>
             ))}
          </div>
        </div>
      </div>

      {loading ? (
         <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando dados...</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => (
              <motion.div
                key={item.cpf}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <CPFStatusCard data={item} onViewDetails={setSelectedCPF} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredData.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                Nenhum registro encontrado para os filtros selecionados.
             </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedCPF && (
          <CPFDetailModal 
            data={selectedCPF} 
            onClose={() => setSelectedCPF(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CPFStatusDashboard;