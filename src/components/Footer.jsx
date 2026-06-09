import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = () => {
  const institutionalLinks = [
    { label: 'Sobre nós', href: '#' },
    { label: 'Trabalhe conosco', href: '#' },
    { label: 'Imprensa', href: '#' },
    { label: 'Investidores', href: '#' }
  ];

  const helpLinks = [
    { label: 'Central de ajuda', href: '#' },
    { label: 'Trocas e devoluções', href: '#' },
    { label: 'Política de privacidade', href: '#' },
    { label: 'Termos de uso', href: '#' }
  ];

  const productLinks = [
    { label: 'Carnê Digital', href: '#' },
    { label: 'Cartão Casas Bahia', href: '#' },
    { label: 'Conta Digital', href: '#' },
    { label: 'Seguros', href: '#' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8 md:mb-10 border-b border-gray-700 pb-6 md:pb-8">
          <Logo size="medium" link={false} className="m-0 p-0 brightness-0 invert opacity-90" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          <div>
            <span className="text-lg md:text-xl font-bold mb-3 md:mb-4 block" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Institucional
            </span>
            <ul className="space-y-2">
              {institutionalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm md:text-base text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-lg md:text-xl font-bold mb-3 md:mb-4 block" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Ajuda
            </span>
            <ul className="space-y-2">
              {helpLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm md:text-base text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-lg md:text-xl font-bold mb-3 md:mb-4 block" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Produtos
            </span>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm md:text-base text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-lg md:text-xl font-bold mb-3 md:mb-4 block" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Contato
            </span>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                <Phone className="w-4 h-4" />
                <span style={{ fontFamily: 'Inter, sans-serif' }}>4003-0515</span>
              </li>
              <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                <Mail className="w-4 h-4" />
                <span style={{ fontFamily: 'Inter, sans-serif' }}>contato@casasbahia.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                <MapPin className="w-4 h-4" />
                <span style={{ fontFamily: 'Inter, sans-serif' }}>São Paulo, SP</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-700 hover:bg-[#E31C23] flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2026 Casas Bahia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;