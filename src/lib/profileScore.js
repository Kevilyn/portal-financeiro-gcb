const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const isOverdueContract = (contract) => contract.status === 'em_atraso' || contract.status === 'suspenso';

const getLevel = (score) => {
  if (score >= 85) return { label: 'Excelente', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 70) return { label: 'Forte', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
  if (score >= 50) return { label: 'Construindo', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  return { label: 'Regularizar', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
};

const makeMission = ({ id, title, description, points, completed, path, cta }) => ({
  id,
  title,
  description,
  points,
  completed,
  path,
  cta: completed ? 'Concluida' : cta
});

export const calculateProfileScore = (user) => {
  const contracts = user?.contratos || [];
  const preApprovedProducts = user?.preApprovedProducts || [];
  const installments = contracts.flatMap((contract) => contract.parcelas || []);
  const paidInstallments = installments.filter((installment) => installment.status === 'paga').length;
  const overdueContracts = contracts.filter(isOverdueContract);
  const activeContracts = contracts.filter((contract) => !isOverdueContract(contract));
  const openBalance = contracts.reduce((sum, contract) => sum + (contract.valorEmAberto || 0), 0);
  const paidRatio = installments.length ? paidInstallments / installments.length : 0;
  const baseCreditScore = clamp(user?.financialProfile?.score || 0, 0, 1000);
  const hasCasasBahiaPay = Boolean(user?.casasBahiaPay?.hasAccount);
  const hasProfileData = Boolean(user?.nome && user?.email && user?.telefone);
  const hasAgreements = Boolean((user?.agreements || []).length || (user?.agreementHistory || []).length);
  const isDebtJourney = overdueContracts.length > 0 || user?.status === 'em_atraso' || user?.status === 'suspenso';
  const hasNoContracts = contracts.length === 0;

  const creditScorePoints = Math.round((baseCreditScore / 1000) * 24);
  const paymentPoints = Math.round(paidRatio * 22);
  const productPoints = Math.min(activeContracts.length * 5, 12);
  const preApprovedPoints = Math.min(preApprovedProducts.length * 4, 8);
  const payPoints = hasCasasBahiaPay ? 5 : 0;
  const profilePoints = hasProfileData ? 6 : 0;
  const debtPenalty = overdueContracts.length * 18;
  const openBalancePenalty = isDebtJourney && openBalance > 0 ? 8 : 0;

  const score = clamp(
    35 + creditScorePoints + paymentPoints + productPoints + preApprovedPoints + payPoints + profilePoints - debtPenalty - openBalancePenalty,
    0,
    100
  );

  const missions = isDebtJourney
    ? [
        makeMission({
          id: 'segunda-via',
          title: 'Emitir segunda via',
          description: 'Gere o boleto atualizado da parcela em aberto.',
          points: 120,
          completed: false,
          path: '/dashboard/segunda-via',
          cta: 'Emitir'
        }),
        makeMission({
          id: 'simular-acordo',
          title: 'Simular acordo',
          description: 'Compare entrada, parcelas e desconto antes de decidir.',
          points: 180,
          completed: hasAgreements,
          path: '/dashboard/simular-acordo-lista',
          cta: 'Simular'
        }),
        makeMission({
          id: 'renegociar',
          title: 'Formalizar renegociacao',
          description: 'Converta a proposta em um novo compromisso.',
          points: 300,
          completed: hasAgreements,
          path: '/dashboard/renegociar',
          cta: 'Renegociar'
        })
      ]
    : hasNoContracts
      ? [
          makeMission({
            id: 'cadastro',
            title: 'Completar cadastro',
            description: 'Mantenha contato e dados principais preenchidos.',
            points: 80,
            completed: hasProfileData,
            path: '/dashboard/perfil',
            cta: 'Atualizar'
          }),
          makeMission({
            id: 'produtos',
            title: 'Conhecer produtos',
            description: 'Veja carnê, cartão, empréstimo e serviços disponíveis.',
            points: 120,
            completed: false,
            path: '/dashboard/meus-produtos',
            cta: 'Ver produtos'
          }),
          makeMission({
            id: 'pay',
            title: 'Ativar Casas Bahia Pay',
            description: 'Use conta digital, Pix e serviços financeiros.',
            points: 160,
            completed: hasCasasBahiaPay,
            path: '/dashboard/casas-bahia-pay',
            cta: 'Conhecer'
          })
        ]
      : [
          makeMission({
            id: 'em-dia',
            title: 'Manter contratos em dia',
            description: 'Continue sem parcelas vencidas para liberar ofertas melhores.',
            points: 150,
            completed: overdueContracts.length === 0,
            path: '/dashboard/meus-produtos',
            cta: 'Acompanhar'
          }),
          makeMission({
            id: 'adiantar',
            title: 'Adiantar uma parcela',
            description: 'Antecipe parcelas elegíveis e reduza o saldo futuro.',
            points: 180,
            completed: false,
            path: '/dashboard/adiantar-parcelas-lista',
            cta: 'Adiantar'
          }),
          makeMission({
            id: 'pre-aprovados',
            title: 'Consultar pre-aprovados',
            description: 'Veja limites e ofertas disponíveis para seu CPF.',
            points: 120,
            completed: preApprovedProducts.length > 0,
            path: '/dashboard/meus-produtos',
            cta: 'Consultar'
          })
        ];

  const completedMissions = missions.filter((mission) => mission.completed).length;

  return {
    score,
    level: getLevel(score),
    productsAnalyzed: contracts.length + preApprovedProducts.length + (hasCasasBahiaPay ? 1 : 0),
    completedMissions,
    totalMissions: missions.length,
    missions,
    drivers: [
      `${contracts.length} contrato(s) analisado(s)`,
      `${preApprovedProducts.length} pre-aprovado(s)`,
      hasCasasBahiaPay ? 'Casas Bahia Pay ativo' : 'Casas Bahia Pay nao ativo',
      overdueContracts.length ? `${overdueContracts.length} contrato(s) em atraso` : 'Sem atraso identificado'
    ]
  };
};
