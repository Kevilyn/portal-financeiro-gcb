import React, { createContext, useContext, useState } from 'react';
import { validateCPFCheckDigits, formatCPF } from '@/lib/cpfUtils';
import { TEST_CPF_DB } from '@/data/testCPFData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HELPER: Generate Installments
const generateInstallments = (count, startMonth, year, value, status = 'pendente', dueDateDay = 10) => {
  return Array.from({ length: count }).map((_, i) => {
    const month = startMonth + i;
    // Calculate accurate dates
    const date = new Date(year, month - 1, dueDateDay);
    const isPaid = status === 'paga' || (status === 'misto' && i < count / 2);
    
    return {
      id: i + 1,
      numero: i + 1,
      valor: value,
      desconto: 0,
      juros: 0,
      valorComDesconto: value,
      dataVencimento: date.toISOString().split('T')[0],
      status: isPaid ? 'paga' : 'pendente',
      diasAtraso: 0,
      dataPagamento: isPaid ? date.toISOString().split('T')[0] : null
    };
  });
};

// HELPER: Generate Mock Activities
const generateMockActivities = (history) => {
  // Combine custom history with standard events
  const standardEvents = [
    { id: 'act-1', type: 'login', description: 'Login realizado com sucesso', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() }, // 5 mins ago
  ];

  const historyEvents = (history || []).map((h, i) => ({
      id: `hist-${i}`,
      type: h.type === 'payment' ? 'payment' : 'info',
      description: h.description,
      timestamp: h.date ? new Date(h.date).toISOString() : new Date().toISOString(),
      metadata: { value: h.value }
  }));

  return [...standardEvents, ...historyEvents];
};

// HELPER: Generate Mock Notifications
const generateMockNotifications = () => {
  return [
    { id: 'not-1', type: 'alert', title: 'Oportunidade de Acordo', message: 'Você tem uma nova oferta de renegociação com 90% de desconto!', date: new Date().toISOString(), read: false, archived: false },
    { id: 'not-2', type: 'success', title: 'Pagamento Confirmado', message: 'Recebemos o pagamento da sua fatura de Setembro.', date: new Date(Date.now() - 86400000).toISOString(), read: true, archived: false },
    { id: 'not-3', type: 'info', title: 'Atualização de Cadastro', message: 'Seu endereço foi atualizado com sucesso.', date: new Date(Date.now() - 172800000).toISOString(), read: true, archived: false },
  ];
};

// HELPER: Hydrate simple test data into full rich profile
const hydrateUser = (simpleUser) => {
  if (!simpleUser) return null;

  const contratos = (simpleUser.contracts || []).map((c, index) => {
    // Determine status based on user status for simulation
    let installmentStatus = 'pendente';
    
    // Map status from contract object if available, else fallback to user status
    if (c.status === 'active') installmentStatus = 'pendente';
    if (simpleUser.status === 'Em dia' && !c.status) installmentStatus = 'misto'; // Some paid
    
    // Custom logic for specific CPFs/Products:
    const startMonth = 1; // Jan
    const startYear = 2026;
    const day = c.dueDateDay || 10;
    const valuePerInstallment = c.value / c.installments;

    // Generate parcels
    const parcelas = generateInstallments(
      c.installments, 
      startMonth, 
      startYear, 
      valuePerInstallment, 
      installmentStatus,
      day
    );

    // Apply overdue logic if contract is marked as overdue or user is overdue/suspended
    const isOverdueContract = c.status === 'overdue' || c.status === 'suspended' || simpleUser.status === 'Em atraso' || simpleUser.status === 'Suspenso';

    if (isOverdueContract) {
        const today = new Date();
        parcelas.forEach(p => {
             // Mock logic: Make the first few overdue based on status
             const pastDueLimit = simpleUser.status === 'Suspenso' ? 5 : 2;
             if (p.id <= pastDueLimit) {
                 p.status = 'pendente';
                 p.diasAtraso = 30 * p.id; 
                 // Create past date
                 const pastDate = new Date();
                 pastDate.setMonth(today.getMonth() - p.id);
                 p.dataVencimento = pastDate.toISOString().split('T')[0];
             }
        });
    }

    const valorPago = parcelas.filter(p => p.status === 'paga').reduce((acc, p) => acc + p.valor, 0);
    const valorEmAberto = c.value - valorPago;

    return {
      id: c.id || `CT-${index}`,
      numero: c.id || `CT-${index}`,
      produto: c.product,
      valorOriginal: c.value,
      valorEmAberto: valorEmAberto,
      valorPago: valorPago,
      proximoVencimento: parcelas.find(p => p.status !== 'paga')?.dataVencimento || null,
      status: c.status === 'overdue' ? 'em_atraso' : c.status === 'suspended' ? 'suspenso' : 'em_dia',
      diasAtraso: isOverdueContract ? 15 : 0,
      totalParcelas: c.installments,
      parcelas: parcelas,
      taxaJuros: c.interestRate || 0
    };
  });

  // Map status string from test data to system codes
  let systemStatus = 'novo_cliente';
  const s = simpleUser.status.toLowerCase();
  if (s.includes('dia')) systemStatus = 'em_dia';
  if (s.includes('atraso')) systemStatus = 'em_atraso';
  if (s.includes('suspenso')) systemStatus = 'suspenso';
  if (s.includes('lead')) systemStatus = 'lead';

  return {
    cpf: simpleUser.cpf,
    nome: simpleUser.name,
    email: simpleUser.email || `${simpleUser.name.toLowerCase().replace(/\s/g, '.')}@email.com`,
    telefone: simpleUser.phone || '(11) 99999-9999', 
    endereco: simpleUser.address || 'Endereço Cadastrado, 123', 
    detalhesEndereco: {
        cep: '00000-000',
        logradouro: simpleUser.address || 'Endereço Cadastrado',
        numero: '123',
        complemento: '',
        bairro: 'Bairro Padrão',
        cidade: 'São Paulo',
        estado: 'SP',
        referencia: ''
    },
    status: systemStatus,
    temCadastro: true,
    contratos: contratos,
    produtos: contratos.map(c => c.produto),
    valorTotal: contratos.reduce((acc, c) => acc + c.valorEmAberto, 0),
    proximoVencimento: contratos[0]?.proximoVencimento || null,
    financialProfile: simpleUser.financialProfile || { salary: 0, creditLimit: 0, score: 0 },
    agreements: [], // General agreements
    agreementHistory: [], // Product specific agreements
    notifications: generateMockNotifications(),
    activities: generateMockActivities(simpleUser.history),
    lastProfileSync: new Date().toISOString()
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginStep, setLoginStep] = useState(1);
  const [currentCPF, setCurrentCPF] = useState('');
  const [selectedContract, setSelectedContractState] = useState(null);
  const [adiantamentoContext, setAdiantamentoContextState] = useState(null);
  
  const [localUsers, setLocalUsers] = useState(() => {
    const saved = localStorage.getItem('localUsers');
    return saved ? JSON.parse(saved) : {};
  });

  // Updated Auto-create Profile Logic
  const generateNewProfile = (cpf) => ({
    cpf: formatCPF(cpf),
    nome: '', 
    email: '', 
    telefone: '', 
    endereco: '', 
    status: 'novo_cliente',
    temCadastro: false,
    contratos: [],
    produtos: [],
    detalhes: { contratos: [] },
    valorTotal: 0,
    proximoVencimento: null,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    agreements: [],
    agreementHistory: [],
    notifications: generateMockNotifications(),
    activities: [],
    lastProfileSync: new Date().toISOString()
  });

  const searchCustomerByCPF = (cpf) => {
    if (!cpf) return null;
    const cleanCPF = cpf.replace(/\D/g, '');
    const formattedInput = formatCPF(cpf);
    
    // 1. Check TEST_CPF_DB (Simulated Backend)
    const testUser = TEST_CPF_DB.find(u => u.cpf === formattedInput);
    if (testUser) {
      return hydrateUser(testUser);
    }

    // 2. Check Local Storage (Persisted new users)
    if (localUsers[cleanCPF]) {
      return localUsers[cleanCPF];
    }

    // 3. Auto-create new profile if not found
    return generateNewProfile(cleanCPF);
  };

  const login = (userDataInput) => {
    const cleanCPF = userDataInput.cpf.replace(/\D/g, '');
    
    // Validate format only (11 digits)
    if (!validateCPFCheckDigits(cleanCPF)) {
        console.error("CPF Inválido - Formato incorreto");
        return; 
    }

    let scenarioData = searchCustomerByCPF(cleanCPF);

    // Add login activity
    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'login',
      description: 'Login realizado com sucesso',
      timestamp: new Date().toISOString()
    };
    
    const activities = [newActivity, ...(scenarioData.activities || [])];

    const finalUser = {
      ...scenarioData,
      ...userDataInput, 
      notifications: scenarioData.notifications || generateMockNotifications(),
      activities: activities,
      notificationsSettings: { whatsapp: true, push: true, email: false },
      lastLogin: new Date().toISOString()
    };

    // Save newly created users to localUsers if not in TestDB
    const formattedInput = formatCPF(cleanCPF);
    const inTestDB = TEST_CPF_DB.find(u => u.cpf === formattedInput);
    
    if (!inTestDB) {
        setLocalUsers(prev => {
            const updated = { ...prev, [cleanCPF]: finalUser };
            localStorage.setItem('localUsers', JSON.stringify(updated));
            return updated;
        });
    }

    // Set state - user is now logged in
    setIsAuthenticated(true);
    setUser(finalUser);
    setLoginStep(1);
    setCurrentCPF('');
    
    // Select default contract for flows
    if (finalUser.contratos && finalUser.contratos.length > 0) {
      const overdue = finalUser.contratos.find(c => c.status === 'em_atraso' || c.status === 'suspended');
      selectContract(overdue || finalUser.contratos[0]);
    }
  };

  // NEW: Account Creation Function
  const createNewAccount = (fullData) => {
    const cleanCPF = fullData.cpf.replace(/\D/g, '');
    
    // Simple mock hashing for storage
    const hashedPassword = fullData.password ? btoa(fullData.password) : null;

    // Construct new user object
    const newUser = {
      cpf: formatCPF(cleanCPF),
      nome: fullData.nome,
      email: fullData.email,
      telefone: fullData.telefone,
      passwordHash: hashedPassword, // Store hashed password
      endereco: `${fullData.endereco}, ${fullData.numero}${fullData.complemento ? ' ' + fullData.complemento : ''}`,
      detalhesEndereco: {
        cep: fullData.cep,
        logradouro: fullData.endereco,
        numero: fullData.numero,
        complemento: fullData.complemento,
        bairro: fullData.bairro,
        cidade: fullData.cidade,
        estado: fullData.estado,
        referencia: fullData.referencia
      },
      status: 'novo_cliente',
      temCadastro: true,
      contratos: [],
      produtos: [],
      valorTotal: 0,
      proximoVencimento: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      notificationsSettings: { whatsapp: true, push: true, email: true },
      agreements: [],
      agreementHistory: [],
      notifications: generateMockNotifications(),
      activities: [{ id: `act-${Date.now()}`, type: 'login', description: 'Conta criada e login realizado', timestamp: new Date().toISOString() }],
      lastProfileSync: new Date().toISOString()
    };

    // Save to localStorage
    setLocalUsers(prev => {
        const updated = { ...prev, [cleanCPF]: newUser };
        localStorage.setItem('localUsers', JSON.stringify(updated));
        return updated;
    });

    // Auto-login
    setIsAuthenticated(true);
    setUser(newUser);
    setLoginStep(1);

    return { success: true };
  };

  // UPDATE USER PROFILE FUNCTION
  const updateUserProfile = (updates) => {
    if (!user) return;
    
    // Merge updates
    const updatedUser = { ...user, ...updates };
    
    // Update State
    setUser(updatedUser);
    
    // Persist to Local Storage
    const cleanCPF = user.cpf.replace(/\D/g, '');
    
    // We update localUsers even if the user came from TEST_CPF_DB, 
    // effectively "saving" the changes locally for this session context
    setLocalUsers(prev => {
        const newLocalUsers = { ...prev, [cleanCPF]: updatedUser };
        localStorage.setItem('localUsers', JSON.stringify(newLocalUsers));
        return newLocalUsers;
    });
    
    return true;
  };

  // Activity & Notification Methods
  const logActivity = (type, description, metadata = {}) => {
      if (!user) return;
      const newActivity = {
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type,
          description,
          timestamp: new Date().toISOString(),
          metadata
      };
      const updatedActivities = [newActivity, ...(user.activities || [])];
      updateUserProfile({ activities: updatedActivities });
  };

  // Notification Methods
  const addNotification = (notification) => {
    if (!user) return;
    const newNotification = {
        id: `not-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        read: false,
        archived: false,
        date: new Date().toISOString(),
        ...notification
    };
    const updatedNotifications = [newNotification, ...(user.notifications || [])];
    updateUserProfile({ notifications: updatedNotifications });
  };

  const markNotificationAsRead = (id) => {
      if (!user || !user.notifications) return;
      const updatedNotifications = user.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
      );
      updateUserProfile({ notifications: updatedNotifications });
  };

  const removeNotification = (id) => {
      if (!user || !user.notifications) return;
      const updatedNotifications = user.notifications.filter(n => n.id !== id);
      updateUserProfile({ notifications: updatedNotifications });
  };

  const clearNotifications = () => {
    if (!user) return;
    updateUserProfile({ notifications: [] });
  };

  const archiveNotification = (id) => {
      if (!user || !user.notifications) return;
      const updatedNotifications = user.notifications.map(n => 
          n.id === id ? { ...n, archived: true } : n
      );
      updateUserProfile({ notifications: updatedNotifications });
  };
  
  // AGREEMENT FUNCTIONS
  const createAgreement = (agreementData) => {
    if (!user) return;

    const newAgreement = {
        id: `AG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'Renegociação',
        ...agreementData
    };

    // Add to global agreements
    const currentAgreements = user.agreements || [];
    const updatedAgreements = [newAgreement, ...currentAgreements];
    
    // Add to product specific history
    const currentHistory = user.agreementHistory || [];
    const updatedHistory = [newAgreement, ...currentHistory];

    updateUserProfile({ 
        agreements: updatedAgreements,
        agreementHistory: updatedHistory 
    });
    
    // Log activity
    logActivity('agreement', `Acordo ${newAgreement.id} criado com sucesso`);
    
    // Add notification
    addNotification({
        type: 'success',
        title: 'Acordo Criado',
        message: `Seu acordo ${newAgreement.id} foi gerado com sucesso. Acesse "Meus Acordos" para mais detalhes.`
    });

    return newAgreement;
  };
  
  // New helper for recording agreements (Adiantamento or Renegociação)
  const recordAgreement = (productId, agreementData, date = new Date().toISOString()) => {
     if (!user) return;
     
     const newRecord = {
         id: `AG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
         productId,
         date,
         status: 'active',
         ...agreementData
     };

     const currentHistory = user.agreementHistory || [];
     const updatedHistory = [newRecord, ...currentHistory];
     
     // Also add to global agreements list for compatibility
     const currentAgreements = user.agreements || [];
     const updatedAgreements = [newRecord, ...currentAgreements];

     updateUserProfile({ 
         agreementHistory: updatedHistory,
         agreements: updatedAgreements
     });
     
     logActivity('agreement', `Novo acordo registrado para o produto ${productId}`);
     return newRecord;
  };
  
  const getProductAgreements = (productId) => {
      if (!user || !user.agreementHistory) return [];
      // Flexible matching for ID string/number
      return user.agreementHistory.filter(a => String(a.productId) === String(productId));
  };

  const getAgreements = () => {
    return user?.agreements || [];
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setLoginStep(1);
    setCurrentCPF('');
    setSelectedContractState(null);
    setAdiantamentoContextState(null);
    // Explicitly clearing session data
    localStorage.removeItem('authState');
    localStorage.removeItem('adiantamentoContext');
  };

  const selectContract = (contract) => setSelectedContractState(contract);
  const getContractDetails = () => selectedContract;
  
  const setAdiantamentoAction = (data) => {
    setAdiantamentoContextState(data);
    localStorage.setItem('adiantamentoContext', JSON.stringify(data));
  };

  const getAdiantamentoContext = () => adiantamentoContext;
  const clearAdiantamentoContext = () => {
    setAdiantamentoContextState(null);
    localStorage.removeItem('adiantamentoContext');
  };

  const isOverdue = () => user?.status === 'em_atraso';
  const isSuspended = () => user?.status === 'suspenso';
  const isNewUser = () => user?.status === 'novo_cliente' || user?.status === 'novo';
  const isLead = () => user?.status === 'lead';
  
  const hasProduct = (productIdentifier) => {
    if (!user || !user.produtos) return false;
    const identifier = productIdentifier.toLowerCase();
    return user.produtos.some(p => p.toLowerCase().includes(identifier));
  };

  const getPersona = () => {
      if (!user) return 'unknown';
      if (user.status === 'suspenso') return 'critical';
      if (user.status === 'em_atraso') return 'risk';
      if (user.status === 'em_dia') return 'safe';
      if (user.status === 'novo_cliente' || user.status === 'novo') return 'new';
      return 'lead';
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loginStep,
      setLoginStep,
      currentCPF,
      setCurrentCPF,
      selectedContract,
      selectContract,
      getContractDetails,
      setAdiantamentoAction,
      getAdiantamentoContext,
      clearAdiantamentoContext,
      login,
      logout,
      createNewAccount,
      updateUserProfile,
      createAgreement,
      getAgreements,
      isOverdue,
      isSuspended,
      isNewUser,
      isLead,
      hasProduct,
      getPersona,
      searchCustomerByCPF,
      validateCPF: validateCPFCheckDigits,
      logActivity,
      addNotification,
      markNotificationAsRead,
      removeNotification,
      clearNotifications,
      archiveNotification,
      recordAgreement,
      getProductAgreements
    }}>
      {children}
    </AuthContext.Provider>
  );
};