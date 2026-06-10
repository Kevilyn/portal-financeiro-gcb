import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BadgePercent, CheckCircle2, CreditCard, FileText, PackageOpen, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgreementFiltersBar from '@/components/AgreementFiltersBar';
import AgreementSummaryCard from '@/components/AgreementSummaryCard';
import AgreementDetailPanel from '@/components/AgreementDetailPanel';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currencyUtils';

const isOverdueContract = (contract) => contract.status === 'em_atraso' || contract.status === 'suspenso';

const normalizeStatus = (status) => {
  const value = String(status || 'active').toLowerCase();
  if (['paid', 'pago', 'paga', 'quitado'].includes(value)) return 'paid';
  if (['overdue', 'vencido', 'vencida', 'atrasado', 'em_atraso'].includes(value)) return 'overdue';
  if (['pending', 'pendente'].includes(value)) return 'pending';
  return 'active';
};

const normalizeAgreement = (agreement) => {
  const value = Number(agreement.value ?? agreement.agreedAmount ?? agreement.valor ?? 0);
  const originalValue = Number(agreement.originalValue ?? agreement.originalAmount ?? value);
  const dueDate = agreement.dueDate || agreement.newDueDate || agreement.date || agreement.createdAt || new Date().toISOString();
  const createdAt = agreement.createdAt || agreement.date || new Date().toISOString();
  const installments = Number(agreement.installments ?? agreement.installmentsCount ?? agreement.parcelas ?? 1);
  const contractRef = agreement.contractId || agreement.productId || agreement.contractNumber || agreement.numero || '';

  return {
    ...agreement,
    value,
    originalValue,
    dueDate,
    createdAt,
    installments,
    contractRef,
    status: normalizeStatus(agreement.status),
    product: agreement.product || agreement.productName || agreement.type || 'Acordo financeiro',
    paymentMethod: agreement.paymentMethod || 'Boleto'
  };
};

const dedupeAgreements = (agreements) => {
  const bySignature = new Map();

  agreements.map(normalizeAgreement).forEach((agreement) => {
    const dateKey = agreement.dueDate ? String(agreement.dueDate).slice(0, 10) : '';
    const valueKey = Math.round((agreement.value || 0) * 100);
    const refKey = agreement.contractRef || agreement.product;
    const signature = `${refKey}|${valueKey}|${dateKey}`;
    const current = bySignature.get(signature);

    if (!current) {
      bySignature.set(signature, agreement);
      return;
    }

    const currentCompleteness = Number(Boolean(current.product)) + Number(Boolean(current.contractId)) + Number(Boolean(current.dueDate));
    const nextCompleteness = Number(Boolean(agreement.product)) + Number(Boolean(agreement.contractId)) + Number(Boolean(agreement.dueDate));
    if (nextCompleteness > currentCompleteness) {
      bySignature.set(signature, agreement);
    }
  });

  return Array.from(bySignature.values());
};

const EmptyAgreementsState = ({ type, eligibleContracts, onPrimary, onSecondary }) => {
  const config = {
    debt: {
      icon: BadgePercent,
      title: 'Nenhum acordo formalizado ainda',
      description: 'Seu CPF tem contratos em atraso, mas ainda não existe acordo ativo. O próximo passo é simular ou renegociar uma condição.',
      primary: 'Simular acordo',
      secondary: 'Renegociar agora',
      tone: 'bg-red-50 text-red-700 border-red-100'
    },
    product: {
      icon: CheckCircle2,
      title: 'Nenhum acordo ativo',
      description: 'Seus contratos estão em dia. Esta área só exibirá renegociações, adiantamentos ou acordos que você formalizar.',
      primary: 'Ver produtos',
      secondary: 'Adiantar parcelas',
      tone: 'bg-green-50 text-green-700 border-green-100'
    },
    acquisition: {
      icon: PackageOpen,
      title: 'Sem acordos por enquanto',
      description: 'Você ainda não tem produtos contratados. Quando houver contrato, acordo ou antecipação, tudo aparecerá aqui.',
      primary: 'Conhecer produtos',
      secondary: 'Casas Bahia Pay',
      tone: 'bg-blue-50 text-blue-700 border-blue-100'
    }
  }[type];

  const Icon = config.icon;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${config.tone}`}>
            <Icon className="h-4 w-4" />
            Jornada atual
          </div>
          <h2 className="text-2xl font-bold text-gray-950">{config.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">{config.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onPrimary} className="bg-[#E31C23] text-white hover:bg-[#c41a1f]">
              {config.primary} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onSecondary}>
              {config.secondary}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-bold text-gray-950">
            {type === 'debt' ? 'Contratos elegíveis' : 'O que aparece aqui'}
          </h3>
          {type === 'debt' && eligibleContracts.length > 0 ? (
            <div className="mt-3 space-y-3">
              {eligibleContracts.map((contract) => (
                <div key={contract.id || contract.numero} className="rounded-lg border border-red-100 bg-white p-3">
                  <p className="text-xs font-bold uppercase text-red-600">{contract.numero || contract.id}</p>
                  <p className="text-sm font-bold text-gray-950">{contract.produto}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatCurrency(contract.valorEmAberto || 0)} em aberto</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>Renegociações formalizadas.</p>
              <p>Adiantamentos de parcelas.</p>
              <p>Histórico de pagamento dos acordos.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ConsolidatedAgreementsPage = () => {
  const { getAgreements, user, isOverdue, isSuspended, isNewUser, isLead } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'newest'
  });

  const agreements = useMemo(() => dedupeAgreements(getAgreements()), [user, getAgreements]);
  const contracts = user?.contratos || [];
  const eligibleContracts = contracts.filter(isOverdueContract);
  const isDebtJourney = isOverdue() || isSuspended();
  const isAcquisitionJourney = !isDebtJourney && (isNewUser() || isLead() || contracts.length === 0);
  const emptyType = isDebtJourney ? 'debt' : isAcquisitionJourney ? 'acquisition' : 'product';

  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId) {
      setSelectedId(urlId);
      return;
    }

    if (selectedId && !agreements.some((agreement) => agreement.id === selectedId)) {
      setSelectedId(null);
    }
  }, [agreements, searchParams, selectedId]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: 'all', sort: 'newest' });
  };

  const filteredAgreements = agreements.filter((item) => {
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const search = filters.search.toLowerCase();
    const matchesSearch = !search ||
      String(item.id || '').toLowerCase().includes(search) ||
      String(item.product || '').toLowerCase().includes(search) ||
      String(item.contractRef || '').toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    if (filters.sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (filters.sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (filters.sort === 'highest') return b.value - a.value;
    if (filters.sort === 'lowest') return a.value - b.value;
    return 0;
  });

  const selectedAgreement = agreements.find((agreement) => agreement.id === selectedId);
  const activeCount = agreements.filter((agreement) => ['active', 'pending'].includes(agreement.status)).length;
  const paidCount = agreements.filter((agreement) => agreement.status === 'paid').length;
  const totalValue = agreements.reduce((sum, agreement) => sum + (agreement.value || 0), 0);

  const primaryEmptyAction = () => {
    if (emptyType === 'debt') navigate('/dashboard/simular-acordo-lista');
    else navigate('/dashboard/meus-produtos');
  };

  const secondaryEmptyAction = () => {
    if (emptyType === 'debt') navigate('/dashboard/renegociar');
    else if (emptyType === 'acquisition') navigate('/dashboard/casas-bahia-pay');
    else navigate('/dashboard/adiantar-parcelas-lista');
  };

  return (
    <>
      <Helmet><title>Meus Acordos - Portal Financeiro</title></Helmet>

      <div className="mx-auto max-w-[1600px] space-y-6 pb-16">
        <div className="flex flex-col gap-4 px-4 md:px-0 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Acordos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Acompanhe acordos formalizados, parcelas e histórico sem misturar simulação com contrato ativo.
            </p>
          </div>
          {isDebtJourney && (
            <Button onClick={() => navigate('/dashboard/simular-acordo-lista')} className="w-full bg-[#E31C23] text-white hover:bg-[#c41a1f] sm:w-auto">
              Novo acordo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <section className="grid grid-cols-1 gap-3 px-4 md:grid-cols-3 md:px-0">
          {[
            { label: 'Acordos ativos', value: activeCount, icon: FileText, tone: 'bg-blue-50 text-blue-700' },
            { label: 'Acordos pagos', value: paidCount, icon: CheckCircle2, tone: 'bg-green-50 text-green-700' },
            { label: 'Valor negociado', value: formatCurrency(totalValue), icon: Receipt, tone: 'bg-slate-50 text-slate-700' }
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-950">{item.value}</p>
                </div>
                <div className={`rounded-lg p-2 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {agreements.length === 0 ? (
          <EmptyAgreementsState
            type={emptyType}
            eligibleContracts={eligibleContracts}
            onPrimary={primaryEmptyAction}
            onSecondary={secondaryEmptyAction}
          />
        ) : (
          <div className="flex min-h-[620px] gap-6 overflow-hidden px-4 md:px-0">
            <div className={`flex min-w-0 flex-col gap-4 transition-all duration-300 ${selectedId ? 'hidden md:flex md:w-1/3 md:max-w-md' : 'w-full'}`}>
              <AgreementFiltersBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
              />

              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {filteredAgreements.length > 0 ? (
                  filteredAgreements.map((agreement) => (
                    <AgreementSummaryCard
                      key={agreement.id}
                      agreement={agreement}
                      isSelected={selectedId === agreement.id}
                      onClick={(item) => setSelectedId(item.id)}
                    />
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-dashed border-gray-200 bg-white py-12 text-center text-gray-400">
                    <p>Nenhum acordo encontrado com os filtros atuais.</p>
                    <Button variant="link" onClick={handleClearFilters} className="mt-2 text-blue-600">
                      Limpar filtros
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            <div className={`
              absolute inset-0 z-20 flex-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 md:relative md:inset-auto md:z-0
              ${selectedId ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0 md:hidden'}
            `}>
              <AgreementDetailPanel
                agreement={selectedAgreement}
                onBack={() => setSelectedId(null)}
              />
            </div>

            {!selectedId && (
              <div className="hidden flex-1 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 md:flex">
                <div className="text-center text-gray-400">
                  <CreditCard className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p>Selecione um acordo para ver os detalhes</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ConsolidatedAgreementsPage;
