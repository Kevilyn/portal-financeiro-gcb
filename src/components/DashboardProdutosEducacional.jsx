import React from 'react';
import { motion } from 'framer-motion';
import { Package, CreditCard, Wallet, ArrowRight, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DashboardProdutosEducacional = () => {
  const products = [
    {
      title: 'Carnê Digital banQi',
      description: 'A evolução do carnê. Mais prático, seguro e na palma da sua mão.',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      benefits: ['Parcelamento sem cartão', 'Controle total pelo app', 'Pagamento facilitado'],
      info: 'O Carnê Digital permite que você parcele suas compras nas Casas Bahia sem precisar de cartão de crédito. Tudo é aprovado na hora, sujeito à análise de crédito.',
      link: 'https://www.casasbahia.com.br/hotsite/carne-digital.aspx'
    },
    {
      title: 'Cartão Casas Bahia',
      description: 'Crédito e vantagens exclusivas para realizar seus sonhos.',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      benefits: ['Descontos exclusivos', 'Parcelamento em até 24x', 'Aceito em todo lugar'],
      info: 'Com o Cartão Casas Bahia Visa Platinum, você tem limite exclusivo para compras na loja e pode usar em qualquer estabelecimento que aceite Visa.',
      link: 'https://www.casasbahia.com.br/hotsite/cartao-casas-bahia.aspx?nid=202409'
    },
    {
      title: 'Conta Digital banQi',
      description: 'Sua conta digital grátis, sem taxas e com rendimento.',
      icon: Wallet,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
      benefits: ['Rende 100% do CDI', 'Pix e transferências grátis', 'Cartão pré-pago grátis'],
      info: 'A conta banQi é 100% digital e gratuita. Com ela você paga contas, faz recargas, compras e seu dinheiro rende mais que a poupança.',
      link: 'https://www.banqi.com.br/'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Você ainda não tem produtos ativos</h2>
        <p className="text-gray-600 text-lg">Conheça nossos produtos e solicite o seu agora mesmo para aproveitar todos os benefícios!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col hover:shadow-xl transition-shadow border-gray-200">
              <CardHeader>
                <div className={`w-14 h-14 ${product.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                  <product.icon className={`w-8 h-8 ${product.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{product.title}</CardTitle>
                <CardDescription className="text-base mt-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="space-y-2">
                  {product.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Accordion type="single" collapsible className="w-full border-none">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="text-sm font-medium text-gray-500 hover:text-gray-900 py-2">
                      <span className="flex items-center gap-2"><Info className="w-4 h-4" /> Como funciona?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {product.info}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  className="w-full gap-2 text-base font-semibold" 
                  onClick={() => window.open(product.link, '_blank')}
                  aria-label={`Solicitar ${product.title}`}
                >
                  Solicitar <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardProdutosEducacional;