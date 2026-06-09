import React from 'react';
import { motion } from 'framer-motion';
import { Award, Gift, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const FidelityProgressCard = () => {
  const { user } = useAuth();
  
  if (!user?.fidelity) return null;
  const { level, progress, nextBenefit } = user.fidelity;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 z-0 group-hover:scale-110 transition-transform" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Programa Fidelidade</p>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" /> Nível {level}
            </h3>
          </div>
          <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
            VIP
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progresso atual</span>
            <span className="font-bold text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Próxima recompensa</p>
            <p className="text-sm font-bold text-gray-900">{nextBenefit}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};

export default FidelityProgressCard;