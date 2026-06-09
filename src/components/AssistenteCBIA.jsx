import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, ChevronRight, ArrowUp, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import ModalFacaSuaProposta from '@/components/ModalFacaSuaProposta';

const AssistenteCBIA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Context-aware initialization
  useEffect(() => {
    setMessages([]); // Reset on route change or init
    
    let initialMsg = `Olá, ${user?.nome?.split(' ')[0] || 'cliente'}! Sou a IA do Portal Casas Bahia. Como posso ajudar você hoje?`;
    let suggestions = [
      "Como fazer um acordo?",
      "Formas de pagamento",
      "Adiantar parcelas"
    ];

    if (location.pathname.includes('simular-acordo')) {
      initialMsg = "Estou vendo que você quer negociar. Posso ajudar a entender as opções de parcelamento ou pagamento à vista.";
      suggestions = ["Qual o desconto à vista?", "Posso parcelar em 24x?", "O que é taxa de juros?"];
    } else if (location.pathname.includes('meus-produtos')) {
      initialMsg = "Aqui você vê todos os seus contratos. Quer ajuda para entender o status de algum deles?";
      suggestions = ["O que é status 'Suspenso'?", "Como ver parcelas futuras?", "Baixar boleto"];
    }

    setMessages([
      { type: 'bot', text: initialMsg, suggestions }
    ]);
  }, [location.pathname, user]);

  const handleSendMessage = (text) => {
    const msgText = text || inputValue;
    if (!msgText.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: msgText }]);
    setInputValue('');

    setTimeout(() => {
      let response = "Entendi. Vou verificar essa informação para você.";
      const lowerText = msgText.toLowerCase();

      if (lowerText.includes('acordo')) {
        response = "Para fazer um acordo, acesse a aba 'Simular Acordo' no menu lateral.";
      }
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 1000);
  };

  const handleWhatsAppClick = () => {
    // Placeholder number - replace with actual business number
    window.open("https://wa.me/5511999999999", "_blank");
  };

  return (
    <>
      <ModalFacaSuaProposta isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        
        {/* Chat Window - Positioned absolutely above the stack */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-96 right-0 w-[90vw] md:w-80 h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Assistente Virtual</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs text-blue-100">Online agora</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleOpen} 
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex flex-col", msg.type === 'user' ? "items-end" : "items-start")}>
                    <div 
                      className={cn(
                        "max-w-[85%] p-3 text-sm shadow-sm",
                        msg.type === 'user' 
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                          : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                    {msg.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-1"
                          >
                            {sug} <ChevronRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="relative flex items-center gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua dúvida..."
                    className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-xl"
                  />
                  <Button 
                    onClick={() => handleSendMessage()}
                    size="icon"
                    className="absolute right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-sm"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons Stack */}

        {/* 1. Proposta Button (Top) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          title="Faça sua Proposta"
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center bg-orange-500 hover:bg-orange-600 transition-all duration-300 z-50"
        >
          <FileText className="w-8 h-8 text-white" />
        </motion.button>

        {/* 2. IA Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          title="Assistente Virtual"
          className={cn(
            "w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50",
            isOpen ? "bg-blue-700" : "bg-blue-600"
          )}
        >
           {isOpen ? <X className="w-8 h-8 text-white" /> : <Bot className="w-8 h-8 text-white" />}
        </motion.button>

        {/* 3. Top Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          title="Voltar ao Topo"
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center bg-purple-700 hover:bg-purple-800 transition-all duration-300 z-40"
        >
          <ArrowUp className="w-8 h-8 text-white" />
        </motion.button>

        {/* 4. WhatsApp Button (Bottom) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsAppClick}
          title="Falar no WhatsApp"
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center bg-green-500 hover:bg-green-600 transition-all duration-300 z-30"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </motion.button>

      </div>
    </>
  );
};

export default AssistenteCBIA;