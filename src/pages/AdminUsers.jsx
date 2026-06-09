import React from 'react';
import { Helmet } from 'react-helmet';
import UsersList from '@/components/UsersList';

const AdminUsers = () => {
  return (
    <>
      <Helmet><title>Gerenciar Usuários - Admin banQi</title></Helmet>
      
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-500 mt-1">Visualize e gerencie todos os clientes cadastrados na plataforma.</p>
        </div>

        <UsersList />
      </div>
    </>
  );
};

export default AdminUsers;