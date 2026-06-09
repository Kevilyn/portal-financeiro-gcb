import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WhatsAppButton = ({ whatsappNumber = "5511999999999", className = "" }) => {
  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}`;
    window.open(url, '_blank');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={handleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`fixed bottom-24 right-6 z-40 w-[60px] h-[60px] bg-[#25D366] hover:bg-[#1FA855] rounded-full shadow-2xl flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-green-300 ${className}`}
            aria-label="Fale conosco no WhatsApp"
          >
            <MessageCircle className="w-8 h-8 fill-current" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Fale conosco no WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WhatsAppButton;