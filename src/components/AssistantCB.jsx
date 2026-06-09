import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AssistantCB = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickReplies = [
    "Como adiantar parcelas?",
    "Como renegociar minha dívida?",
    "Quais são meus benefícios?",
    "Falar com um atendente"
  ];

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 left-6 z-[60] bg-gray-900 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
        aria-label="Assistente Virtual"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-[70] w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Assistente CB</h3>
                  <p className="text-xs text-gray-300">Online agora</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 bg-gray-50 h-80 overflow-y-auto">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs">CB</div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100">
                  Olá! Sou o Assistente CB. Como posso ajudá-lo hoje?
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mt-4">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    className="text-left text-sm bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 p-3 rounded-xl border border-gray-200 transition-colors shadow-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                className="flex-1 bg-gray-100 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <Button size="icon" className="rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AssistantCB;