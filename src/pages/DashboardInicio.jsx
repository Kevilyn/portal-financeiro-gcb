import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Calendar, 
  TrendingUp,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Bot,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FidelityBenefitsCard from '@/components/FidelityBenefitsCard';
import AIRecommendationCard from '@/components/AIRecommendationCard';
import CreditoPreAprovadoSection from '@/components/CreditoPreAprovadoSection';
import { useToast } from '@/components/ui/use-toast';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-left focus:outline-none hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors"
      >
        <span className="font-medium text-gray-800 text-sm">{question}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-3 text-sm text-gray-600 px-2">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardInicio = () => {
  const { user, isOverdue, isSuspended, isNewUser, isLead, getPersona } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!user) return null;

  const isNewClient = isNewUser() || user.cpf.replace(/\D/g, '') === '99999999999';

  const handleFeatureNotImplemented = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "🚧 Este recurso ainda não está implementado – mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
    });
  };

  const getStatusInfo = () => {
    if (isSuspended()) return { label: 'Suspenso', color: 'text-red-600', bg: 'bg-red-50' };
    if (isOverdue()) return { label: 'Em Atraso', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (isLead()) return { label: 'Lead', color: 'text-purple-600', bg: 'bg-purple-50' };
    return { label: 'Em Dia', color: 'text-green-600', bg: 'bg-green-50' };
  };
  const statusInfo = getStatusInfo();

  const getRequiredAction = () => {
    if (isOverdue()) {
        return {
            type: 'critical',
            title: 'Ação Necessária: Regularize sua situação',
            message: 'Identificamos parcelas em atraso no seu CPF. Evite bloqueios e negocie agora.',
            buttonText: 'Regularizar Agora',
            action: () => navigate('/dashboard/simular-acordo'),
            styleClass: 'bg-red-50 border-l-4 border-red-500 text-red-900',
            icon: AlertTriangle,
            iconClass: 'text-red-600',
            buttonClass: 'bg-red-600 hover:bg-red-700'
        };
    }
    
    if (isNewClient) {
        return {
            type: 'info',
            title: 'Bem-vindo! Complete seu perfil',
            message: 'Aproveite descontos exclusivos configurando seus produtos iniciais.',
            buttonText: 'Ver Produtos',
            action: () => navigate('/dashboard/produtos'),
            styleClass: 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
            icon: Star,
            iconClass: 'text-blue-600',
            buttonClass: 'bg-blue-600 hover:bg-blue-700'
        };
    }

    if (user.proximoVencimento) {
        const today = new Date();
        const dueDate = new Date(user.proximoVencimento);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7 && diffDays >= 0) {
            return {
                type: 'warning',
                title: 'Fatura próxima do vencimento',
                message: `Sua fatura vence em ${diffDays} dias. Antecipe o pagamento e libere limite.`,
                buttonText: 'Pagar Agora',
                action: () => navigate('/dashboard/pagamentos'),
                styleClass: 'bg-amber-50 border-l-4 border-amber-500 text-amber-900',
                icon: Calendar,
                iconClass: 'text-amber-600',
                buttonClass: 'bg-amber-600 hover:bg-amber-700'
            };
        }
    }
    return null;
  };

  const actionBanner = getRequiredAction();

  const getClientScore = () => {
    if (isOverdue() || isSuspended() || isNewUser() || isLead()) return null;
    
    const count = user.contratos ? user.contratos.length : 0;
    
    let config = {
        level: 'Bronze',
        gradient: 'from-orange-50 to-amber-50',
        textColor: 'text-amber-800',
        badgeColor: 'bg-amber-100 text-amber-800',
        icon: Star
    };
    
    if (count >= 3) {
        config = {
            level: 'Ouro',
            gradient: 'from-yellow-50 to-amber-100',
            textColor: 'text-yellow-800',
            badgeColor: 'bg-yellow-200 text-yellow-900',
            icon: Star
        };
    } else if (count >= 2) {
        config = {
            level: 'Prata',
            gradient: 'from-slate-50 to-gray-200',
            textColor: 'text-slate-700',
            badgeColor: 'bg-slate-200 text-slate-800',
            icon: Star
        };
    }

    return config;
  };

  const clientScore = getClientScore();

  return (
    <>
      <Helmet><title>Dashboard - Portal Casas Bahia</title></Helmet>

      <div className="max-w-6xl mx-auto pb-16">
        
        {/* Section 1: Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
           <div>
             <h1 className="text-2xl font-bold text-gray-900">
               👋 Bem-vindo ao seu Portal, {user.nome ? user.nome.split(' ')[0] : 'Cliente'}!
             </h1>
             {clientScore && (
                 <p className={`text-sm font-semibold mt-1 flex items-center gap-1 ${clientScore.textColor}`}>
                    <Star className="w-4 h-4" /> Cliente {clientScore.level}
                 </p>
             )}
           </div>
        </motion.div>

        {/* TASK 1: Alert Banner */}
        {actionBanner && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${actionBanner.styleClass}`}
            >
                <div className="flex gap-4">
                    <div className={`p-2 rounded-full bg-white/50 ${actionBanner.iconClass}`}>
                        <actionBanner.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">{actionBanner.title}</h3>
                        <p className="text-sm opacity-90">{actionBanner.message}</p>
                    </div>
                </div>
                <Button onClick={actionBanner.action} className={`${actionBanner.buttonClass} text-white shadow-md border-0 shrink-0`}>
                    {actionBanner.buttonText}
                </Button>
            </motion.div>
        )}

        {/* TASK 2: Client Score (Only for em_dia) */}
        {clientScore && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r ${clientScore.gradient} p-6 rounded-xl border border-white shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                         <clientScore.icon className={`w-8 h-8 ${clientScore.textColor} fill-current`} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Seu Nível</p>
                        <h2 className={`text-3xl font-bold ${clientScore.textColor}`}>Cliente {clientScore.level}</h2>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${clientScore.badgeColor}`}>
                        ⚡ Desconto em Adiantamento
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${clientScore.badgeColor}`}>
                        ⭐ Prioridade no Atendimento
                    </span>
                </div>
            </motion.div>
        )}

        {/* TASK 3: Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full -mr-16 -mt-16"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">Recomendado</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">Adiantamento de Parcelas</h3>
                <p className="text-gray-600 text-sm mb-6 relative z-10 h-10">
                    Pague suas parcelas antes do vencimento e ganhe descontos progressivos nos juros.
                </p>
                <Button 
                    onClick={() => navigate('/dashboard/adiantar-parcelas')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                    Adiantar Agora <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                        <CreditCard className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">Simular Acordo</h3>
                <p className="text-gray-600 text-sm mb-6 relative z-10 h-10">
                    Negocie suas dívidas com condições especiais e limpe seu nome agora mesmo.
                </p>
                <Button 
                    onClick={() => navigate('/dashboard/simular-acordo')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                    Fazer Simulação <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </div>

        {/* Pre-approved Credit Section */}
        <CreditoPreAprovadoSection />

        {/* Section: Produtos Recomendados (NEW CLIENT ONLY) */}
        {isNewClient && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ✨ Produtos Recomendados para Você
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col border border-gray-100 h-full">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                        💳
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Cartão de Crédito</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                        Peça já o seu Cartão Casas Bahia e ganhe descontos exclusivos em suas compras.
                    </p>
                    <Button onClick={handleFeatureNotImplemented} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                        Saiba Mais
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col border border-gray-100 h-full">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                        💸
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Empréstimo Pessoal</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                        Dinheiro rápido na conta sem burocracia para você usar como quiser.
                    </p>
                    <Button onClick={handleFeatureNotImplemented} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                        Saiba Mais
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col border border-gray-100 h-full">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                        🛡️
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Seguro Proteção</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                         Garanta o pagamento das suas parcelas em caso de imprevistos financeiros.
                    </p>
                    <Button onClick={handleFeatureNotImplemented} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                        Saiba Mais
                    </Button>
                </div>
             </div>
          </motion.div>
        )}

        {/* Section: Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <span className="text-gray-500 text-sm font-medium">Contratos Ativos</span>
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.contratos?.length || 0}</p>
                <p className="text-xs text-gray-400">Total financiado</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <span className="text-gray-500 text-sm font-medium">Próximo Vencimento</span>
                    <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                    {user.proximoVencimento ? new Date(user.proximoVencimento).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
                <p className="text-xs text-gray-400">Fique atento à data</p>
            </div>

             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <span className="text-gray-500 text-sm font-medium">Valor Total</span>
                    <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                    R$ {(user.valorTotal || 0).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-400">Saldo devedor atual</p>
            </div>

            <div className={`p-4 rounded-xl shadow-sm border flex flex-col justify-between h-32 hover:shadow-md transition-shadow ${statusInfo.bg} ${statusInfo.color.replace('text', 'border')}`}>
                <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${statusInfo.color}`}>Status da Conta</span>
                    <ShieldCheck className={`w-5 h-5 ${statusInfo.color}`} />
                </div>
                <p className={`text-2xl font-bold ${statusInfo.color}`}>{statusInfo.label}</p>
                <p className={`text-xs ${statusInfo.color} opacity-80`}>Atualizado hoje</p>
            </div>
        </div>

        {/* Section: AI Recommendation */}
        <div className="mb-6">
            <AIRecommendationCard />
        </div>

        {/* Section: Fidelity card */}
        <div className="mb-6">
            <FidelityBenefitsCard />
        </div>

        {/* Section: Help Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Card 1: Dúvidas sobre adiantamento */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-blue-50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        ❓ Dúvidas sobre adiantamento?
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Tire suas dúvidas e saiba como podemos te ajudar.
                    </p>
                </div>
                <div className="p-5 flex-1 space-y-1">
                    <FAQItem 
                        question="Como funciona o desconto progressivo?" 
                        answer="Quanto mais parcelas você adiantar, maior será o desconto aplicado automaticamente sobre os juros do período antecipado."
                    />
                    <FAQItem 
                        question="Posso adiantar qualquer parcela?" 
                        answer="Sim, você pode escolher pagar as últimas parcelas (para reduzir o prazo) ou as próximas (para aliviar o orçamento), conforme sua preferência."
                    />
                </div>
                <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50/30">
                    <Button onClick={handleFeatureNotImplemented} variant="outline" className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-700">
                        <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </Button>
                    <Button onClick={handleFeatureNotImplemented} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Bot className="w-4 h-4 mr-2" /> Assistente
                    </Button>
                </div>
            </div>

            {/* Card 2: Ajuda com acordo */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-green-50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        🤝 Precisa de ajuda com o acordo?
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Estamos aqui para facilitar sua negociação.
                    </p>
                </div>
                <div className="p-5 flex-1 space-y-1">
                    <FAQItem 
                        question="Quais são as formas de pagamento?" 
                        answer="Aceitamos Pix para baixa imediata, boleto bancário (compensação em até 3 dias) e cartão de crédito em até 12x."
                    />
                    <FAQItem 
                        question="O nome limpa na hora?" 
                        answer="Após a identificação do pagamento da primeira parcela, solicitamos a baixa nos órgãos de proteção ao crédito em até 5 dias úteis."
                    />
                </div>
                <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50/30">
                     <Button onClick={handleFeatureNotImplemented} variant="outline" className="flex-1 border-green-200 hover:bg-green-50 text-green-700">
                        <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </Button>
                    <Button onClick={handleFeatureNotImplemented} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <Bot className="w-4 h-4 mr-2" /> Assistente
                    </Button>
                </div>
            </div>

        </div>

      </div>
    </>
  );
};

export default DashboardInicio;