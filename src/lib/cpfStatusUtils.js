export const getStatusColor = (status) => {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus?.includes('em dia') || normalizedStatus === 'em_dia' || normalizedStatus === 'active') {
    return 'bg-green-100 text-green-700 border-green-200';
  }
  if (normalizedStatus?.includes('atraso') || normalizedStatus === 'em_atraso' || normalizedStatus === 'overdue') {
    return 'bg-red-100 text-red-700 border-red-200';
  }
  if (normalizedStatus?.includes('novo') || normalizedStatus === 'new') {
    return 'bg-blue-100 text-blue-700 border-blue-200';
  }
  if (normalizedStatus?.includes('lead') || normalizedStatus === 'suspenso') {
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }
  return 'bg-gray-50 text-gray-600 border-gray-200';
};

export const formatStatusDisplay = (status) => {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === 'em_dia') return 'Em Dia';
  if (normalizedStatus === 'em_atraso') return 'Em Atraso';
  if (normalizedStatus === 'novo') return 'Novo Cliente';
  if (normalizedStatus === 'suspenso') return 'Suspenso';
  return status || 'Desconhecido';
};

export const calculateDaysOverdue = (lastPaymentOrDueDate) => {
  if (!lastPaymentOrDueDate) return 0;
  const date = new Date(lastPaymentOrDueDate);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  // Simple logic: if date is in past, it's potentially overdue if not paid. 
  // For this util, we assume the date passed IS the due date of an unpaid item.
  return now > date ? diffDays : 0;
};

export const isProfileComplete = (customerData) => {
  if (!customerData) return false;
  const requiredFields = ['name', 'cpf', 'email', 'phone', 'address'];
  // Map fields from different potential data structures
  const data = {
    name: customerData.name || customerData.nome,
    cpf: customerData.cpf,
    email: customerData.email,
    phone: customerData.phone || customerData.telefone,
    address: customerData.address || customerData.endereco
  };
  
  return requiredFields.every(field => !!data[field]);
};

export const getCustomerStatus = (cpf, db) => {
  // This is a helper to find a customer in a provided DB array
  return db?.find(c => c.cpf === cpf) || null;
};