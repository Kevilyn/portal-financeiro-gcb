import React from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Tag, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FidelityBenefitsCard = () => {
  const benefits = [
    { icon: Gift, text: 'R$ 100 de cashback', subtext: 'Ao parcelar em 3x' },
    { icon: Tag, text: '10% OFF', subtext: 'Cupom mensal exclusivo' },
    { icon: TrendingUp, text: 'Aumento de limite', subtext: '+ R$ 50,00 garantido' },
    { icon: Shield, text: 'Desconto na quitação', subtext: 'Até 30% off' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Star className="w-48 h-48" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#CD7F32] p-2 rounded-lg">
             <Star className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Cliente Bronze</h2>
            <p className="text-gray-400 text-sm">Aproveite seus benefícios exclusivos por estar em dia!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-colors flex flex-col items-start gap-2 min-h-[160px]"> {/* Adjusted padding, added flex-col, items-start, gap-2, min-h */}
              <benefit.icon className="w-10 h-10 text-[#CD7F32]" /> {/* Icon size adjusted */}
              <p className="font-bold text-lg">{benefit.text}</p> {/* Removed mb-1 */}
              <p className="text-sm text-gray-400">{benefit.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FidelityBenefitsCard;