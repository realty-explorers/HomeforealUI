import { useEffect, useState } from 'react';
import Image from 'next/image';
import CustomSpinner from './AuthSpinner';
import {
  Cable,
  KeyRound,
  LogIn,
  Shield,
  ShieldCheck,
  ShieldPlus,
  UnplugIcon,
  UserCheckIcon
} from 'lucide-react';

interface LoadingScreenProps {
  companyOneLogoUrl?: string;
  companyTwoLogoUrl?: string;
  companyOneName?: string;
  companyTwoName?: string;
  message?: string;
}

const LoadingScreen = ({
  companyOneLogoUrl = '/company-logo-1.svg',
  companyTwoLogoUrl = '/company-logo-2.svg',
  companyOneName = 'Company One',
  companyTwoName = 'Company Two',
  message = 'Authenticating your session'
}: LoadingScreenProps) => {
  const [dots, setDots] = useState('');
  const [companyOneImgSrc, setCompanyOneImgSrc] = useState(companyOneLogoUrl);
  const [companyTwoImgSrc, setCompanyTwoImgSrc] = useState(companyTwoLogoUrl);

  // Animated dots for the loading message
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 z-50">
      <div className="loading-panel rounded-xl p-8 max-w-md w-full mx-4 animate-scale-up">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-8 relative">
            <div className="w-20 h-20 flex items-center justify-center mr-3 p-2 bg-white rounded-lg shadow-sm animate-fade-in">
              <Image
                src={companyOneImgSrc}
                alt={companyOneName}
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
                onError={() => {
                  setCompanyOneImgSrc(
                    `https://via.placeholder.com/100?text=${companyOneName.charAt(
                      0
                    )}`
                  );
                }}
                priority
              />
            </div>

            <div className="relative h-10 w-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <CustomSpinner color="#9b87f5" size={40} />
              </div>
              <div className="z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <LogIn size={20} color="#9b87f5" />
              </div>
            </div>

            <div
              className="w-20 h-20 flex items-center justify-center ml-3 p-2 bg-white rounded-lg shadow-sm animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Image
                src={companyTwoImgSrc}
                alt={companyTwoName}
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
                onError={() => {
                  setCompanyTwoImgSrc(
                    `https://via.placeholder.com/100?text=${companyTwoName.charAt(
                      0
                    )}`
                  );
                }}
                priority
              />
            </div>
          </div>

          {/* Loading message */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium mb-1 text-gray-800 dark:text-gray-100">
              {message}
              <span>{dots}</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Establishing secure connection between systems
            </p>
          </div>

          {/* Indefinite progress bar */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out animate-pulse-opacity relative"
              style={{
                width: '100%',
                backgroundSize: '200% 100%',
                animation: 'slide 2s linear infinite'
              }}
            >
              <style jsx>{`
                @keyframes slide {
                  0% {
                    background-position: 100% 0;
                  }
                  100% {
                    background-position: -100% 0;
                  }
                }
              `}</style>
            </div>
          </div>

          {/* Footer */}
          <div className="loading-divider flex items-center w-full mt-8 mb-2">
            <span className="mx-4 text-xs text-gray-400 dark:text-gray-500">
              Secure Connection
            </span>
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            Your data is protected with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
