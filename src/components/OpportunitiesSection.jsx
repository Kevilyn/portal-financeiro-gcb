import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getAllOpportunities } from '@/lib/OpportunitiesCalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Percent, Sparkles, Clock, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';

const OpportunitiesSection = ({ contract, onSelectOpportunity }) => {
  const opportunities = useMemo(() => getAllOpportunities(contract), [contract]);

  if (!contract) return null;

  const getIcon = (type) => {
    switch(type) {
        case 'vista': return <Percent className="w-6 h-6" />;
        case 'exclusiva': return <Sparkles className="w-6 h-6" />;
        case 'parcelada': return <Clock className="w-6 h-6" />;
        case 'curto_prazo': return <Zap className="w-6 h-6" />;
        default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {opportunities.map((opp, index) => (
            <motion.div
                key={opp.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col h-full min-h-[340px] bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 relative overflow-hidden"
            >
                {/* Header Gradient Stripe */}
                <div className={cn("h-1.5 w-full absolute top-0 left-0", opp.color)}></div>
                
                {/* Content Container */}
                <div className="flex-1 flex flex-col items-center text-center p-6 gap-2">
                    
                    {/* Header: Icon (Centered Top) */}
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-gray-600 transition-colors group-hover:bg-opacity-20 shadow-sm mb-3")}>
                        {getIcon(opp.type)}
                    </div>

                    {/* Title & Label */}
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{opp.title}</h4>
                    <Badge variant="secondary" className={cn("text-[10px] font-bold px-2 py-0.5 border-0 uppercase tracking-wide", opp.badgeColor)}>
                        {opp.label}
                    </Badge>

                    {/* Pricing Highlight - Center Stage */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center py-4 space-y-2 bg-gray-50/50 rounded-lg border border-gray-100/50 my-2 mt-4">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total a Pagar</span>
                        <div className="flex items-baseline justify-center gap-0.5">
                             <span className={cn("text-2xl font-extrabold tracking-tight text-gray-900")}>
                                {formatCurrency(opp.valorTotal)}
                             </span>
                        </div>
                        
                        {opp.desconto > 0 ? (
                             <span className="text-[11px] font-bold text-green-600 px-2 py-0.5 rounded-full">
                                Economia: {formatCurrency(opp.desconto)}
                             </span>
                        ) : (
                             <span className="text-[11px] text-gray-300 block h-5 opacity-0 select-none">Sem desconto</span>
                        )}
                        
                        <div className="h-px w-16 bg-gray-200 my-2"></div>

                        <p className="text-sm font-medium text-gray-700">
                            {opp.parcelas === 1 ? 'Pagamento único' : `${opp.parcelas}x de ${formatCurrency(opp.valorParcela)}`}
                        </p>
                    </div>

                    {/* Footer Action */}
                    <div className="w-full mt-2">
                        <Button 
                            onClick={() => onSelectOpportunity(opp)}
                            className={cn("w-full h-10 font-bold shadow-sm transition-all text-white rounded-lg text-sm hover:brightness-110 hover:-translate-y-0.5", opp.color)}
                        >
                            Selecionar Oferta <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesSection;