import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AIRecommendationCard = () => {
  const { getPersona, user } = useAuth();
  const navigate = useNavigate();
  const persona = getPersona();

  const getRecommendation = () => {
    switch (persona) {
      case 'safe':
        return {
          title: 'Economize R$ 45,00 agora!',
          text: 'Se você adiantar a parcela de Março do seu Carnê Digital hoje, você ganha 5% de desconto.',
          action: 'Adiantar e economizar',
          path: '/dashboard/adiantamento',
          gradient: 'from-green-500 to-emerald-600',
          shadow: 'shadow-green-200'
        };
      case 'risk':
        return {
          title: 'Evite o bloqueio do seu cartão',
          text: 'Temos uma proposta de acordo com entrada reduzida para você regularizar sua situação hoje.',
          action: 'Ver proposta especial',
          path: '/dashboard/simular-acordo',
          gradient: 'from-orange-500 to-amber-600',
          shadow: 'shadow-orange-200'
        };
      case 'critical':
        return {
          title: 'Recupere seu crédito',
          text: 'Campanha Limpa Nome: Descontos de até 90% para quitação à vista. Aproveite!',
          action: 'Negociar dívida',
          path: '/dashboard/simular-acordo',
          gradient: 'from-red-500 to-rose-600',
          shadow: 'shadow-red-200'
        };
      default:
        return {
          title: 'Comece com o pé direito',
          text: 'Abra sua conta digital banQi gratuita e ganhe cashback na primeira compra.',
          action: 'Conhecer banQi',
          path: '/dashboard/banqi',
          gradient: 'from-blue-500 to-indigo-600',
          shadow: 'shadow-blue-200'
        };
    }
  };

  const rec = getRecommendation();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl ${rec.shadow} bg-gradient-to-br ${rec.gradient}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <div className="relative z-10 flex flex-col items-start gap-3"> {/* Added flex-col and gap for consistency */}
        <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
          <Lightbulb className="w-4 h-4 text-yellow-300" />
          <span className="text-xs font-bold uppercase tracking-wide">Dica Inteligente</span>
        </div>
        
        <h3 className="text-2xl font-bold">{rec.title}</h3> {/* No mb-2 here, relies on gap-3 from parent */}
        <p className="text-white/90 max-w-lg leading-relaxed">{rec.text}</p> {/* No mb-6 here, relies on gap-3 from parent */}
        
        <Button 
          onClick={() => navigate(rec.path)}
          className="bg-white text-gray-900 hover:bg-gray-100 border-none font-bold text-base px-6 h-12 shadow-lg hover:shadow-xl transition-all"
        >
          {rec.action} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default AIRecommendationCard;