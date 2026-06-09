import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BannerCarousel from '@/components/BannerCarousel';
import SolutionsSection from '@/components/SolutionsSection';
import BenefitsSection from '@/components/BenefitsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Portal Financeiro Casas Bahia - Gerencie suas finanças</title>
        <meta name="description" content="Bem-vindo ao Portal Financeiro Casas Bahia. Consulte seu CPF, negocie acordos e aproveite benefícios exclusivos." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <Hero />
        
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <BannerCarousel />
          </div>
        </section>

        <SolutionsSection />
        <BenefitsSection />
        <FAQSection />
        <Footer />
        <FloatingButtons />
      </div>
    </>
  );
};

export default HomePage;