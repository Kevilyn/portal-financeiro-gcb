import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Calculator, FileSignature, CreditCard, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ActivityTimeline = ({ activities, loading, hasMore, onLoadMore }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">Nenhuma atividade registrada ainda.</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4 text-blue-500" />;
      case 'simulation': return <Calculator className="w-4 h-4 text-purple-500" />;
      case 'agreement': return <FileSignature className="w-4 h-4 text-green-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'login': return 'bg-blue-50 ring-blue-100';
      case 'simulation': return 'bg-purple-50 ring-purple-100';
      case 'agreement': return 'bg-green-50 ring-green-100';
      case 'payment': return 'bg-orange-50 ring-orange-100';
      default: return 'bg-gray-50 ring-gray-100';
    }
  };

  return (
    <div className="relative space-y-8 pl-4 pr-2 py-2 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
      <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
          {activities.map((activity, index) => (
            <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-8 group"
            >
                {/* Timeline Dot */}
                <div className={cn(
                    "absolute left-[-9px] top-1 w-5 h-5 rounded-full border-2 border-white ring-2 flex items-center justify-center transition-transform group-hover:scale-110",
                    getBgColor(activity.type)
                )}>
                   {getIcon(activity.type)}
                </div>

                <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {activity.type === 'login' ? 'Acesso' : 
                             activity.type === 'simulation' ? 'Simulação' : 
                             activity.type === 'agreement' ? 'Acordo' : 
                             activity.type === 'payment' ? 'Pagamento' : 'Atividade'}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(activity.timestamp).toLocaleDateString('pt-BR')} • {new Date(activity.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <p className="text-gray-800 font-medium text-sm md:text-base">
                        {activity.description}
                    </p>
                </div>
            </motion.div>
          ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
            <Button 
                variant="outline" 
                onClick={onLoadMore} 
                disabled={loading}
                className="bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
            >
                {loading ? 'Carregando...' : 'Carregar Mais'} <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;