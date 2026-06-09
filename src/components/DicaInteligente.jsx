import React, { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const tips = [
  { title: "Valor Mínimo", text: "Sabia que ofertas acima de R$ 50,00 têm 30% mais chances de aprovação imediata?" },
  { title: "Simulador vs Proposta", text: "Use o Simulador para ver opções garantidas ou 'Faça sua Proposta' para tentar um desconto maior." },
  { title: "Aprovação Rápida", text: "Pagamentos via PIX são compensados na hora e liberam seu limite mais rápido." },
  { title: "Validade", text: "As propostas aprovadas têm validade de 24 horas. Garanta seu desconto hoje!" }
];

const DicaInteligente = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [tip, setTip] = useState(null);

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  if (!tip || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className="relative bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm mb-6 flex items-start gap-3"
      >
        <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5">
           <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1">
           <h4 className="font-bold text-blue-900 text-sm mb-1">Dica Inteligente: {tip.title}</h4>
           <p className="text-blue-800 text-sm leading-relaxed">{tip.text}</p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-blue-400 hover:text-blue-600 transition-colors p-1"
        >
           <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default DicaInteligente;