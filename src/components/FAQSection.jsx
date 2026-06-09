import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQSection = () => {
  const faqs = [
    {
      question: 'Como funciona o Carnê Digital?',
      answer: 'O Carnê Digital permite parcelar suas compras de forma prática e segura, direto pelo app ou site. Você escolhe o valor das parcelas e acompanha tudo online.'
    },
    {
      question: 'Quais são os benefícios do Cartão Casas Bahia?',
      answer: 'Com o Cartão Casas Bahia você tem descontos exclusivos, parcelamento sem juros em produtos selecionados e programa de pontos que podem ser trocados por prêmios.'
    },
    {
      question: 'Como faço para negociar uma dívida?',
      answer: 'Acesse a área "Simular Acordo" no portal, selecione o contrato que deseja negociar e escolha a melhor forma de pagamento. Você verá todas as condições antes de confirmar.'
    },
    {
      question: 'Posso antecipar parcelas?',
      answer: 'Sim! Você pode antecipar parcelas a qualquer momento e ainda ganhar descontos especiais na área de pagamentos do portal.'
    },
    {
      question: 'Como criar uma conta no BanQi?',
      answer: 'A conta é totalmente digital e gratuita. Basta fazer o cadastro pelo app ou site, enviar seus documentos e pronto! Sua conta fica ativa em minutos.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Sim! Utilizamos criptografia de ponta a ponta e seguimos todas as normas de segurança para proteger suas informações.'
    }
  ];

  return (
    <section id="faq" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Perguntas Frequentes
          </h2>
          <p className="text-lg md:text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Tire suas dúvidas sobre nossos serviços
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4 mb-10">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-none">
                <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4 text-left hover:no-underline">
                  <span className="font-semibold text-gray-900 text-sm md:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-3 md:pb-4 text-gray-600 text-xs md:text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex justify-center">
            <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
                <Link to="/suporte" className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Ver Mais Perguntas e Suporte
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;