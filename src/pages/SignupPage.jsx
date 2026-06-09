import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, User, Calendar, MapPin, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import ContactValidationModal from '@/components/ContactValidationModal';
import PasswordInput from '@/components/PasswordInput';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    gender: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false
  });

  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when typing
    if (name === 'password' || name === 'confirmPassword') {
        setPasswordError('');
    }
  };

  const handleCEP = (e) => {
    let cep = e.target.value.replace(/\D/g, '');
    if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    setFormData(prev => ({ ...prev, cep }));
    
    // Mock Auto-fill
    if (cep.replace(/\D/g, '').length === 8) {
      setFormData(prev => ({
        ...prev,
        street: 'Rua Exemplo Mock',
        city: 'São Paulo',
        state: 'SP'
      }));
      toast({ title: "Endereço encontrado", description: "Preencha o número e complemento." });
    }
  };

  const validatePassword = () => {
      const { password, confirmPassword } = formData;
      if (!password) {
          setPasswordError("A senha é obrigatória.");
          return false;
      }
      if (password.length < 8) {
          setPasswordError("A senha deve ter pelo menos 8 caracteres.");
          return false;
      }
      // Simple regex for complexity
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);

      if (!hasUpper || !hasNumber || !hasSpecial) {
           setPasswordError("A senha não atende aos requisitos de segurança.");
           return false;
      }

      if (password !== confirmPassword) {
          setPasswordError("As senhas não coincidem.");
          return false;
      }
      return true;
  };

  const validateStep = () => {
    switch(step) {
      case 1: // Personal Data
        if (!formData.name || !formData.cpf || !formData.birthDate || !formData.gender) return false;
        if (formData.cpf.length < 14) return false;
        return true;
      case 2: // Address
        return formData.cep && formData.street && formData.number && formData.city && formData.state;
      case 3: // Contact & Password
        if (!formData.email || !formData.phone) return false;
        return validatePassword();
      case 4: // Terms
        return formData.acceptedTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 4) {
        setShowValidation(true);
      } else {
        setStep(prev => prev + 1);
      }
    } else {
      if (step !== 3) {
         toast({ title: "Atenção", description: "Preencha todos os campos obrigatórios corretamente.", variant: "destructive" });
      } else {
         toast({ title: "Erro na senha", description: passwordError || "Verifique os campos de senha.", variant: "destructive" });
      }
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleValidationSuccess = () => {
    // Register user
    login({
      ...formData,
      status: 'novo',
      isValidated: true,
      addresses: [{
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
        cep: formData.cep
      }]
    });
    
    // Show success screen then redirect
    setStep(5);
    setTimeout(() => {
        navigate('/dashboard');
    }, 3000);
  };

  // Helper for inputs with icons (Flexbox layout)
  const IconInput = ({ icon: Icon, rightIcon, ...props }) => (
    <div className="flex items-center border rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all border-gray-300">
      <div className="pl-3 pr-2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input className="w-full p-3 outline-none border-none text-gray-900 placeholder:text-gray-400" {...props} />
      {rightIcon && <div className="pr-3">{rightIcon}</div>}
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Dados Pessoais</h2>
            <IconInput icon={User} name="name" placeholder="Nome Completo" value={formData.name} onChange={handleChange} />
            <IconInput icon={ShieldCheck} name="cpf" placeholder="CPF (000.000.000-00)" value={formData.cpf} onChange={handleChange} maxLength={14} />
            <div className="grid grid-cols-2 gap-4">
              <IconInput icon={Calendar} type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
              <div className="flex items-center border rounded-lg overflow-hidden bg-white px-3 border-gray-300">
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 bg-white outline-none">
                  <option value="">Gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Endereço</h2>
            <IconInput icon={MapPin} name="cep" placeholder="CEP" value={formData.cep} onChange={handleCEP} maxLength={9} />
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2"><IconInput icon={MapPin} name="street" placeholder="Rua" value={formData.street} onChange={handleChange} /></div>
              <IconInput icon={MapPin} name="number" placeholder="Número" value={formData.number} onChange={handleChange} />
            </div>
            <IconInput icon={MapPin} name="complement" placeholder="Complemento" value={formData.complement} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <IconInput icon={MapPin} name="city" placeholder="Cidade" value={formData.city} onChange={handleChange} />
              <IconInput icon={MapPin} name="state" placeholder="Estado (UF)" value={formData.state} onChange={handleChange} maxLength={2} />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Acesso e Contato</h2>
            <IconInput icon={Mail} type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} />
            <IconInput icon={Phone} type="tel" name="phone" placeholder="Celular" value={formData.phone} onChange={handleChange} />
            
            <div className="pt-2 border-t border-gray-100">
                <PasswordInput 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="Criar Senha"
                  error={passwordError}
                />
                <PasswordStrengthIndicator password={formData.password} />
            </div>

            <div className="pt-2">
                <PasswordInput 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  placeholder="Confirmar Senha"
                  error={formData.password !== formData.confirmPassword ? "As senhas não coincidem" : ""}
                />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Termos e Condições</h2>
            <div className="h-40 overflow-y-auto bg-gray-50 p-4 rounded text-sm text-gray-600 border">
              <p>1. Ao criar sua conta, você concorda com a política de privacidade do Grupo Casas Bahia.</p>
              <p>2. Seus dados serão utilizados para análise de crédito.</p>
              <p>3. A validação de contato é obrigatória para segurança da conta.</p>
              <p>...</p>
            </div>
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Li e aceito os termos de uso e política de privacidade.</span>
            </label>
          </motion.div>
        );
       case 5:
        return (
           <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Check className="w-10 h-10 text-green-600" />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta Criada!</h2>
               <p className="text-gray-600">Bem-vindo ao BanQi Casas Bahia. Redirecionando...</p>
           </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#E31C23]">Cadastro</h1>
            <span className="text-sm text-gray-500">Passo {step} de 5</span>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

            {step < 5 && (
                <div className="flex gap-4 mt-8">
                {step > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                    </Button>
                )}
                <Button type="button" onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    {step === 4 ? 'Criar Conta' : 'Próximo'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                </div>
            )}
          </form>

          {step === 1 && (
             <div className="mt-6 text-center">
                 <button onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:underline">Já tenho uma conta</button>
             </div>
          )}
        </div>
      </div>

      <ContactValidationModal 
        isOpen={showValidation} 
        onClose={() => setShowValidation(false)} 
        onSuccess={handleValidationSuccess}
        context="criação de conta"
      />
    </div>
  );
};

export default SignupPage;