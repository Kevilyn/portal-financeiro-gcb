export const TEST_CPF_DB = [
  {
    cpf: '111.222.333-44',
    name: 'Kevilyn Santos',
    status: 'Em dia',
    email: 'kevilyn.santos@email.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123',
    financialProfile: { salary: 2800.00, creditLimit: 10000.00, score: 650 },
    contracts: [
      { id: 'CT-001', product: 'Carnê Digital', value: 10000.00, installments: 8, status: 'active', dueDateDay: 10 },
      { id: 'CT-002', product: 'Cartão BanQi Casas Bahia', value: 3000.00, installments: 10, status: 'active', dueDateDay: 15 }
    ],
    banqi: { hasAccount: true, accountStatus: 'Ativo' },
    preApprovedProducts: [{ productType: 'Empréstimo Pessoal', availableLimit: 5000 }],
    history: []
  },
  {
    cpf: '222.333.444-55',
    name: 'Carlos Oliveira',
    status: 'Em atraso',
    email: 'carlos.oliveira@email.com',
    phone: '(21) 99888-7766',
    address: 'Av. Paulista, 1000',
    financialProfile: { salary: 3500.00, creditLimit: 15000.00, score: 550 },
    contracts: [
      { id: 'CT-003', product: 'Carnê Digital (iPhone)', value: 15000.00, installments: 12, status: 'overdue', dueDateDay: 15 },
    ],
    banqi: { hasAccount: false },
    preApprovedProducts: [],
    history: []
  },
  {
    cpf: '555.666.777-88',
    name: 'Ana Silva',
    status: 'Novo cliente',
    email: 'ana.silva@email.com',
    phone: '(51) 95555-4433',
    address: 'Av. dos Estados, 88',
    financialProfile: { salary: 4000.00, creditLimit: 8000.00, score: 700 },
    contracts: [],
    banqi: { hasAccount: false },
    preApprovedProducts: [
      { productType: 'Carnê Digital', availableLimit: 3000 },
      { productType: 'Cartão Casas Bahia', availableLimit: 1500 }
    ],
    history: []
  },
  {
    cpf: '999.999.999-39',
    name: 'Cliente Teste Completo',
    status: 'Em dia',
    email: 'cliente.teste@email.com',
    phone: '(11) 99999-3939',
    address: 'Rua de Teste, 999',
    financialProfile: { salary: 8000.00, creditLimit: 17000.00, score: 850 },
    contracts: [
      { id: 'CT-007', product: 'Carnê Digital', value: 2000.00, installments: 10, status: 'active', dueDateDay: 10 },
      { id: 'CT-008', product: 'Cartão Casas Bahia', value: 10000.00, installments: 1, status: 'active', dueDateDay: 15 },
      { id: 'CT-009', product: 'Empréstimo', value: 5000.00, installments: 24, status: 'active', dueDateDay: 5 }
    ],
    banqi: { hasAccount: true, accountStatus: 'Ativo' },
    preApprovedProducts: [],
    history: []
  }
];

export const PRODUCTS_DB = [
  { id: 1, title: 'Carnê Digital', description: 'Gerencie seu carnê de forma simples e rápida' },
  { id: 2, title: 'Cartão BanQi Casas Bahia', description: 'Crédito e benefícios exclusivos para você' },
  { id: 3, title: 'Empréstimo Pessoal', description: 'Dinheiro na mão com facilidade' },
  { id: 4, title: 'BanQi Casas Bahia', description: 'Conta digital completa e gratuita' }
];