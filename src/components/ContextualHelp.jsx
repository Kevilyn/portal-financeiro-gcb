import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { HelpCircle, MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ContextualHelp = () => {
  const { getPersona } = useAuth();
  const persona = getPersona();

  const content = {
    safe: {
      title: 'Dúvidas sobre adiantamento?',
      text: 'Adiantar parcelas é uma ótima forma de economizar. O desconto é calculado automaticamente.',
      faq: ['Como funciona o desconto progressivo?', 'Posso adiantar qualquer parcela?']
    },
    risk: {
      title: 'Precisa de ajuda com o acordo?',
      text: 'Nossos especialistas podem te ajudar a encontrar a melhor parcela que cabe no seu bolso.',
      faq: ['Quais são as formas de pagamento?', 'O nome limpa na hora?']
    },
    critical: {
      title: 'Vamos resolver isso juntos',
      text: 'Entendemos que imprevistos acontecem. Temos condições especiais para regularização total.',
      faq: ['Como desbloquear meu cartão?', 'Posso parcelar a dívida total?']
    },
    new: {
      title: 'Conheça nossos serviços',
      text: 'O Portal Financeiro Casas Bahia centraliza tudo o que você precisa.',
      faq: ['Como fazer o Carnê Digital?', 'Como pedir o cartão?']
    }
  };

  const currentContent = content[persona] || content.new;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-100 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-blue-900 text-lg mb-2">{currentContent.title}</h3>
          <p className="text-blue-800 mb-4 text-sm">{currentContent.text}</p>
          
          <div className="space-y-2 mb-4">
            {currentContent.faq.map((q, i) => (
              <p key={i} className="text-sm text-blue-700 hover:underline cursor-pointer flex items-center gap-2">
                • {q}
              </p>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
             <Button variant="outline" className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200" onClick={() => window.open('https://wa.me/551100000000')}>
                <MessageCircle className="w-4 h-4 mr-2" /> Falar no WhatsApp
             </Button>
             <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Bot className="w-4 h-4 mr-2" /> Assistente Virtual
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContextualHelp;