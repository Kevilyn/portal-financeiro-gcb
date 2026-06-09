import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, MapPin, Calendar, CreditCard, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  // Helper to normalize contract data (handles flat contracts or detailed structure)
  const contracts = user.detalhes?.contratos || user.contratos || [];
  
  // Calculate stats dynamically
  const totalValue = contracts.reduce((acc, curr) => acc + (curr.valorOriginal || curr.valueOriginal || 0), 0);
  const openValue = contracts.reduce((acc, curr) => acc + (curr.valorEmAberto || curr.valueOpen || 0), 0);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'em_atraso': return 'text-red-600 bg-red-50';
      case 'em_dia': return 'text-green-600 bg-green-50';
      case 'suspenso': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="bg-blue-600 p-6 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {user.nome}
              <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded-full text-white">
                {user.status}
              </span>
            </h2>
            <p className="text-blue-100 mt-1 font-mono">{user.cpf}</p>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white p-2 rounded-full hover:bg-blue-500/50">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Dados Pessoais
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {user.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {user.telefone}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {user.endereco}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Atividade da Conta
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Criado em:</span>
                  <span className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Último Login:</span>
                  <span className="font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'Nunca'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fidelidade:</span>
                  <span className="font-medium text-purple-600">{user.fidelity?.level || 'N/A'} ({user.fidelity?.points || 0} pts)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Contratos Ativos</p>
              <p className="text-xl font-bold text-gray-900">{contracts.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Valor Total</p>
              <p className="text-xl font-bold text-gray-900">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Em Aberto</p>
              <p className="text-xl font-bold text-red-600">R$ {openValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Próx. Vencimento</p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {user.proximoVencimento ? new Date(user.proximoVencimento).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
          </div>

          {/* Contracts List */}
          <h3 className="font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> Detalhes dos Contratos
          </h3>
          
          <div className="space-y-4">
            {contracts.length === 0 ? (
              <p className="text-center text-gray-500 py-4 italic">Nenhum contrato encontrado.</p>
            ) : (
              contracts.map((contract, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{contract.produto || contract.product}</h4>
                      <p className="text-xs text-gray-500 font-mono">{contract.numero || contract.contractNumber}</p>
                    </div>
                    <span className={cn("px-2 py-1 rounded text-xs font-bold uppercase", getStatusColor(contract.status))}>
                      {contract.status}
                    </span>
                  </div>
                  
                  {/* Detailed Installments if available */}
                  {(contract.parcelas || contract.installments) && (
                    <div className="mt-3 bg-gray-50 rounded p-3 text-sm">
                      <p className="font-bold text-gray-700 text-xs uppercase mb-2">Parcelas</p>
                      <div className="space-y-2">
                        {(contract.parcelas || contract.installments).map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center">{p.numero || p.number || idx + 1}</span>
                              <span className="text-gray-500">{new Date(p.dataVencimento || p.dueDate).toLocaleDateString('pt-BR')}</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono">R$ {(p.valor || p.value).toFixed(2)}</span>
                              {p.status === 'paga' || p.status === 'pago' ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : p.status === 'pendente' ? (
                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <Button onClick={onClose} variant="outline">Fechar</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;