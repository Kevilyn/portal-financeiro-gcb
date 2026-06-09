import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Filter, Calendar, FileText, Clock, AlertCircle, Lock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currencyUtils';

const DashboardPagamentos = () => {
  const { user, isOverdue, isSuspended, hasProduct } = useAuth();
  const [activeTab, setActiveTab] = useState('acordos');
  const [filter, setFilter] = useState('todos');

  const tabs = [
    { id: 'acordos', label: 'Acordos Ativos' },
    { id: 'cancelados', label: 'Acordos Cancelados' },
    { id: 'pendentes', label: 'Pagamentos Pendentes' },
    { id: 'realizados', label: 'Pagamentos Realizados' }
  ];

  // Mock Data logic inside render or derived
  const getData = () => {
    // Basic Mock Data
    const basicData = {
      acordos: [],
      cancelados: [],
      pendentes: [],
      realizados: []
    };

    if (isSuspended()) {
       basicData.cancelados.push({ id: 99, type: 'Acordo #4451', contract: 'Geral', status: 'Cancelado', value: 3500.00, date: '15/01/2026' });
       basicData.pendentes.push({ id: 101, type: 'Entrada de Acordo', contract: 'Reneg #8821', status: 'Aguardando pagamento', value: 500.00, date: '30/01/2026', urgent: true });
       return basicData;
    }

    if (hasProduct('carnê')) {
       basicData.realizados.push({ id: 3, type: 'Carnê Digital', contract: '987654321', status: 'Pago', value: 337.00, date: '15/12/2025' });
       if (isOverdue()) {
         basicData.acordos.push({ id: 1, type: 'Carnê Digital', contract: '123456789', status: 'Aguardando pagamento', value: 1500.00, date: '28/01/2026' });
       }
    }

    if (hasProduct('cartão')) {
        basicData.realizados.push({ id: 2, type: 'Cartão Casas Bahia', contract: 'Fatura Dez', status: 'Pago', value: 1800.00, date: '15/12/2025' });
    }
    
    return basicData;
  };

  const data = getData();

  const getStatusBadge = (status, urgent) => {
    if (urgent) return 'bg-red-600 text-white animate-pulse';
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-700';
      case 'Aguardando pagamento': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Helmet>
        <title>Pagamentos e Acordos - Portal Financeiro</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        
        {/* TASK 4: Profile Identification Header */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-sm mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase">Perfil Ativo</p>
                        <h1 className="text-2xl font-bold text-gray-900">{user?.nome || 'Usuário'}</h1>
                    </div>
                </div>
                <div className="md:text-right">
                    <p className="text-sm font-semibold text-gray-500 uppercase">CPF Vinculado</p>
                    <p className="text-xl font-bold text-blue-700 font-mono">{user?.cpf}</p>
                </div>
            </div>
        </div>

        {/* TASK 4: Yellow Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2 mb-8 text-amber-800 text-sm font-medium shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Atenção: Todas as ações abaixo serão aplicadas exclusivamente ao CPF <strong>{user?.cpf}</strong>.</span>
        </div>


        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar w-full md:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? isSuspended() ? 'bg-gray-900 text-white shadow-md' : 'bg-[#E31C23] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-lg text-sm w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              className="bg-transparent outline-none text-gray-700 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filtrar por produto"
            >
              <option value="todos">Todos os produtos</option>
              <option value="carne">Carnê Digital</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {data[activeTab] && data[activeTab].length > 0 ? (
            data[activeTab].map((item) => (
              <div key={item.id} className={`bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all ${item.urgent ? 'border-red-500 border-2' : 'border-gray-100'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.type}</h3>
                      <p className="text-sm text-gray-500">Contrato/Ref: {item.contract}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" /> {item.date}
                        {item.urgent && <span className="text-red-600 font-bold flex items-center ml-2"><AlertCircle className="w-3 h-3 mr-1"/> URGENTE</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-1 ${getStatusBadge(item.status, item.urgent)}`}>
                        {item.status}
                      </span>
                      <p className="font-bold text-lg">{formatCurrency(item.value)}</p>
                    </div>
                    <Button variant="outline" size="sm" aria-label="Ver Detalhes do pagamento">Ver Detalhes</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum registro encontrado nesta categoria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default DashboardPagamentos;