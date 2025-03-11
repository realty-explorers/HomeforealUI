import React from 'react';
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={'/static/images/logo/hlogo.png'}
        alt={'realty-explorers'}
        width={80}
        height={80}
        className="max-w-full max-h-full object-contain"
        onError={() => {}}
        priority
      />
    </div>
  );
};

export default Logo;
