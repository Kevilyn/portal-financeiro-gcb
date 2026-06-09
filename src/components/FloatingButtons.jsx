import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bot, ArrowUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const FloatingButtons = () => {
  const handleWhatsApp = () => {
    toast({
      title: "🚧 WhatsApp em breve",
      description: "Em breve você poderá falar conosco pelo WhatsApp!",
    });
  };

  const handleAI = () => {
    toast({
      title: "🚧 CB IA em desenvolvimento",
      description: "Nossa assistente virtual estará disponível em breve!",
    });
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buttons = [
    { icon: MessageCircle, onClick: handleWhatsApp, label: 'WhatsApp', bg: '#25D366', delay: 0 },
    { icon: Bot, onClick: handleAI, label: 'CB IA', bg: '#E31C23', delay: 0.1 },
    { icon: ArrowUp, onClick: handleScrollTop, label: 'Voltar ao topo', bg: '#003DA5', delay: 0.2 }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {buttons.map((button, index) => (
        <motion.button
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: button.delay }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={button.onClick}
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all group relative"
          style={{ backgroundColor: button.bg }}
          aria-label={button.label}
        >
          <button.icon className="w-6 h-6" />
          <span className="absolute right-16 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ fontFamily: 'Inter, sans-serif' }}>
            {button.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default FloatingButtons;