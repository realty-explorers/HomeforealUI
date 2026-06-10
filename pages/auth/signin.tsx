import React, { useEffect } from 'react';
import SignInForm from '@/components/Auth/SignInForm';
import BackgroundAnimation from '@/components/Auth/BackgroundAnimation';
import Logo from '@/components/Auth/Logo';
import { useSnackbar } from 'notistack';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-poppins">
      {/* Animated background */}
      <BackgroundAnimation />

      {/* Sign-in container */}
      <div className="w-full max-w-md z-10">
        <div className="relative">
          {/* Logo */}
          <div className="w-full flex justify-center mb-6">
            <div className="animate-scale-in">
              <Logo className="h-16 w-16" />
            </div>
          </div>

          {/* Card with form */}
          <div
            className="p-8 rounded-xl morphic-card animate-fade-in shadow-xl bg-gradient-to-b from-white/95 to-white/90"
            style={{ animationDelay: '0.2s' }}
          >
            <SignInForm />
          </div>

          {/* Footer */}
          <div
            className="mt-8 text-center text-sm text-secondary/90 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <p>© {new Date().getFullYear()} Realty Explorers. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
