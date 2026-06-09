import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
  const handleClick = () => {
    const phone = '5511987654321';
    const message = encodeURIComponent('Olá, preciso de ajuda com minha conta Casas Bahia');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(37, 211, 102, 0.5)' }}
      className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-300"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-8 h-8" fill="white" stroke="none" />
    </motion.button>
  );
};

export default FloatingWhatsApp;