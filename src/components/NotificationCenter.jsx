import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Inbox, 
  X,
  MailOpen
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import NotificationsCard from '@/components/NotificationsCard';

const NotificationCenter = () => {
  const { user, markNotificationAsRead, archiveNotification, clearNotifications } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread'

  const notifications = user?.notifications?.filter(n => !n.archived) || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-blue-600">
          <Bell className="w-5 h-5 md:w-6 md:h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] md:w-[400px] p-0 mr-4 md:mr-0 shadow-xl border-gray-100" align="end">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
           <div>
             <h4 className="font-bold text-gray-900">Notificações</h4>
             <p className="text-xs text-gray-500">Você tem {unreadCount} novas mensagens</p>
           </div>
           <div className="flex gap-1">
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-blue-600"
                onClick={handleMarkAllRead}
                title="Marcar todas como lidas"
             >
                <Check className="w-4 h-4" />
             </Button>
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={clearNotifications}
                title="Limpar tudo"
             >
                <Trash2 className="w-4 h-4" />
             </Button>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('all')}
                className={cn(
                    "flex-1 py-2 text-sm font-medium transition-colors border-b-2",
                    activeTab === 'all' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:bg-gray-50"
                )}
            >
                Todas
            </button>
            <button 
                onClick={() => setActiveTab('unread')}
                className={cn(
                    "flex-1 py-2 text-sm font-medium transition-colors border-b-2",
                    activeTab === 'unread' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:bg-gray-50"
                )}
            >
                Não Lidas
            </button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[350px]">
           <div className="p-2">
             {filteredNotifications.length > 0 ? (
                 <NotificationsCard 
                    notifications={filteredNotifications}
                    onMarkRead={markNotificationAsRead}
                    onArchive={archiveNotification}
                 />
             ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-gray-50 rounded-full p-4 mb-3">
                        <Inbox className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-900 font-medium">Tudo limpo por aqui!</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {activeTab === 'unread' ? "Você leu todas as notificações." : "Nenhuma notificação encontrada."}
                    </p>
                </div>
             )}
           </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
            <Button variant="link" size="sm" className="text-xs text-blue-600 h-auto py-1" onClick={() => setOpen(false)}>
                Fechar
            </Button>
        </div>

      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;