import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, Wallet, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SolutionsSection = () => {
  const solutions = [
    {
      icon: FileText,
      title: 'Carnê Digital banQi',
      description: 'Parcele suas compras de forma simples e sem complicação',
      bgColor: 'bg-[#0066CC]',
      textColor: 'text-white',
      buttonVariant: 'secondary',
      link: 'https://www.casasbahia.com.br/hotsite/carne-digital.aspx'
    },
    {
      icon: CreditCard,
      title: 'Cartão Casas Bahia',
      description: 'Cartão de crédito com benefícios exclusivos',
      bgColor: 'bg-[#CC0000]',
      textColor: 'text-white',
      buttonVariant: 'secondary',
      link: 'https://www.casasbahia.com.br/hotsite/cartao-casas-bahia.aspx?nid=202409'
    },
    {
      icon: Wallet,
      title: 'banQi',
      description: 'Conta digital completa e gratuita para você',
      bgColor: 'bg-[#FFD700]',
      textColor: 'text-gray-900',
      buttonVariant: 'default',
      link: 'https://www.banqi.com.br/'
    },
    {
      icon: ShoppingBag,
      title: 'Casas Bahia',
      description: 'Milhares de produtos com as melhores condições',
      bgColor: 'bg-[#000000]',
      textColor: 'text-white',
      buttonVariant: 'secondary',
      link: 'https://www.casasbahia.com.br/'
    }
  ];

  const handleLearnMore = (link) => {
    window.open(link, '_blank');
  };

  return (
    <section id="solucoes" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Nossas Soluções
          </h2>
          <p className="text-lg md:text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Produtos e serviços pensados para você
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group h-full"
            >
              <div 
                className={`${solution.bgColor} ${solution.textColor} rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 h-full flex flex-col items-center text-center justify-between gap-4 min-h-[220px]`}
              >
                <div className="flex flex-col items-center gap-4 w-full"> {/* Changed gap to 4 */}
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <solution.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2"> {/* Added gap-2 implicitly with space-y-2 */}
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {solution.title}
                    </h3>
                    
                    <p className="opacity-90 leading-relaxed text-sm md:text-base font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {solution.description}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleLearnMore(solution.link)}
                  size="sm"
                  className={`w-full font-bold transition-all flex items-center justify-center gap-2
                    ${solution.bgColor === 'bg-[#FFD700]' 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Saiba mais <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;