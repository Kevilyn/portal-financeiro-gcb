import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SuspendedAccountBanner = ({ user }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mb-8"
    >
      {/* Main Suspension Banner */}
      <div className="bg-gray-900 text-white rounded-xl overflow-hidden shadow-2xl border-l-8 border-yellow-500">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-full">
              <Lock className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
                ⛔ Sua conta está suspensa no momento
              </h2>
              <p className="text-gray-300 mb-6">
                Identificamos pendências críticas que resultaram no bloqueio temporário dos seus serviços.
                Regularize sua situação para retomar o acesso total.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div>
                   <p className="text-sm text-gray-400 mb-1">Motivo da suspensão</p>
                   <p className="font-semibold text-white">{user?.suspensionReason || "Pendências Financeiras"}</p>
                </div>
                <div>
                   <p className="text-sm text-gray-400 mb-1">Valor Total Pendente</p>
                   <p className="font-semibold text-yellow-500 text-lg">
                     R$ {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                   </p>
                </div>
                <div className="md:col-span-2">
                   <p className="text-sm text-gray-400 mb-2">Restrições ativas:</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="flex items-center gap-1 bg-red-900/40 text-red-200 px-3 py-1 rounded-full text-xs border border-red-900">
                       <XCircle className="w-3 h-3" /> Novas compras bloqueadas
                     </span>
                     <span className="flex items-center gap-1 bg-red-900/40 text-red-200 px-3 py-1 rounded-full text-xs border border-red-900">
                       <XCircle className="w-3 h-3" /> Solicitação de produtos suspensa
                     </span>
                     <span className="flex items-center gap-1 bg-red-900/40 text-red-200 px-3 py-1 rounded-full text-xs border border-red-900">
                       <XCircle className="w-3 h-3" /> Acesso ao Bank bloqueado
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgency Campaign Banner */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          <Clock className="w-6 h-6 animate-pulse" />
          <div>
            <p className="font-bold text-lg">Última chance de negociação facilitada</p>
            <p className="text-sm text-yellow-100">Evite o cancelamento definitivo dos seus contratos.</p>
          </div>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm font-mono font-bold text-xl">
          ⏰ Faltam 24 horas
        </div>
      </div>
    </motion.div>
  );
};

export default SuspendedAccountBanner;