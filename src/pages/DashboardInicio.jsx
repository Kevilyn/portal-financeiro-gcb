import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgePercent,
  Banknote,
  Barcode,
  Bus,
  Calendar,
  CreditCard,
  Package,
  Plane,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingDown,
  WalletCards
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import CreditoPreAprovadoSection from '@/components/CreditoPreAprovadoSection';
import { formatCurrency } from '@/lib/currencyUtils';

const getOpenInstallments = (contracts = []) =>
  contracts.flatMap((contract) =>
    (contract.parcelas || [])
      .filter((installment) => installment.status !== 'paga')
      .map((installment) => ({ ...installment, contract }))
  );

const getBestAgreementOffer = (contracts = []) => {
  const candidates = contracts.filter((contract) => contract.valorEmAberto > 0);
  if (!candidates.length) return null;

  const scored = candidates.map((contract) => {
    const overdueWeight = contract.status === 'suspenso' ? 0.9 : contract.status === 'em_atraso' ? 0.82 : 0.35;
    const discount = Math.min(contract.valorEmAberto * overdueWeight, contract.valorEmAberto - 20);
    return {
      contract,
      discount,
      finalValue: Math.max(contract.valorEmAberto - discount, 20),
      percentage: Math.round((discount / contract.valorEmAberto) * 100)
    };
  });

  return scored.sort((a, b) => b.discount - a.discount)[0];
};

const DashboardInicio = () => {
  const { user, isOverdue, isSuspended, isNewUser, isLead, selectContract } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const contracts = user.contratos || [];
  const openInstallments = getOpenInstallments(contracts);
  const bestOffer = getBestAgreementOffer(contracts);
  const firstName = user.nome ? user.nome.split(' ')[0] : 'Cliente';
  const totalOpen = contracts.reduce((sum, contract) => sum + (contract.valorEmAberto || 0), 0);
  const overdueCount = contracts.filter((contract) => contract.status === 'em_atraso' || contract.status === 'suspenso').length;
  const isDebtJourney = isOverdue() || isSuspended();
  const isProductJourney = !isDebtJourney;

  const statusInfo = isSuspended()
    ? { label: 'Suspenso', detail: 'Regularize para recuperar seus benefícios.', className: 'bg-red-50 text-red-700 border-red-200' }
    : isOverdue()
      ? { label: 'Em atraso', detail: 'Existem parcelas esperando sua atenção.', className: 'bg-orange-50 text-orange-700 border-orange-200' }
      : isLead() || isNewUser()
        ? { label: 'Novo cliente', detail: 'Complete seus dados para ver ofertas.', className: 'bg-blue-50 text-blue-700 border-blue-200' }
        : { label: 'Em dia', detail: 'Seu relacionamento está saudável.', className: 'bg-green-50 text-green-700 border-green-200' };

  const handleBestOffer = () => {
    if (bestOffer?.contract) {
      selectContract(bestOffer.contract);
    }
    navigate('/dashboard/simular-acordo-lista');
  };

  const summaryCards = [
    {
      label: 'Contratos',
      value: contracts.length,
      helper: `${openInstallments.length} parcelas em aberto`,
      icon: Package,
      color: 'text-blue-700',
      bg: 'bg-blue-50'
    },
    {
      label: 'Saldo em aberto',
      value: formatCurrency(totalOpen),
      helper: overdueCount ? `${overdueCount} contrato(s) em atraso` : 'Sem atraso identificado',
      icon: WalletCards,
      color: 'text-slate-700',
      bg: 'bg-slate-50'
    },
    {
      label: 'Próximo vencimento',
      value: user.proximoVencimento ? new Date(user.proximoVencimento).toLocaleDateString('pt-BR') : 'Sem data',
      helper: user.proximoVencimento ? 'Acompanhe para evitar encargos' : 'Nenhuma parcela futura',
      icon: Calendar,
      color: 'text-amber-700',
      bg: 'bg-amber-50'
    },
    {
      label: 'Status',
      value: statusInfo.label,
      helper: statusInfo.detail,
      icon: ShieldCheck,
      color: isDebtJourney ? 'text-red-700' : 'text-green-700',
      bg: isDebtJourney ? 'bg-red-50' : 'bg-green-50'
    }
  ];

  const debtJourneyCards = [
    {
      title: 'Segunda Via',
      tag: 'Intenção de pagamento',
      description: 'Pagar uma parcela já aberta ou próxima do vencimento, sem alterar contrato.',
      result: 'Boleto atualizado para pagamento.',
      icon: Barcode,
      path: '/dashboard/segunda-via',
      cta: 'Emitir boleto',
      tone: 'border-blue-200 bg-blue-50 text-blue-800'
    },
    {
      title: 'Simular Acordo',
      tag: 'Intenção de negociação',
      description: 'Consultar descontos, entrada, parcelas e datas antes de decidir.',
      result: 'Opções visíveis, sem compromisso.',
      icon: Banknote,
      path: '/dashboard/simular-acordo-lista',
      cta: 'Ver condições',
      tone: 'border-amber-200 bg-amber-50 text-amber-800'
    },
    {
      title: 'Renegociar',
      tag: 'Conversão de negociação',
      description: 'Formalizar uma nova condição para regularizar a dívida.',
      result: 'Acordo gerado e entrada pronta para pagamento.',
      icon: BadgePercent,
      path: '/dashboard/renegociar',
      cta: 'Renegociar agora',
      tone: 'border-red-200 bg-red-50 text-red-800'
    }
  ];

  const productJourneyCards = [
    {
      title: 'Pagar parcela',
      tag: 'Conta em dia',
      description: 'Emitir segunda via de parcela futura ou acompanhar vencimento próximo.',
      result: 'Pagamento feito sem mudar condições.',
      icon: Barcode,
      path: '/dashboard/segunda-via',
      cta: 'Ver boletos',
      tone: 'border-blue-200 bg-blue-50 text-blue-800'
    },
    {
      title: 'Adiantar parcelas',
      tag: 'Economia',
      description: 'Pagar parcelas antes do vencimento e reduzir juros quando houver desconto.',
      result: 'Parcelas antecipadas e contrato mais leve.',
      icon: TrendingDown,
      path: '/dashboard/adiantar-parcelas-lista',
      cta: 'Adiantar agora',
      tone: 'border-green-200 bg-green-50 text-green-800'
    },
    {
      title: 'Produtos disponíveis',
      tag: 'Relacionamento saudável',
      description: 'Consultar limites, produtos pré-aprovados e ofertas disponíveis para seu CPF.',
      result: 'Produtos e limites apresentados.',
      icon: ShoppingBag,
      path: '/dashboard/meus-produtos',
      cta: 'Ver produtos',
      tone: 'border-red-200 bg-red-50 text-red-800'
    }
  ];

  const dailyOffers = [
    {
      title: 'iPhone 15',
      subtitle: 'Oferta do dia com parcelamento facilitado',
      price: 'a partir de R$ 219/mês',
      icon: Smartphone,
      tone: 'bg-zinc-950 text-white'
    },
    {
      title: 'Geladeira Frost Free',
      subtitle: 'Condição especial para clientes do portal',
      price: 'até 18x no Carnê Digital',
      icon: ShoppingBag,
      tone: 'bg-blue-50 text-blue-900'
    },
    {
      title: 'Smart TV 50"',
      subtitle: 'Leve entretenimento com limite pré-aprovado',
      price: 'entrada reduzida',
      icon: CreditCard,
      tone: 'bg-red-50 text-red-900'
    }
  ];

  const services = [
    { title: 'Consórcio', description: 'Planeje carro, moto ou casa.', icon: BadgePercent },
    { title: 'CB Viagens', description: 'Pacotes e passagens em oferta.', icon: Plane },
    { title: 'Recarga de celular', description: 'Recarregue em poucos cliques.', icon: RefreshCw },
    { title: 'Bilhete Único', description: 'Coloque crédito no transporte.', icon: Bus }
  ];

  const journeyCards = isDebtJourney ? debtJourneyCards : productJourneyCards;

  return (
    <>
      <Helmet><title>Início - Portal Financeiro Casas Bahia</title></Helmet>

      <div className="max-w-6xl mx-auto pb-16 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-[#E31C23]">Portal Financeiro Casas Bahia</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-gray-950">
              Olá, {firstName}. {isDebtJourney ? 'Vamos regularizar sua situação.' : 'Sua jornada está em dia.'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm md:text-base text-gray-600">
              {isDebtJourney
                ? 'Tudo aqui prioriza pagamento, simulação e renegociação para resolver a inadimplência.'
                : 'Acompanhe contratos, produtos disponíveis, limites pré-aprovados e serviços úteis em um só lugar.'}
            </p>
          </div>
          <div className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${statusInfo.className}`}>
            <ShieldCheck className="h-4 w-4" />
            {statusInfo.label}
          </div>
        </motion.section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-950">{card.value}</p>
                </div>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">{card.helper}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-950">{isDebtJourney ? 'Jornada de regularização' : 'Jornada em dia'}</h2>
            <p className="text-sm text-gray-600">
              {isDebtJourney
                ? 'Escolha entre pagar uma parcela, pesquisar condições ou fechar uma renegociação.'
                : 'Escolha entre pagar uma parcela, adiantar pagamentos ou consultar produtos disponíveis.'}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {journeyCards.map((journey) => (
              <button
                key={journey.title}
                type="button"
                onClick={() => navigate(journey.path)}
                className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E31C23] hover:shadow-md"
              >
                <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${journey.tone}`}>
                  <journey.icon className="h-4 w-4" />
                  {journey.tag}
                </div>
                <h3 className="text-lg font-bold text-gray-950">{journey.title}</h3>
                <p className="mt-2 min-h-[48px] text-sm text-gray-600">{journey.description}</p>
                <p className="mt-3 text-xs font-semibold text-gray-500">Resultado: {journey.result}</p>
                <span className="mt-5 inline-flex items-center text-sm font-bold text-[#E31C23]">
                  {journey.cta} <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </section>

        {isDebtJourney && bestOffer && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-lg border border-red-100 bg-gradient-to-r from-[#E31C23] to-[#B31218] text-white shadow-lg"
          >
            <div className="grid gap-6 p-6 md:grid-cols-[1.5fr_1fr] md:p-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase">
                  <Sparkles className="h-4 w-4" />
                  Melhor oferta para regularizar
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Até {bestOffer.percentage}% de desconto para negociar {bestOffer.contract.produto}
                </h2>
                <p className="mt-3 max-w-xl text-sm text-white/90">
                  Essa oferta considera seu saldo em aberto e a situação atual do contrato {bestOffer.contract.numero}.
                </p>
                <Button onClick={handleBestOffer} className="mt-6 bg-white text-[#B31218] hover:bg-gray-100">
                  Simular melhor acordo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="rounded-lg bg-white/12 p-5">
                <p className="text-sm text-white/75">Economia estimada</p>
                <p className="mt-1 text-3xl font-black">{formatCurrency(bestOffer.discount)}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/65">De</p>
                    <p className="font-bold line-through">{formatCurrency(bestOffer.contract.valorEmAberto)}</p>
                  </div>
                  <div>
                    <p className="text-white/65">Por</p>
                    <p className="font-bold">{formatCurrency(bestOffer.finalValue)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {isDebtJourney && (
          <section className="rounded-lg border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-950">Próximo passo recomendado</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Se você já decidiu resolver, vá direto para renegociação. Se ainda quer comparar, simule primeiro.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={() => navigate('/dashboard/simular-acordo-lista')}>
                  Simular opções
                </Button>
                <Button onClick={() => navigate('/dashboard/renegociar')} className="bg-[#E31C23] hover:bg-[#c41a1f]">
                  Renegociar agora
                </Button>
              </div>
            </div>
          </section>
        )}

        {isProductJourney && <CreditoPreAprovadoSection />}

        {isProductJourney && (
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">Oferta do dia</h2>
                <p className="text-sm text-gray-600">Produtos selecionados para clientes Casas Bahia.</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/dashboard/meus-produtos')} className="hidden sm:inline-flex">
                Ver produtos
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {dailyOffers.map((offer) => (
                <div key={offer.title} className={`rounded-lg border border-gray-200 p-5 shadow-sm ${offer.tone}`}>
                  <offer.icon className="h-7 w-7" />
                  <h3 className="mt-4 text-lg font-bold">{offer.title}</h3>
                  <p className="mt-2 min-h-[40px] text-sm opacity-80">{offer.subtitle}</p>
                  <p className="mt-4 text-sm font-bold">{offer.price}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {isProductJourney && (
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-950">Outros serviços</h2>
              <p className="text-sm text-gray-600">Atalhos rápidos para resolver pequenas necessidades do dia a dia.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {services.map((service) => (
                <button
                  key={service.title}
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#E31C23] hover:shadow-md"
                  onClick={() => navigate('/dashboard/ajuda')}
                >
                  <service.icon className="h-5 w-5 text-[#E31C23]" />
                  <h3 className="mt-3 text-sm font-bold text-gray-950">{service.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{service.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {isProductJourney && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-2">
                  <TrendingDown className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-950">Adiantar parcelas</h2>
                  <p className="text-sm text-gray-600">Reduza juros pagando antes do vencimento.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/dashboard/adiantar-parcelas-lista')} className="mt-5 w-full bg-green-700 hover:bg-green-800">
                Ver parcelas disponíveis
              </Button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Banknote className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-950">Casas Bahia Pay</h2>
                  <p className="text-sm text-gray-600">Conta digital, Pix e soluções financeiras Casas Bahia.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/dashboard/casas-bahia-pay')} variant="outline" className="mt-5 w-full">
                Conhecer Casas Bahia Pay
              </Button>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default DashboardInicio;
