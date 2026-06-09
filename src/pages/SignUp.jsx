import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordInput from '@/components/PasswordInput';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  User, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  RefreshCw, 
  Loader2,
  Lock,
  Home,
  Building,
  Hash
} from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createNewAccount } = useAuth();
  
  const cpfFromState = location.state?.cpf || '';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    cpf: cpfFromState,
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    referencia: '',
  });

  const [validationData, setValidationData] = useState({
    emailCode: '',
    smsCode: '',
    generatedEmailCode: '',
    generatedSmsCode: '',
    emailValidated: false,
    smsValidated: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!cpfFromState) {
      toast({ 
        title: "CPF não informado", 
        description: "Por favor, inicie o cadastro pela página inicial.", 
        variant: "destructive" 
      });
      navigate('/');
    }
  }, [cpfFromState, navigate]);

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Simple masking logic
    let formattedValue = value;
    if (name === 'cep') {
      formattedValue = value.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
    }
    if (name === 'telefone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCodeChange = (e, type) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setValidationData(prev => ({ ...prev, [type]: value }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.includes('@')) newErrors.email = "E-mail inválido";
    if (formData.telefone.length < 14) newErrors.telefone = "Telefone inválido";
    
    // Password Validation
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mínimo de 8 caracteres";
    } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password) || !/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = "A senha não atende aos requisitos de segurança";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.cep.length < 9) newErrors.cep = "CEP inválido";
    if (!formData.endereco) newErrors.endereco = "Endereço obrigatório";
    if (!formData.numero) newErrors.numero = "Número obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    if (step === 3 && !validationData.emailValidated) {
        toast({ title: "Valide o e-mail para continuar", variant: "destructive" });
        return;
    }
    if (step === 4 && !validationData.smsValidated) {
        toast({ title: "Valide o celular para continuar", variant: "destructive" });
        return;
    }
    
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
      if (step > 1) setStep(prev => prev - 1);
  };

  // --- Step 2 Logic: Address ---
  const fetchAddress = async () => {
    const cleanCep = formData.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({ title: "CEP não encontrado", variant: "destructive" });
      } else {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
        toast({ title: "Endereço encontrado!", description: "Complete com o número." });
      }
    } catch (error) {
      toast({ title: "Erro ao buscar CEP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- Step 3 & 4 Logic: Code Validation ---
  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  useEffect(() => {
    if (step === 3 && !validationData.emailValidated) {
        const code = generateCode();
        setValidationData(prev => ({ ...prev, generatedEmailCode: code }));
        setTimeout(() => {
            toast({ 
                title: "Código de E-mail enviado", 
                description: `Seu código de verificação é: ${code}`,
                duration: 6000 
            });
        }, 500);
    }
    if (step === 4 && !validationData.smsValidated) {
        const code = generateCode();
        setValidationData(prev => ({ ...prev, generatedSmsCode: code }));
        setTimeout(() => {
            toast({ 
                title: "Código SMS enviado", 
                description: `Seu código de verificação é: ${code}`,
                duration: 6000 
            });
        }, 500);
    }
  }, [step]);

  const handleValidateCode = (type) => {
    const isEmail = type === 'email';
    const inputCode = isEmail ? validationData.emailCode : validationData.smsCode;
    const actualCode = isEmail ? validationData.generatedEmailCode : validationData.generatedSmsCode;

    if (inputCode === actualCode) {
        toast({ title: "Código validado com sucesso!", className: "bg-green-100 border-green-500 text-green-900" });
        setValidationData(prev => ({ ...prev, [isEmail ? 'emailValidated' : 'smsValidated']: true }));
    } else {
        toast({ title: "Código incorreto", variant: "destructive" });
    }
  };

  const handleResendCode = (type) => {
    const code = generateCode();
    setValidationData(prev => ({ 
        ...prev, 
        [type === 'email' ? 'generatedEmailCode' : 'generatedSmsCode']: code 
    }));
    toast({ 
        title: "Código reenviado", 
        description: `Seu novo código é: ${code}`,
        duration: 5000 
    });
  };

  // --- Step 5 Logic: Finish ---
  const handleFinish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const result = createNewAccount(formData);
    setLoading(false);
    
    if (result.success) {
        setSuccess(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    }
  };

  // --- Render Helpers ---
  const stepVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  };

  // Navigation Buttons Component
  const NavigationButtons = () => (
    <div className="pt-8 flex flex-col md:flex-row gap-3">
        {step > 1 && (
            <Button 
                variant="outline" 
                onClick={handlePrevious} 
                className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
            >
                <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
        )}
        
        <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex-1 text-gray-600 hover:bg-gray-100 h-12 border border-transparent hover:border-gray-200"
        >
            <Home className="w-4 h-4 mr-2" /> Voltar ao Início
        </Button>

        {step < 5 && (
            <Button 
                onClick={handleNext} 
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
                Próximo <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        )}

        {step === 5 && (
            <Button 
                onClick={handleFinish} 
                className="flex-[2] bg-green-600 hover:bg-green-700 text-white h-12 shadow-lg shadow-green-200"
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Concluir Cadastro</>}
            </Button>
        )}
    </div>
  );

  const InputWithIcon = ({ icon: Icon, error, ...props }) => (
    <div className={`flex items-center border rounded-md bg-white overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent ${error ? 'border-red-500' : 'border-gray-200'}`}>
        <div className="pl-3 pr-2 text-gray-400 bg-white h-full flex items-center">
            <Icon className="w-4 h-4" />
        </div>
        <input 
            {...props}
            className="w-full py-2.5 px-2 outline-none border-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
        />
    </div>
  );

  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md w-full"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Tudo pronto!</h2>
                <p className="text-gray-500 mb-6">Sua conta foi criada com sucesso. Estamos te redirecionando para o seu dashboard.</p>
                <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 flex flex-col items-center">
      <Logo size="medium" link={false} className="mb-8" />
      
      <motion.div 
        layout
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="bg-gray-100 h-2 w-full">
            <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>

        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    {step === 1 && "Dados Pessoais"}
                    {step === 2 && "Endereço"}
                    {step === 3 && "Validação de E-mail"}
                    {step === 4 && "Validação de Celular"}
                    {step === 5 && "Revisão e Conclusão"}
                </h1>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Passo {step}/5
                </span>
            </div>

            <AnimatePresence mode="wait">
                {/* STEP 1: BASIC INFO */}
                {step === 1 && (
                    <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700">CPF</Label>
                                <InputWithIcon icon={Lock} value={formData.cpf} disabled className="bg-gray-50 text-gray-500" />
                            </div>
                            <div>
                                <Label className="text-gray-700">Nome Completo</Label>
                                <InputWithIcon 
                                    icon={User}
                                    name="nome" 
                                    value={formData.nome} 
                                    onChange={handleInputChange} 
                                    placeholder="Seu nome completo"
                                    error={errors.nome}
                                />
                                {errors.nome && <span className="text-xs text-red-500">{errors.nome}</span>}
                            </div>
                        </div>

                        <div>
                            <Label className="text-gray-700">E-mail</Label>
                            <InputWithIcon 
                                icon={Mail}
                                name="email" 
                                type="email"
                                value={formData.email} 
                                onChange={handleInputChange} 
                                placeholder="seu@email.com"
                                error={errors.email}
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                        </div>

                        <div>
                            <Label className="text-gray-700">Celular</Label>
                            <InputWithIcon 
                                icon={Phone}
                                name="telefone" 
                                value={formData.telefone} 
                                onChange={handleInputChange} 
                                placeholder="(11) 99999-9999"
                                error={errors.telefone}
                            />
                            {errors.telefone && <span className="text-xs text-red-500">{errors.telefone}</span>}
                        </div>

                        <div className="pt-4 space-y-4 border-t border-gray-100">
                           <div>
                              <Label className="text-gray-700 mb-1.5 block">Criar Senha</Label>
                              <PasswordInput 
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Crie sua senha de acesso"
                                error={errors.password}
                              />
                              <PasswordStrengthIndicator password={formData.password} />
                           </div>

                           <div>
                              <Label className="text-gray-700 mb-1.5 block">Confirmar Senha</Label>
                              <PasswordInput 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Repita a senha"
                                error={errors.confirmPassword}
                              />
                           </div>
                        </div>

                        <NavigationButtons />
                    </motion.div>
                )}

                {/* STEP 2: ADDRESS */}
                {step === 2 && (
                    <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Label className="text-gray-700">CEP</Label>
                                <InputWithIcon 
                                    icon={MapPin}
                                    name="cep" 
                                    value={formData.cep} 
                                    onChange={handleInputChange} 
                                    placeholder="00000-000"
                                    error={errors.cep}
                                />
                            </div>
                            <Button 
                                onClick={fetchAddress} 
                                disabled={loading || formData.cep.length < 9}
                                className="bg-blue-600 hover:bg-blue-700 w-32 h-11"
                            >
                                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Buscar CEP'}
                            </Button>
                        </div>
                        {errors.cep && <span className="text-xs text-red-500 block -mt-3">{errors.cep}</span>}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-3">
                                <Label className="text-gray-700">Endereço</Label>
                                <InputWithIcon icon={Building} name="endereco" value={formData.endereco} readOnly className="bg-gray-50" />
                            </div>
                            <div>
                                <Label className="text-gray-700">Número</Label>
                                <InputWithIcon 
                                    icon={Hash}
                                    name="numero" 
                                    value={formData.numero} 
                                    onChange={handleInputChange} 
                                    error={errors.numero}
                                />
                            </div>
                        </div>
                        {errors.numero && <span className="text-xs text-red-500">{errors.numero}</span>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700">Complemento (Opcional)</Label>
                                <InputWithIcon icon={Building} name="complemento" value={formData.complemento} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label className="text-gray-700">Bairro</Label>
                                <InputWithIcon icon={MapPin} name="bairro" value={formData.bairro} readOnly className="bg-gray-50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700">Cidade</Label>
                                <InputWithIcon icon={MapPin} name="cidade" value={formData.cidade} readOnly className="bg-gray-50" />
                            </div>
                            <div>
                                <Label className="text-gray-700">Estado</Label>
                                <InputWithIcon icon={MapPin} name="estado" value={formData.estado} readOnly className="bg-gray-50" />
                            </div>
                        </div>

                         <div>
                            <Label className="text-gray-700">Ponto de Referência (Opcional)</Label>
                            <InputWithIcon icon={MapPin} name="referencia" value={formData.referencia} onChange={handleInputChange} />
                        </div>
                        <NavigationButtons />
                    </motion.div>
                )}

                {/* STEP 3 & 4 (Email, SMS) */}
                {step >= 3 && step < 5 && (
                    <motion.div key={`step${step}`} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center">
                         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            {step === 3 ? <Mail className="w-8 h-8 text-blue-600" /> : <Phone className="w-8 h-8 text-blue-600" />}
                         </div>
                         
                         <div>
                             <h3 className="text-lg font-semibold text-gray-900">{step === 3 ? "Confirme seu E-mail" : "Confirme seu Celular"}</h3>
                             <p className="text-gray-500">Enviamos um código de 6 dígitos para:</p>
                             <p className="font-medium text-gray-800">{step === 3 ? formData.email : formData.telefone}</p>
                         </div>

                         <div className="max-w-xs mx-auto">
                            <Input 
                                value={step === 3 ? validationData.emailCode : validationData.smsCode}
                                onChange={(e) => handleCodeChange(e, step === 3 ? 'emailCode' : 'smsCode')}
                                maxLength={6}
                                className="text-center text-2xl tracking-widest h-14 font-mono uppercase"
                                placeholder="000000"
                            />
                         </div>

                         <div className="flex flex-col gap-3 max-w-xs mx-auto">
                             <Button 
                                onClick={() => handleValidateCode(step === 3 ? 'email' : 'sms')} 
                                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                                disabled={
                                    step === 3 
                                    ? (validationData.emailCode.length < 6 || validationData.emailValidated)
                                    : (validationData.smsCode.length < 6 || validationData.smsValidated)
                                }
                             >
                                {(step === 3 ? validationData.emailValidated : validationData.smsValidated) ? <CheckCircle className="mr-2" /> : null}
                                {(step === 3 ? validationData.emailValidated : validationData.smsValidated) ? 'Validado!' : `Validar ${step === 3 ? 'E-mail' : 'Celular'}`}
                             </Button>
                             
                             <Button 
                                variant="ghost" 
                                onClick={() => handleResendCode(step === 3 ? 'email' : 'sms')}
                                className="text-gray-500 hover:text-blue-600"
                                disabled={step === 3 ? validationData.emailValidated : validationData.smsValidated}
                             >
                                <RefreshCw className="w-4 h-4 mr-2" /> Reenviar código
                             </Button>
                         </div>
                         <NavigationButtons />
                    </motion.div>
                )}

                 {/* STEP 5: COMPLETION */}
                 {step === 5 && (
                    <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="text-green-600" /> Resumo dos Dados
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Nome Completo</p>
                                    <p className="font-medium">{formData.nome}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">CPF</p>
                                    <p className="font-medium">{formData.cpf}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">E-mail</p>
                                    <p className="font-medium flex items-center gap-1">
                                        {formData.email} <CheckCircle className="w-3 h-3 text-green-500" />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Celular</p>
                                    <p className="font-medium flex items-center gap-1">
                                        {formData.telefone} <CheckCircle className="w-3 h-3 text-green-500" />
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-gray-500">Endereço Completo</p>
                                    <p className="font-medium">
                                        {formData.endereco}, {formData.numero} 
                                        {formData.complemento && ` - ${formData.complemento}`} 
                                        <br />
                                        {formData.bairro} - {formData.cidade}/{formData.estado} - CEP {formData.cep}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <NavigationButtons />
                    </motion.div>
                 )}

            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;