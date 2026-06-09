import { TEST_CPF_DB } from '@/data/testCPFData';

export const isProductOverdue = (contract) => {
  if (!contract) return false;
  if (contract.status === 'em_atraso' || contract.status === 'suspenso' || contract.status === 'overdue') return true;
  
  if (contract.parcelas && Array.isArray(contract.parcelas)) {
    const today = new Date();
    return contract.parcelas.some(p => {
      if (p.status !== 'pendente') return false;
      const dueDate = new Date(p.dataVencimento);
      return dueDate < today;
    });
  }
  return false;
};

export const getProductStatus = (userOrCpf, productType) => {
  let user = typeof userOrCpf === 'string' ? TEST_CPF_DB.find(u => u.cpf.replace(/\D/g, '') === userOrCpf.replace(/\D/g, '')) : userOrCpf;
  
  if (!user) return null;

  const typeMap = {
    'carne': ['carnê digital', 'carne digital', 'crediário'],
    'cartao': ['cartão', 'cartao banqi', 'cartao casas bahia'],
    'emprestimo': ['empréstimo', 'emprestimo', 'emprestimo pessoal'],
  };

  if (productType === 'banqi') {
    if (user.banqi?.hasAccount) {
      return { status: 'Ativo', isVisible: true, color: 'green' };
    }
    return null; // Hide if account doesn't exist
  }

  const normalizedType = productType.toLowerCase();
  const searchTerms = typeMap[normalizedType] || [normalizedType];
  
  // Check active contracts
  const contracts = user.contratos || user.contracts || [];
  const activeContracts = contracts.filter(c => 
    searchTerms.some(term => (c.produto || c.product)?.toLowerCase().includes(term))
  );

  if (activeContracts.length > 0) {
    const hasOverdue = activeContracts.some(c => isProductOverdue(c));
    if (hasOverdue) return { status: 'Em atraso', isVisible: true, color: 'red' };
    return { status: 'Ativo', isVisible: true, color: 'green' };
  }

  // Check pre-approved
  const preApproved = user.preApprovedProducts || [];
  const isPreApproved = preApproved.some(p => searchTerms.some(term => p.productType.toLowerCase().includes(term)));
  
  if (isPreApproved) {
    return { status: 'Pré-aprovado', isVisible: true, color: 'blue' };
  }

  return null; // Filter out non-existent products
};

export const getAllProductsWithStatus = (userOrCpf) => {
  const products = [
    { id: 'carne', name: 'Carnê Digital', path: '/dashboard/meus-produtos/carne-digital' },
    { id: 'cartao', name: 'Cartão Casas Bahia', path: '/dashboard/meus-produtos/cartao-casas-bahia' },
    { id: 'emprestimo', name: 'Empréstimo', path: '/dashboard/meus-produtos/emprestimo' },
    { id: 'banqi', name: 'BanQi', path: '/dashboard/meus-produtos/banqi' }
  ];

  return products.map(p => {
    const statusObj = getProductStatus(userOrCpf, p.id);
    if (!statusObj) return null;
    return {
      ...p,
      ...statusObj
    };
  }).filter(Boolean); // Filter out nulls
};