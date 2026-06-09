import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
import { CreditCard, Download, Printer, AlertCircle, TrendingUp, Calendar, CheckCircle, Lock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/currencyUtils';
import { useNavigate } from 'react-router-dom';

const DashboardCartaoCasasBahia = () => {
  const { isOverdue, isSuspended } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(isSuspended() || isOverdue() ? 'atraso' : 'em-dia');

  const tabs = [
    { id: 'em-dia', label: 'Em dia' },
    { id: 'pendente', label: 'Fatura pendente' },
    { id: 'atraso', label: isSuspended() ? 'Fatura/Suspensão' : 'Fatura em atraso' },
    { id: 'historico', label: 'Histórico' }
  ];

  const cardData = {
    limit: 5000.00,
    available: 2500.00,
    lastPaid: '15/12/2025',
    closingDate: '05/02/2026',
    invoice: {
      total: 2500.00,
      min: 350.00,
      dueDate: '19/02/2026',
      overdueValue: 1000.00,
      daysLate: 15
    },
    suspended: {
        overdueValue: 1500.00,
        daysLate: 30,
        reducedLimit: 500.00
    }
  };

  const history = [
    { date: 'Janeiro 2026', status: isOverdue() ? 'Atrasada' : 'Aberta', value: 2500.00 },
    { date: 'Dezembro 2025', status: 'Paga', value: 1800.00 },
    { date: 'Novembro 2025', status: 'Paga', value: 2100.00 },
  ];

  const handleNegotiate = () => {
      // Mock contract ID for card
      navigate('/dashboard/simular-acordo/card-123');
  };

  return (
    <>
      <Helmet>
        <title>Cartão BanQi Casas Bahia</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cartão BanQi Casas Bahia</h1>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? isSuspended() && tab.id === 'atraso' ? 'bg-red-900 text-white shadow-md' : 'bg-[#003DA5] text-white shadow-md'
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
          className={`bg-white p-6 rounded-xl shadow-lg border ${isSuspended() && activeTab === 'atraso' ? 'border-red-900 border-2' : 'border-gray-100'}`}
        >
          {activeTab === 'em-dia' && !isOverdue() && !isSuspended() && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-gradient-to-r from-[#003DA5] to-[#002d7a] rounded-lg shadow-md"></div>
                <div>
                  <h3 className="font-bold text-gray-900">Visa Platinum</h3>
                  <p className="text-xs text-gray-500">Final 8842</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Limite Total</p>
                  <p className="text-xl font-bold">{formatCurrency(cardData.limit)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700">Limite Disponível</p>
                  <p className="text-xl font-bold text-green-800">{formatCurrency(cardData.available)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="w-full bg-[#003DA5] hover:bg-[#002d7a] text-white">Ver visão geral</Button>
              </div>
            </div>
          )}

          {activeTab === 'em-dia' && (isOverdue() || isSuspended()) && (
             <div className="text-center py-8">
               <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
               <p className="text-gray-600">Seu cartão possui pendências. Verifique a aba "{isSuspended() ? 'Fatura/Suspensão' : 'Fatura em atraso'}".</p>
             </div>
          )}

          {activeTab === 'pendente' && (
            <div className="space-y-6">
               <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <div className="flex justify-between mb-2">
                   <span className="text-blue-800 font-medium">Fatura Atual</span>
                   <span className="text-blue-800 font-bold">{cardData.invoice.dueDate}</span>
                 </div>
                 <p className="text-3xl font-bold text-[#003DA5]">{formatCurrency(cardData.invoice.total)}</p>
                 <p className="text-sm text-gray-600 mt-1">Pagamento mínimo: {formatCurrency(cardData.invoice.min)}</p>
               </div>
               <div className="flex flex-col gap-3">
                 <Button className="w-full bg-[#E31C23] hover:bg-[#c41a1f] text-white">Pagar fatura</Button>
                 <div className="flex gap-3">
                   <Button variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> PDF</Button>
                   <Button variant="outline" className="flex-1"><Printer className="w-4 h-4 mr-2" /> Imprimir</Button>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'atraso' && (
            isSuspended() ? (
                // SUSPENDED VIEW
                <div className="space-y-6">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                      <div className="flex items-center gap-2 text-red-900 font-bold mb-4">
                        <Lock className="w-5 h-5" />
                        Fatura em atraso, Cartão suspenso
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Valor em atraso</p>
                          <p className="text-2xl font-bold text-red-900">{formatCurrency(cardData.suspended.overdueValue)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dias de atraso</p>
                          <p className="text-2xl font-bold text-gray-900">{cardData.suspended.daysLate} dias</p>
                        </div>
                         <div className="col-span-2 bg-white p-3 rounded border border-gray-200">
                           <p className="text-xs text-gray-500 uppercase tracking-wide">Limite Reduzido</p>
                           <p className="font-bold text-gray-900">{formatCurrency(cardData.suspended.reducedLimit)}</p>
                         </div>
                      </div>
                      <div className="text-sm text-white bg-red-900 p-3 rounded-lg mb-6 font-bold text-center">
                         CARTÃO SUSPENSO
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 border-gray-300">Ver Fatura</Button>
                        <Button onClick={handleNegotiate} className="flex-1 bg-[#E31C23] hover:bg-[#c41a1f] text-white">Negociar Fatura</Button>
                      </div>
                    </div>
                  </div>
            ) : isOverdue() ? (
                // OVERDUE VIEW
              <div className="space-y-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 text-[#E31C23] font-bold mb-4">
                    <AlertCircle className="w-5 h-5" />
                    Fatura em Atraso
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Valor Atualizado</p>
                      <p className="text-2xl font-bold text-[#E31C23]">{formatCurrency(cardData.invoice.overdueValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dias de atraso</p>
                      <p className="text-2xl font-bold text-gray-900">{cardData.invoice.daysLate} dias</p>
                    </div>
                  </div>
                  <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg mb-6">
                    ⚠️ O atraso no pagamento pode reduzir seu limite de crédito.
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleNegotiate} className="flex-1 bg-[#E31C23] hover:bg-[#c41a1f] text-white">Negociar Fatura</Button>
                    <Button variant="outline" className="flex-1 border-[#E31C23] text-[#E31C23]">Fazer Proposta</Button>
                  </div>
                </div>
              </div>
            ) : (
               <div className="text-center py-12">
                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                 <p className="text-gray-600">Você não possui faturas em atraso.</p>
               </div>
            )
          )}

          {activeTab === 'historico' && (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-900">{item.date}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.status === 'Paga' ? 'bg-green-100 text-green-700' :
                      item.status === 'Atrasada' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.value)}</p>
                    <button className="text-xs text-[#003DA5] hover:underline flex items-center justify-end mt-1">
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default DashboardCartaoCasasBahia;