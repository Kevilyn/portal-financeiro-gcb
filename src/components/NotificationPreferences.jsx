import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

// Simple Switch Component to replace missing shadcn Switch
const SimpleSwitch = ({ checked, onCheckedChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
    onClick={() => onCheckedChange(!checked)}
  >
    <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const NotificationPreferences = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [prefs, setPrefs] = useState(user?.notifications || { whatsapp: true, push: true, email: false });

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updateUser({ notifications: prefs });
    toast({ title: "Preferências salvas", description: "Suas configurações de notificação foram atualizadas." });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Preferências de Notificação</DialogTitle>
          <DialogDescription>Escolha como deseja receber nossos avisos.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-xs text-gray-500">Avisos de vencimento e acordos</p>
              </div>
            </div>
            <SimpleSwitch checked={prefs.whatsapp} onCheckedChange={() => handleToggle('whatsapp')} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Push Notification</p>
                <p className="text-xs text-gray-500">Alertas instantâneos do app</p>
              </div>
            </div>
            <SimpleSwitch checked={prefs.push} onCheckedChange={() => handleToggle('push')} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">E-mail</p>
                <p className="text-xs text-gray-500">Comprovantes e novidades</p>
              </div>
            </div>
            <SimpleSwitch checked={prefs.email} onCheckedChange={() => handleToggle('email')} />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-blue-600 text-white">Salvar Preferências</Button>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPreferences;