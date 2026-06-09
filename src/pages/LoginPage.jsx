import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { validateCPF, formatCPF } from '@/lib/cpfUtils';
import CPFInput from '@/components/CPFInput';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, searchCustomerByCPF } = useAuth();
  
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState(location.state?.cpf || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');

  // Clear error when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [cpf, password]);

  const handleVerifyCPF = async () => {
    if (!cpf) {
      setError("Por favor, digite seu CPF.");
      return;
    }

    if (!validateCPF(cpf)) {
      setError("CPF inválido. Verifique o formato XXX.XXX.XXX-XX");
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const customer = searchCustomerByCPF(cpf);
      setLoading(false);

      if (customer && customer.temCadastro) {
        setCustomerData(customer);
        setStep(2);
      } else {
        navigate('/signup', { state: { cpf, customerData: customer } });
      }
    }, 800);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Por favor, digite sua senha.");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      login({ 
        ...customerData,
        cpf: customerData?.cpf || cpf 
      });
      navigate('/dashboard');
    }, 1000);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setPassword('');
      setError('');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#E31C23] via-[#003DA5] to-gray-900">
      <motion.div
        key="login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'Acessar Conta' : 'Digite sua Senha'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {step === 1 
              ? 'Digite seu CPF para continuar' 
              : <span className="font-medium text-gray-800">CPF: {formatCPF(cpf)}</span>
            }
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </motion.div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">CPF</label>
              <CPFInput 
                value={cpf} 
                onChange={(val) => {
                  setCpf(val);
                  if (error) setError('');
                }} 
                disabled={loading}
                error={!!error}
              />
            </div>
            
            <div className="pt-2 space-y-3">
              <Button 
                onClick={handleVerifyCPF} 
                disabled={loading || cpf.length < 14}
                className="w-full h-12 text-lg font-bold bg-[#0066CC] hover:bg-[#0052a3] text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
              
              <Button 
                variant="ghost"
                onClick={handleBack}
                disabled={loading}
                className="w-full h-12 text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-medium"
              >
                Voltar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Senha</label>
              <div className={`flex items-center border rounded-xl bg-white overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#0066CC] ${error ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}>
                {/* Left Icon: Lock */}
                <div className="pl-4 pr-2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 md:py-4 outline-none border-none text-base text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="********"
                  disabled={loading}
                />

                {/* Right Icon: Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 pl-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Button 
                type="submit"
                disabled={loading || !password}
                className="w-full h-12 text-lg font-bold bg-[#0066CC] hover:bg-[#0052a3] text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              
              <Button 
                variant="ghost"
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="w-full h-12 text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-medium"
              >
                Voltar
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;