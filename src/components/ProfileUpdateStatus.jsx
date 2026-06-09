import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProfileUpdateStatus = ({ lastUpdate, status = 'synced' }) => {
  // If no date, use now
  const dateObj = lastUpdate ? new Date(lastUpdate) : new Date();
  
  const statusConfig = {
    synced: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      text: 'Seu perfil está atualizado'
    },
    syncing: {
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      text: 'Sincronizando dados...',
      animate: true
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      text: 'Erro na sincronização'
    }
  };

  const config = statusConfig[status] || statusConfig.synced;
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border shadow-sm mb-6",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-1.5 rounded-full bg-white", config.color)}>
            <Icon className={cn("w-4 h-4", config.animate && "animate-spin")} />
        </div>
        <div>
            <p className={cn("text-sm font-semibold", config.color)}>
                {config.text}
            </p>
            {status !== 'syncing' && (
                <p className={cn("text-xs opacity-80", config.color)}>
                    Última atualização em {format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
            )}
        </div>
      </div>
      
      {status === 'synced' && (
         <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded text-[10px] font-medium text-green-700">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Online
         </div>
      )}
    </motion.div>
  );
};

export default ProfileUpdateStatus;