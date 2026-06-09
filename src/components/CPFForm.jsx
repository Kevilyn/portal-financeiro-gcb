import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import CPFInput from '@/components/CPFInput';
import CPFWelcomeModal from '@/components/CPFWelcomeModal';
import { validateCPF } from '@/lib/cpfUtils';

const CPFForm = () => {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  
  const { searchCustomerByCPF, selectContract } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cpf) {
      setError('Por favor, digite seu CPF.');
      return;
    }

    if (!validateCPF(cpf)) {
      const msg = 'CPF inválido. Verifique o formato XXX.XXX.XXX-XX';
      setError(msg);
      toast({ variant: "destructive", title: "CPF Inválido", description: msg });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      const customer = searchCustomerByCPF(cpf);
      
      if (customer) {
        setCustomerData(customer);
        setModalOpen(true);
        
        if (customer.contratos && customer.contratos.length > 0) {
            const suspended = customer.contratos.find(c => c.status === 'suspenso');
            const overdue = customer.contratos.find(c => c.status === 'em_atraso');
            const targetContract = suspended || overdue || customer.contratos[0];
            
            if (targetContract) {
                selectContract(targetContract);
            }
        }
      } else {
        setError('Erro ao processar solicitação.');
      }
      
    }, 800);
  };

  const handleCpfChange = (value) => {
    setCpf(value);
    if (error) setError('');
  };

  return (
    <>
      <motion.form 
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit} 
          className="w-full max-w-md space-y-3 md:space-y-4"
      >
          <div className="space-y-1">
            <label htmlFor="cpf-input" className="block text-xs md:text-sm lg:text-base font-bold text-gray-700 ml-1">
                Consulte seu CPF
            </label>
            <CPFInput 
                id="cpf-input"
                value={cpf} 
                onChange={handleCpfChange} 
                error={error}
                disabled={loading}
            />
          </div>

          <Button 
              type="submit" 
              disabled={loading || cpf.length < 14}
              className="w-full h-11 md:h-12 lg:h-14 text-sm md:text-base lg:text-lg font-bold bg-[#0066CC] hover:bg-[#0052a3] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100"
          >
              {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" /> Verificando...</>
              ) : "Consultar CPF"}
          </Button>
      </motion.form>

      {customerData && (
        <CPFWelcomeModal 
          open={modalOpen} 
          onOpenChange={setModalOpen}
          customerData={customerData}
        />
      )}
    </>
  );
};

export default CPFForm;