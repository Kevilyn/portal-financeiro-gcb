import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, X, MailOpen, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationsCard = ({ notifications, onMarkRead, onArchive }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <MailOpen className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Você não tem novas notificações.</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info': default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeStyles = (type) => {
    switch(type) {
      case 'alert': return 'bg-red-50 border-red-100';
      case 'success': return 'bg-green-50 border-green-100';
      case 'info': default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notif, index) => (
        <motion.div
          key={notif.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
            notif.read ? "bg-white border-gray-100" : getTypeStyles(notif.type)
          )}
        >
          <div className="flex items-start gap-4 pr-8">
            <div className={cn("p-2 rounded-full bg-white shrink-0", notif.read && "bg-gray-50")}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <h4 className={cn("text-sm font-bold", notif.read ? "text-gray-700" : "text-gray-900")}>
                    {notif.title}
                 </h4>
                 {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 )}
              </div>
              <p className={cn("text-sm mb-2", notif.read ? "text-gray-500" : "text-gray-700")}>
                 {notif.message}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(notif.date).toLocaleDateString('pt-BR')} às {new Date(notif.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-1">
             {!notif.read && (
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => onMarkRead(notif.id)}
                    title="Marcar como lida"
                 >
                    <MailOpen className="w-4 h-4" />
                 </Button>
             )}
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => onArchive(notif.id)}
                title="Arquivar"
             >
                <Archive className="w-4 h-4" />
             </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationsCard;