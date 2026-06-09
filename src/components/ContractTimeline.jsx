import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Clock } from 'lucide-react';

const ContractTimeline = ({ installments }) => {
  if (!installments || installments.length === 0) return null;

  return (
    <div className="py-4 overflow-x-auto">
      <div className="flex items-center min-w-[300px] space-x-2">
        {installments.map((inst, index) => {
          let statusColor = 'bg-gray-200 text-gray-500'; // Default Future
          let Icon = Circle;
          
          if (inst.status === 'Pago') {
            statusColor = 'bg-green-100 text-green-600 border-green-200';
            Icon = Check;
          } else if (inst.status === 'Atrasado') {
            statusColor = 'bg-red-100 text-red-600 border-red-200';
            Icon = Clock;
          } else if (index === 0 && inst.status === 'Aberto') {
            statusColor = 'bg-blue-100 text-blue-600 border-blue-200 ring-2 ring-blue-100'; // Current
            Icon = Clock;
          }

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center flex-1 min-w-[80px]"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${statusColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900">Parc. {inst.number}</p>
                <p className="text-[10px] text-gray-500">{inst.date}</p>
                <p className="text-xs font-medium mt-1">R$ {inst.value}</p>
              </div>
              {index < installments.length - 1 && (
                <div className="w-full h-0.5 bg-gray-100 mt-[-3rem] ml-[50%] -z-10 relative transform translate-y-4" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractTimeline;