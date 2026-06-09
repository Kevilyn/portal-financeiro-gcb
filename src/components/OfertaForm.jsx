import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Calendar, DollarSign, Send, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/currencyUtils';
import { Input } from '@/components/ui/input';

const OfertaForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractId: '',
    entryAmount: '',
    installments: '',
    dueDate: '',
    message: ''
  });

  const contracts = user?.contracts || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contractId || !formData.entryAmount || !formData.installments || !formData.dueDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos da oferta.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Sua proposta foi enviada!",
        description: "Você receberá uma resposta em até 24 horas.",
        className: "bg-green-50 border-green-200"
      });
      navigate('/dashboard/pagamentos');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">Faça sua Oferta</h3>
        <p className="text-gray-500 text-xs md:text-sm">Diga-nos quanto você pode pagar e analisaremos sua proposta.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Selecione o Contrato</label>
          <select
            name="contractId"
            value={formData.contractId}
            onChange={handleChange}
            className="w-full p-2 md:p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base"
          >
            <option value="">Selecione...</option>
            {contracts.map(contract => (
              <option key={contract.id} value={contract.id}>
                {contract.product} - {formatCurrency(contract.value)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Valor de Entrada</label>
            <div className="flex items-center gap-2">
                <span className="text-gray-500 font-bold text-base md:text-lg">R$</span>
                <Input
                  type="number"
                  name="entryAmount"
                  placeholder="0,00"
                  value={formData.entryAmount}
                  onChange={handleChange}
                  className="flex-1 h-11 text-base md:text-lg"
                />
            </div>
          </div>

          <div>
             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Número de Parcelas</label>
             <input
              type="number"
              name="installments"
              placeholder="Ex: 10"
              value={formData.installments}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base h-11"
            />
          </div>
        </div>

        <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" /> Data de Vencimento Preferencial
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base"
            />
        </div>

        <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-gray-400" /> Mensagem Adicional (Opcional)
            </label>
            <textarea
              name="message"
              rows="3"
              placeholder="Descreva detalhes adicionais sobre sua proposta..."
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm md:text-base"
            />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          size="lg"
          className="w-full bg-[#E31C23] hover:bg-[#c41a1f] text-white py-5 md:py-6 text-base md:text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <span className="flex items-center gap-2">Enviar Proposta <Send className="w-4 h-4 md:w-5 md:h-5" /></span>}
        </Button>
      </form>
    </motion.div>
  );
};

export default OfertaForm;