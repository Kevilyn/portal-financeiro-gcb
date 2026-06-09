export const calculateVistaOpportunity = (contract) => {
  const originalValue = contract.valorEmAberto || 0;
  // À Vista: 50% discount on original value for debt recovery scenario
  const discountRate = 0.50; 
  const discountAmount = originalValue * discountRate;
  const finalValue = originalValue - discountAmount;

  return {
    type: 'vista',
    title: 'Pagamento à Vista',
    label: 'Maior Economia',
    valorTotal: finalValue,
    valorOriginal: originalValue,
    desconto: discountAmount,
    economia: discountAmount,
    economiaPorcentagem: (discountRate * 100).toFixed(0),
    juros: 0,
    parcelas: 1,
    valorParcela: finalValue,
    color: 'bg-green-500',
    badgeColor: 'bg-green-100 text-green-700',
    description: 'Quitando hoje você garante o maior desconto possível.'
  };
};

export const calculateParceladaOpportunity = (contract) => {
  const originalValue = contract.valorEmAberto || 0;
  // Parcelado: Less discount, spread over time
  const discountRate = 0.10; // 10% discount
  const discountAmount = originalValue * discountRate;
  const finalValue = originalValue - discountAmount;
  const installments = 12;

  return {
    type: 'parcelada',
    title: 'Parcelamento Longo',
    label: 'Menor Parcela',
    valorTotal: finalValue,
    valorOriginal: originalValue,
    desconto: discountAmount,
    economia: discountAmount,
    economiaPorcentagem: (discountRate * 100).toFixed(0),
    juros: 0, 
    parcelas: installments,
    valorParcela: finalValue / installments,
    color: 'bg-blue-500',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: 'Parcele em até 12x com parcelas que cabem no bolso.'
  };
};

export const calculateExclusivaOpportunity = (contract) => {
  const originalValue = contract.valorEmAberto || 0;
  // Exclusiva: Balanced approach, "AI Recommended"
  const discountRate = 0.30; // 30% discount
  const discountAmount = originalValue * discountRate;
  const finalValue = originalValue - discountAmount;
  const installments = 4;

  return {
    type: 'exclusiva',
    title: 'Oferta Personalizada',
    label: 'Recomendado',
    valorTotal: finalValue,
    valorOriginal: originalValue,
    desconto: discountAmount,
    economia: discountAmount,
    economiaPorcentagem: (discountRate * 100).toFixed(0),
    juros: 0,
    parcelas: installments,
    valorParcela: finalValue / installments,
    color: 'bg-purple-600',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: 'Equilíbrio ideal entre desconto e prazo para você.'
  };
};

// New short term opportunity to fill the grid (4th item)
export const calculateCurtoPrazoOpportunity = (contract) => {
  const originalValue = contract.valorEmAberto || 0;
  const discountRate = 0.20; 
  const discountAmount = originalValue * discountRate;
  const finalValue = originalValue - discountAmount;
  const installments = 2;

  return {
    type: 'curto_prazo',
    title: 'Entrada + 1x',
    label: 'Rápido',
    valorTotal: finalValue,
    valorOriginal: originalValue,
    desconto: discountAmount,
    economia: discountAmount,
    economiaPorcentagem: (discountRate * 100).toFixed(0),
    juros: 0,
    parcelas: installments,
    valorParcela: finalValue / installments,
    color: 'bg-orange-500',
    badgeColor: 'bg-orange-100 text-orange-700',
    description: 'Quite sua dívida em apenas dois pagamentos.'
  };
};

export const getAllOpportunities = (contract) => {
  if (!contract) return [];
  return [
    calculateVistaOpportunity(contract),
    calculateExclusivaOpportunity(contract),
    calculateParceladaOpportunity(contract),
    calculateCurtoPrazoOpportunity(contract)
  ];
};