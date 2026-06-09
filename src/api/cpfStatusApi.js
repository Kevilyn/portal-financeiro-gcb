import { TEST_CPF_DB } from '@/data/testCPFData';

// Simulated latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchAllCPFStatuses = async () => {
  await delay(500);
  return [...TEST_CPF_DB];
};

export const fetchCPFStatus = async (cpf) => {
  await delay(300);
  return TEST_CPF_DB.find(c => c.cpf === cpf);
};

export const updateCPFStatus = async (cpf, statusUpdate) => {
  await delay(500);
  const index = TEST_CPF_DB.findIndex(c => c.cpf === cpf);
  if (index !== -1) {
    // In a real app this would update the DB. Here we simulate success.
    const updated = { ...TEST_CPF_DB[index], ...statusUpdate };
    return { success: true, data: updated };
  }
  return { success: false, message: 'CPF not found' };
};

export const generateStatusReport = async () => {
  await delay(1000);
  // Simulate CSV generation
  const headers = "CPF,Name,Status,DaysOverdue,TotalDebt\n";
  const rows = TEST_CPF_DB.map(c => 
    `${c.cpf},${c.name},${c.status},${c.daysOverdue},${c.totalDebt}`
  ).join("\n");
  return headers + rows;
};