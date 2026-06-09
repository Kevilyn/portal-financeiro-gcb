import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
    ChevronLeft, 
    HeartHandshake as Handshake, 
    PackageOpen, 
    AlertCircle, 
    ArrowRight,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';

const SimularAcordoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allContracts = user?.contratos || [];
  
  // TASK 1: Filter to show ONLY overdue contracts
  const overdueContracts = allContracts.filter(
      c => c.status === 'em_atraso' || c.status === 'suspenso'
  );

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4">
        <Helmet><title>Simular Acordo - Portal Financeiro</title></Helmet>

        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar ao Dashboard
        </Button>

        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Handshake className="w-8 h-8 text-blue-600" /> Simular Acordo
            </h1>
            <p className="text-gray-600">
                Escolha um contrato em atraso para ver as opções de negociação e pagamento disponíveis.
            </p>
        </div>

        {/* TASK 2: Informative banner */}
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start shadow-sm mb-8"
        >
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
                <strong>Aviso:</strong> Apenas contratos em atraso podem ter parcelas a simular o acordo. Para adiantar parcelas em dia, utilize a opção "Adiantar Parcelas" no dashboard.
            </p>
        </motion.div>

        {overdueContracts.length > 0 ? (
            <div className="grid gap-4">
                {overdueContracts.map((contract, index) => (
                    <motion.div 
                        key={contract.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                            "bg-white rounded-xl border border-red-200 shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        )}
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                        
                        <div className="flex-1 pl-2">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                {/* TASK 3: Enhanced Contract Cards */}
                                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-gray-200">
                                    Contrato: {contract.numero}
                                </span>
                                <span className="text-red-700 bg-red-100 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-red-200">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span> 
                                    {contract.status === 'suspenso' ? 'Suspenso' : 'Em Atraso'}
                                </span>
                                {contract.diasAtraso > 0 && (
                                    <span className="text-amber-700 bg-amber-50 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 border border-amber-100">
                                        <Clock className="w-3 h-3" /> {contract.diasAtraso} dias de atraso
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{contract.produto}</h3>
                            
                            <div className="mt-3 bg-red-50/50 p-3 rounded-lg border border-red-50 inline-block">
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Valor Total em Atraso</p>
                                <p className="text-2xl font-black text-red-600">
                                    {formatCurrency(contract.valorEmAberto)}
                                </p>
                            </div>
                        </div>

                        {/* TASK 4: Navigation logic */}
                        <Button 
                            onClick={() => navigate(`/dashboard/simular-acordo/${contract.id || contract.numero}`)}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg min-w-[160px] h-12 rounded-xl text-md font-bold transition-transform hover:-translate-y-0.5"
                        >
                            Simular Acordo <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                ))}
            </div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm"
            >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Handshake className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tudo em dia!</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6 text-base">
                    Você não possui contratos em atraso no momento. Continue assim para aproveitar as melhores taxas!
                </p>
                <Button variant="outline" onClick={() => navigate('/dashboard/produtos')} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    Ver Meus Produtos
                </Button>
            </motion.div>
        )}
    </div>
  );
};

export default SimularAcordoPage;