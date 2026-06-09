import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, HelpCircle, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';

const DashboardAjuda = () => {
  const { isSuspended } = useAuth();

  const handleContact = (method) => {
    toast({
      title: "🚧 Funcionalidade em breve",
      description: `Contato via ${method} estará disponível em breve!`,
    });
  };

  const contactMethods = [
    { icon: MessageCircle, label: 'Chat Online', description: 'Converse com nossa equipe', action: 'Chat' },
    { icon: Mail, label: 'E-mail', description: 'contato@casasbahia.com.br', action: 'E-mail' },
    { icon: Phone, label: 'Telefone', description: '4003-0515 (24h)', action: 'Telefone' }
  ];

  const faqs = [
    { question: 'Como alterar meus dados cadastrais?', answer: 'Acesse a seção Perfil no menu lateral.' },
    { question: 'Como simular um acordo?', answer: 'Vá em Simular Acordo e siga os passos.' },
    { question: 'Onde vejo meus pagamentos?', answer: 'Acesse Pagamentos/Acordos no menu.' }
  ];

  return (
    <>
      <Helmet>
        <title>Ajuda - Portal Financeiro Casas Bahia</title>
        <meta name="description" content="Central de ajuda e suporte ao cliente" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Central de Ajuda
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Estamos aqui para ajudar você
          </p>
        </motion.div>

        {isSuspended() && (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex items-start gap-4 shadow-sm"
            >
                <div className="bg-blue-100 p-3 rounded-full">
                    <HeartHandshake className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-blue-900 mb-2">Apoio para regularização</h2>
                    <p className="text-blue-800 mb-4">
                        Sabemos que imprevistos acontecem. Se você está com dificuldades para regularizar sua situação, 
                        nossa equipe de especialistas pode analisar seu caso individualmente para encontrar a melhor solução.
                    </p>
                    <Button onClick={() => handleContact('WhatsApp Especializado')} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Falar com especialista no WhatsApp
                    </Button>
                </div>
            </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Como podemos ajudar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactMethods.map((method, index) => (
              <div key={index} className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#E31C23] transition-all text-center">
                <method.icon className="w-12 h-12 text-[#E31C23] mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {method.label}
                </h3>
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {method.description}
                </p>
                <Button
                  onClick={() => handleContact(method.action)}
                  variant="outline"
                  className="w-full border-[#E31C23] text-[#E31C23] hover:bg-[#E31C23] hover:text-white"
                >
                  Contatar
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#E31C23] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DashboardAjuda;