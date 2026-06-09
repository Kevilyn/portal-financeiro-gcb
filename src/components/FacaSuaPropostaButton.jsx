import React from 'react';
import { Button } from '@/components/ui/button';
import { Coins as HandCoins } from 'lucide-react';
import { motion } from 'framer-motion';

const FacaSuaPropostaButton = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex justify-center py-4"
    >
      <Button 
        onClick={onClick}
        size="lg"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 px-8 rounded-full shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        <HandCoins className="w-6 h-6 mr-3" />
        Não gostou das ofertas? Faça sua Proposta
      </Button>
    </motion.div>
  );
};

export default FacaSuaPropostaButton;