import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Smartphone, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CBIAChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { label: "Quero adiantar parcelas", icon: Smartphone },
    { label: "Tenho dúvida sobre acordo", icon: HelpCircle },
    { label: "Como funciona?", icon: Bot },
    { label: "Falar com especialista", icon: User, action: 'whatsapp' }
  ];

  const handleAction = (action) => {
    if (action === 'whatsapp') {
      window.open('https://api.whatsapp.com/send?phone=5511999999999', '_blank');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 w-[60px] h-[60px] bg-[#0066CC] rounded-full shadow-2xl flex flex-col items-center justify-center text-white hover:bg-[#0052a3] focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Abrir assistente CB IA"
      >
        <Bot className="w-6 h-6" />
        <span className="text-[10px] font-bold mt-0.5">CB IA</span>
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            {/* Header */}
            <div className="bg-[#0066CC] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Assistente CB IA</h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online agora
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
              {/* Bot Welcome Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#0066CC] rounded-full flex-shrink-0 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 max-w-[85%] border border-gray-100">
                  <p>Olá! Sou a inteligência artificial da Casas Bahia. 🤖</p>
                  <p className="mt-2">Posso te ajudar com acordos, parcelas ou dúvidas gerais. Como posso ajudar hoje?</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-3 ml-1">Sugestões para você:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAction(action.action)}
                    className="flex items-center gap-2 bg-white text-[#0066CC] border border-blue-100 hover:bg-blue-50 px-3 py-2 rounded-full text-xs font-semibold transition-colors shadow-sm"
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20 transition-all"
              />
              <Button size="icon" className="rounded-full w-10 h-10 bg-[#0066CC] hover:bg-[#0052a3]">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CBIAChat;