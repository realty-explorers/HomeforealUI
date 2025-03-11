import React from 'react';
import BackgroundAnimation from '@/components/Auth/BackgroundAnimation';
import Logo from '@/components/Auth/Logo';
import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm';
import { useSnackbar } from 'notistack';

const ForgotPassword = () => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <BackgroundAnimation />

      {/* Form container */}
      <div className="w-full max-w-md z-10">
        <div className="relative">
          {/* Logo */}
          <div className="w-full flex justify-center mb-6">
            <div className="animate-scale-in">
              <Logo className="w-16 h-16" />
            </div>
          </div>

          {/* Card with form */}
          <div
            className="p-8 rounded-xl morphic-card animate-fade-in shadow-xl bg-gradient-to-b from-white/95 to-white/90"
            style={{ animationDelay: '0.2s' }}
          >
            <ForgotPasswordForm />
          </div>

          {/* Footer */}
          <div
            className="mt-8 text-center text-sm text-secondary/90 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <p>© 2023 Nova. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
