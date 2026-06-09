import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Logo = ({ size = 'medium', link = false, className, to = "/" }) => {
  // Responsive sizing classes based on props
  const sizeClasses = {
    small: 'w-[80px]',
    medium: 'w-[100px] md:w-[120px]',
    large: 'w-[120px] md:w-[150px]',
  };

  const LogoImage = () => (
    <img
      src="https://horizons-cdn.hostinger.com/5f5fd64d-365a-43a8-ad0d-f030cca0a0f7/b97d75d5af4d4c83d4b3eb621887a8bc.png"
      alt="Casas Bahia"
      className={cn(
        "object-contain h-auto transition-opacity duration-300 hover:opacity-80",
        sizeClasses[size],
        className
      )}
      loading="lazy"
      width={size === 'large' ? 150 : size === 'medium' ? 120 : 80}
      height="auto"
    />
  );

  const containerClasses = "inline-block m-4 p-2";

  if (link) {
    return (
      <Link 
        to={to} 
        title="Casas Bahia - Ir para home" 
        className={cn(containerClasses, "focus:outline-none focus:ring-2 focus:ring-[#0066CC] rounded-lg")}
        aria-label="Logo Casas Bahia - Ir para página inicial"
      >
        <LogoImage />
      </Link>
    );
  }

  return (
    <div className={cn(containerClasses, className)}>
      <LogoImage />
    </div>
  );
};

export default Logo;