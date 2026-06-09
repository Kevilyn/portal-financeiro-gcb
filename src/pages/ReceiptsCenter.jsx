import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';

const ReceiptsCenter = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  
  const receipts = user?.receipts || [];
  
  const filteredReceipts = filter === 'all' 
    ? receipts 
    : receipts.filter(r => r.type === filter);

  const getIcon = (type) => {
    switch(type) {
        case 'payment': return <FileText className="w-5 h-5 text-blue-600" />;
        case 'agreement': return <FileText className="w-5 h-5 text-purple-600" />;
        default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <>
      <Helmet><title>Comprovantes - Portal Financeiro</title></Helmet>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Meus Comprovantes</h1>
            <div className="flex gap-2">
                <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} size="sm">Todos</Button>
                <Button variant={filter === 'payment' ? 'default' : 'outline'} onClick={() => setFilter('payment')} size="sm">Pagamentos</Button>
                <Button variant={filter === 'agreement' ? 'default' : 'outline'} onClick={() => setFilter('agreement')} size="sm">Acordos</Button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredReceipts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    Nenhum comprovante encontrado.
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {filteredReceipts.map((receipt) => (
                        <motion.div 
                            key={receipt.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-3 bg-gray-100 rounded-full">
                                {getIcon(receipt.type)}
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-gray-900">{receipt.description}</h3>
                                <p className="text-sm text-gray-500">{receipt.date} • {receipt.status}</p>
                            </div>

                            <div className="font-bold text-gray-900 text-lg">
                                R$ {receipt.amount.toFixed(2)}
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                                    <Download className="w-4 h-4 mr-2" /> PDF
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Share2 className="w-4 h-4 text-gray-500" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default ReceiptsCenter;