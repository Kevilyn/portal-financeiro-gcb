import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, Wallet, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecommendedProductsSection = () => {
  const solutions = [
    {
      icon: FileText,
      title: 'Carnê Digital banQi',
      description: 'Parcele suas compras com facilidade',
      bgColor: 'bg-[#0066CC]',
      textColor: 'text-white',
      buttonVariant: 'secondary',
      buttonText: 'Solicitar',
      link: 'https://www.casasbahia.com.br/hotsite/carne-digital.aspx'
    },
    {
      icon: CreditCard,
      title: 'Cartão Casas Bahia',
      description: 'Cartão de crédito com benefícios exclusivos',
      bgColor: 'bg-[#CC0000]',
      textColor: 'text-white',
      buttonVariant: 'secondary',
      buttonText: 'Solicitar',
      link: 'https://www.casasbahia.com.br/hotsite/cartao-casas-bahia.aspx?nid=202409'
    },
    {
      icon: Wallet,
      title: 'banQi',
      description: 'Conta digital completa e gratuita',
      bgColor: 'bg-[#FFD700]',
      textColor: 'text-gray-900',
      buttonVariant: 'default',
      buttonText: 'Abrir conta',
      link: 'https://www.banqi.com.br/'
    },
    {
      icon: ShoppingBag,
      title: 'Casas Bahia',
      description: 'Milhares de produtos com as melhores condições',
      bgColor: 'bg-[#000000]',
      textColor: 'text-white',
      buttonVariant: 'secondary',
      buttonText: 'Comprar',
      link: 'https://www.casasbahia.com.br/'
    }
  ];

  const handleLearnMore = (link) => {
    window.open(link, '_blank');
  };

  return (
    <section className="py-8">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo à Casas Bahia!</h2>
          <p className="text-gray-600">Descubra nossos produtos e aproveite as melhores condições</p>
        </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {solutions.map((solution, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="relative group h-full"
          >
            <div 
              className={`${solution.bgColor} ${solution.textColor} rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 h-full flex flex-col items-center text-center justify-between gap-3 min-h-[200px]`}
            >
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <solution.icon className="w-6 h-6" />
                </div>
                
                <div className="flex flex-col items-center gap-2"> {/* Added flex-col and gap-2 */}
                    <h3 className="text-lg font-bold">
                      {solution.title}
                    </h3>
                    
                    <p className="opacity-90 text-sm leading-relaxed">
                      {solution.description}
                    </p>
                </div>
              </div>

              <Button
                onClick={() => handleLearnMore(solution.link)}
                className={`w-full font-bold transition-all flex items-center justify-center gap-2 
                  ${solution.bgColor === 'bg-[#FFD700]' 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
              >
                {solution.buttonText} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedProductsSection;