import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { Users, UserCheck, AlertTriangle, DollarSign, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const { getAllUsers } = useAuth();
  const users = getAllUsers();

  // Calculate Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status !== 'suspenso').length;
  const suspendedUsers = users.filter(u => u.status === 'suspenso').length;
  const overdueUsers = users.filter(u => u.status === 'em_atraso').length;

  const totalContractValue = users.reduce((acc, user) => {
    const contracts = user.detalhes?.contratos || user.contratos || [];
    return acc + contracts.reduce((sum, c) => sum + (c.valorOriginal || c.valueOriginal || 0), 0);
  }, 0);

  const pendingPaymentsValue = users.reduce((acc, user) => {
    const contracts = user.detalhes?.contratos || user.contratos || [];
    return acc + contracts.reduce((sum, c) => sum + (c.valorEmAberto || c.valueOpen || 0), 0);
  }, 0);

  return (
    <>
      <Helmet><title>Painel Administrativo - banQi</title></Helmet>
      
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-500 mt-2">Visão geral do sistema e gerenciamento de usuários.</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            Atualizado em: {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-gray-500">{activeUsers} ativos, {suspendedUsers} suspensos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Ativos (Valor)</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {totalContractValue.toLocaleString('pt-BR', { notation: 'compact' })}
              </div>
              <p className="text-xs text-gray-500">Total em carteira</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Atraso (Risco)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueUsers}</div>
              <p className="text-xs text-gray-500">Usuários com pagamentos pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recebíveis Pendentes</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                R$ {pendingPaymentsValue.toLocaleString('pt-BR', { notation: 'compact' })}
              </div>
              <p className="text-xs text-gray-500">Valor total em aberto</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gerenciamento de Usuários</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Acesse a lista completa de usuários para ver detalhes de contratos, histórico e ações.
            </p>
            <Link to="/admin/users">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white gap-2">
                <UserCheck className="w-4 h-4" /> Acessar Usuários
              </Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
                <Activity className="w-24 h-24 text-blue-600" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-4">Status de CPFs</h3>
             <p className="text-gray-500 mb-6 text-sm">
                Dashboard detalhado para monitorar status de leads e clientes por CPF.
             </p>
             <Link to="/admin/cpf-status">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                   <Activity className="w-4 h-4" /> Monitorar CPFs
                </Button>
             </Link>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-md text-white">
            <h3 className="text-lg font-bold mb-4">Relatórios</h3>
            <p className="text-blue-100 mb-6 text-sm">
              Esta funcionalidade estará disponível em breve. Relatórios de inadimplência e projeção.
            </p>
            <Button variant="outline" className="w-full border-blue-400 text-blue-100 hover:bg-blue-700 hover:text-white" disabled>
              Em Breve
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;