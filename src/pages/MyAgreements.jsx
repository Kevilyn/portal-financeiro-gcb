import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Eye, Mail, Copy, MoreHorizontal, QrCode, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

// Components
import AgreementDetailsModal from '@/components/AgreementDetailsModal';
import AgreementEmailModal from '@/components/AgreementEmailModal';
import PIXPaymentModal from '@/components/PIXPaymentModal';

const MyAgreements = () => {
  const { getAgreements } = useAuth();
  const agreements = getAgreements();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [pixOpen, setPixOpen] = useState(false);

  // Filtering
  const filteredAgreements = agreements.filter(agreement => {
    const matchesFilter = filter === 'all' || agreement.status === filter;
    const matchesSearch = 
        agreement.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        agreement.number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch(status) {
        case 'paid': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pago</Badge>;
        case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
        case 'overdue': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Atrasado</Badge>;
        default: return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleAction = (type, agreement) => {
    setSelectedAgreement(agreement);
    if (type === 'view') setDetailsOpen(true);
    if (type === 'email') setEmailOpen(true);
    if (type === 'pix') setPixOpen(true);
    if (type === 'copy') {
        navigator.clipboard.writeText(agreement.id);
        // Toast logic would go here
    }
  };

  return (
    <>
      <Helmet><title>Meus Acordos - Portal Financeiro</title></Helmet>
      
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Meus Acordos</h1>
                <p className="text-gray-500">Gerencie seus acordos e negociações em andamento.</p>
            </div>
            {/* <Button>Novo Acordo</Button> */}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Buscar por código do acordo..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Button 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    onClick={() => setFilter('all')}
                    className="whitespace-nowrap"
                >
                    Todos
                </Button>
                <Button 
                    variant={filter === 'pending' ? 'default' : 'outline'} 
                    onClick={() => setFilter('pending')}
                    className="whitespace-nowrap"
                >
                    Pendentes
                </Button>
                <Button 
                    variant={filter === 'paid' ? 'default' : 'outline'} 
                    onClick={() => setFilter('paid')}
                    className="whitespace-nowrap"
                >
                    Pagos
                </Button>
            </div>
        </div>

        {/* List */}
        <div className="space-y-4">
            {filteredAgreements.length === 0 ? (
                <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">Nenhum acordo encontrado</h3>
                        <p className="text-gray-500 max-w-sm mt-1">
                            {searchTerm || filter !== 'all' 
                                ? 'Tente ajustar seus filtros de busca.' 
                                : 'Você ainda não possui acordos registrados.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredAgreements.map((agreement) => (
                        <Card key={agreement.id} className="hover:shadow-md transition-shadow">
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                {/* Info */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Código</p>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-medium text-gray-900">{agreement.id}</span>
                                            <button onClick={() => handleAction('copy', agreement)} className="text-gray-400 hover:text-blue-600">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Valor</p>
                                        <p className="font-medium text-gray-900">R$ {agreement.value?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Vencimento</p>
                                        <p className="font-medium text-gray-900">
                                            {agreement.dueDate ? new Date(agreement.dueDate).toLocaleDateString('pt-BR') : '---'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                                        {getStatusBadge(agreement.status)}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 md:border-l md:pl-6">
                                    <Button variant="outline" size="sm" onClick={() => handleAction('view', agreement)}>
                                        <Eye className="w-4 h-4 mr-2" /> Detalhes
                                    </Button>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleAction('view', agreement)}>
                                                <Eye className="w-4 h-4 mr-2" /> Ver Detalhes
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('email', agreement)}>
                                                <Mail className="w-4 h-4 mr-2" /> Enviar por Email
                                            </DropdownMenuItem>
                                            {agreement.status === 'pending' && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleAction('pix', agreement)}>
                                                        <QrCode className="w-4 h-4 mr-2" /> Pagar com PIX
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="w-4 h-4 mr-2" /> Baixar Boleto
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Modals */}
      <AgreementDetailsModal 
        isOpen={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        agreement={selectedAgreement} 
      />
      <AgreementEmailModal
        isOpen={emailOpen}
        onClose={() => setEmailOpen(false)}
        agreementId={selectedAgreement?.id}
      />
      <PIXPaymentModal
        isOpen={pixOpen}
        onClose={() => setPixOpen(false)}
        value={selectedAgreement?.value}
      />
    </>
  );
};

export default MyAgreements;