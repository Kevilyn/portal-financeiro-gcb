import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, Mail, DollarSign, AlertTriangle, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStatusColor } from '@/lib/cpfStatusUtils';
import { cn } from '@/lib/utils';

const CPFDetailModal = ({ data, onClose }) => {
  if (!data) return null;

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
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gray-50 border-b p-4 md:p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-1">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">{data.name}</h2>
              <span className={cn("px-2 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold border", getStatusColor(data.status))}>
                {data.status}
              </span>
            </div>
            <p className="text-gray-500 font-mono text-xs md:text-sm">{data.cpf}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6">
          
          {data.daysOverdue > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800 text-sm md:text-base">Atenção: Pagamento em Atraso</h3>
                <p className="text-xs md:text-sm text-red-700 mt-1">
                  Este cliente possui {data.daysOverdue} dias de atraso. Valor pendente: 
                  <span className="font-bold"> R$ {data.overdueAmount?.toFixed(2)}</span>.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2 text-sm md:text-base">
                <User className="w-3 h-3 md:w-4 md:h-4 text-blue-600" /> Dados Cadastrais
              </h3>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1 md:gap-2"><Mail className="w-2 h-2 md:w-3 md:h-3" /> Email</span>
                  <span className="font-medium text-gray-900">{data.email || 'Não cadastrado'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1 md:gap-2"><Phone className="w-2 h-2 md:w-3 md:h-3" /> Telefone</span>
                  <span className="font-medium text-gray-900">{data.phone || 'Não cadastrado'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Perfil Completo</span>
                  {data.profileComplete ? (
                    <span className="flex items-center gap-1 text-green-600 font-bold text-xs md:text-sm"><Check className="w-2 h-2 md:w-3 md:h-3" /> Sim</span>
                  ) : (
                    <span className="text-orange-500 font-bold text-xs md:text-sm">Não</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
               <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2 text-sm md:text-base">
                <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-green-600" /> Financeiro
              </h3>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                 <div className="flex items-center justify-between">
                  <span className="text-gray-500">Dívida Total</span>
                  <span className="font-bold text-gray-900">R$ {data.totalDebt?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Último Pagamento</span>
                  <span className="font-medium text-gray-900">
                    {data.lastPaymentDate ? new Date(data.lastPaymentDate).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </div>
                 <div className="flex items-center justify-between">
                  <span className="text-gray-500">Data Registro</span>
                  <span className="font-medium text-gray-900">
                     {data.registrationDate ? new Date(data.registrationDate).toLocaleDateString('pt-BR') : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
               <FileText className="w-3 h-3 md:w-4 md:h-4 text-gray-600" /> Contratos Ativos
            </h3>
            {data.contracts && data.contracts.length > 0 ? (
              <div className="space-y-2 md:space-y-3">
                {data.contracts.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 md:p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-xs md:text-sm text-gray-900">{c.product}</p>
                      <p className="text-[10px] md:text-xs text-gray-500">{c.id} • Venc: {new Date(c.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-xs md:text-sm text-gray-900">R$ {c.value.toFixed(2)}</p>
                       <span className={cn("text-[9px] md:text-[10px] uppercase font-bold", c.status === 'Overdue' ? 'text-red-600' : 'text-green-600')}>
                         {c.status}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 md:py-6 bg-gray-50 rounded-lg border border-dashed text-gray-500 text-xs md:text-sm">
                Nenhum contrato vinculado a este CPF.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 border-t bg-gray-50 flex justify-end gap-2 md:gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>Fechar</Button>
          {data.daysOverdue > 0 ? (
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              Enviar Cobrança
            </Button>
          ) : !data.profileComplete ? (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Completar Cadastro
            </Button>
          ) : (
            <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
              Ver Histórico Completo
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CPFDetailModal;