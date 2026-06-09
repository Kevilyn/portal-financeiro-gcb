import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Search, Eye, MoreHorizontal, UserX, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserDetailsModal from '@/components/UserDetailsModal';
import { formatStatusDisplay, getStatusColor, isProfileComplete } from '@/lib/cpfStatusUtils';
import { cn } from '@/lib/utils';

const UsersList = () => {
  const { getAllUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const users = getAllUsers();

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.cpf.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'suspended' ? user.status === 'suspenso' :
        user.status !== 'suspenso';

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-center bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
          <Input 
            placeholder="Buscar por nome, CPF ou email..." 
            className="pl-8 md:pl-10 text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
            className="text-xs md:text-sm"
          >
            Todos
          </Button>
          <Button 
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50 text-xs md:text-sm"
          >
            Ativos
          </Button>
          <Button 
            variant={statusFilter === 'suspended' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('suspended')}
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 text-xs md:text-sm"
          >
            Suspensos
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm text-left">
            <thead className="text-[10px] md:text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4">Usuário</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Contato</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Status & Perfil</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center">Contratos</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 md:px-6 py-6 md:py-8 text-center text-gray-500 text-xs md:text-sm">
                    Nenhum usuário encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const profileCompleted = isProfileComplete(user);
                  return (
                    <tr key={user.cpf} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="font-bold text-gray-900 text-xs md:text-sm">{user.nome}</div>
                        <div className="font-mono text-[10px] md:text-xs text-gray-500">{user.cpf}</div>
                        <div className="text-[9px] md:text-xs text-gray-400 mt-1">
                          Desde: {new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="text-gray-600 text-xs md:text-sm">{user.email}</div>
                        <div className="text-gray-500 text-[10px] md:text-xs">{user.telefone}</div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                         <div className="flex flex-col gap-1 md:gap-1.5 items-start">
                           <span className={cn("px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-xs font-bold border", getStatusColor(user.status))}>
                             {formatStatusDisplay(user.status)}
                           </span>
                           <div className="flex items-center gap-1 text-[10px] md:text-xs">
                              {profileCompleted ? (
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle className="w-2 h-2 md:w-3 md:h-3" /> Perfil OK
                                </span>
                              ) : (
                                <span className="text-orange-500 flex items-center gap-1">
                                  <AlertCircle className="w-2 h-2 md:w-3 md:h-3" /> Incompleto
                                </span>
                              )}
                           </div>
                         </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                        <div className="font-bold text-gray-900 text-xs md:text-sm">
                          {(user.contratos || user.detalhes?.contratos || []).length}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500">contratos</div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 md:h-8 md:w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs md:text-sm">Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedUser(user)} className="text-xs md:text-sm">
                              <Eye className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 text-xs md:text-sm">
                              <UserX className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Suspender Conta
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 text-[10px] md:text-xs text-gray-500 flex justify-between items-center">
          <span>Mostrando {filteredUsers.length} usuários</span>
          <span>Total no sistema: {users.length}</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <UserDetailsModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersList;