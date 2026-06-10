export const TEST_CPF_DB = [
  {
    cpf: '111.222.333-44',
    name: 'Kevilyn Santos',
    status: 'Em atraso',
    email: 'kevilyn.santos@email.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123',
    financialProfile: { salary: 2800.00, creditLimit: 10000.00, score: 520 },
    contracts: [
      { id: 'CT-001', product: 'Carnê Digital', value: 10000.00, installments: 8, status: 'overdue', dueDateDay: 10 },
      { id: 'CT-002', product: 'Cartão Casas Bahia Pay', value: 3000.00, installments: 10, status: 'overdue', dueDateDay: 15 }
    ],
    casasBahiaPay: { hasAccount: true, accountStatus: 'Ativo' },
    preApprovedProducts: [],
    history: [
      { type: 'info', description: 'Oferta de regularização disponível', date: '2026-01-10', value: 13000.00 }
    ]
  },
  {
    cpf: '222.333.444-55',
    name: 'Carlos Oliveira',
    status: 'Em dia',
    email: 'carlos.oliveira@email.com',
    phone: '(21) 99888-7766',
    address: 'Av. Paulista, 1000',
    financialProfile: { salary: 3500.00, creditLimit: 15000.00, score: 720 },
    contracts: [
      { id: 'CT-003', product: 'Carnê Digital', value: 4500.00, installments: 12, status: 'active', dueDateDay: 15 },
      { id: 'CT-004', product: 'Cartão Casas Bahia Pay', value: 2500.00, installments: 1, status: 'active', dueDateDay: 20 }
    ],
    casasBahiaPay: { hasAccount: true, accountStatus: 'Ativo' },
    preApprovedProducts: [
      { productType: 'Empréstimo Pessoal', availableLimit: 7000 },
      { productType: 'Cartão Casas Bahia', availableLimit: 2500 }
    ],
    history: []
  },
  {
    cpf: '555.666.777-88',
    name: 'Ana Silva',
    status: 'Novo cliente',
    email: 'ana.silva@email.com',
    phone: '(51) 95555-4433',
    address: 'Av. dos Estados, 88',
    financialProfile: { salary: 4000.00, creditLimit: 0, score: 700 },
    contracts: [],
    casasBahiaPay: { hasAccount: false },
    preApprovedProducts: [],
    history: []
  }
];

export const PRODUCTS_DB = [
  { id: 1, title: 'Carnê Digital', description: 'Gerencie seu carnê de forma simples e rápida' },
  { id: 2, title: 'Cartão Casas Bahia Pay', description: 'Crédito e benefícios exclusivos para você' },
  { id: 3, title: 'Empréstimo Pessoal', description: 'Dinheiro na mão com facilidade' },
  { id: 4, title: 'Casas Bahia Pay', description: 'Conta digital completa e gratuita' }
];
