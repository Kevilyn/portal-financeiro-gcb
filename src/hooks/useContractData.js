import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const useContractData = (contractId) => {
  const { user, selectedContract, selectContract } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      
      if (!user || (!user.contratos && !user.detalhes?.contratos)) {
        setLoading(false);
        return;
      }

      const allContracts = user.detalhes?.contratos || user.contratos || [];
      
      let foundContract = null;

      if (contractId) {
        // Try to find by ID if provided
        foundContract = allContracts.find(c => 
          String(c.id) === String(contractId) || 
          String(c.numero) === String(contractId)
        );
      } else if (selectedContract) {
        // Fallback to currently selected contract in context
        foundContract = selectedContract;
      } else if (allContracts.length > 0) {
        // Fallback to finding the most urgent contract (overdue/suspended)
        const urgent = allContracts.find(c => c.status === 'suspenso' || c.status === 'em_atraso');
        foundContract = urgent || allContracts[0];
      }

      if (foundContract) {
        setContract(foundContract);
        // Sync context if different
        if (!selectedContract || String(selectedContract.id) !== String(foundContract.id)) {
            selectContract(foundContract);
        }
      }

      setLoading(false);
    };

    fetchContract();
  }, [contractId, user, selectedContract, selectContract]);

  return { contract, loading };
};

export default useContractData;