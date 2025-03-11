import React, { useEffect } from 'react';
import SignUpForm from '@/components/Auth/SignUpForm';
import BackgroundAnimation from '@/components/Auth/BackgroundAnimation';
import Logo from '@/components/Auth/Logo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <BackgroundAnimation />

      {/* Sign-up container */}
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
            <SignUpForm />
          </div>

          {/* Back to sign in link */}
          <div
            className="mt-4 text-center animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              href="/"
              className="inline-flex items-center text-sm text-secondary hover:text-primary-purple transition-colors duration-300"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to sign in
            </Link>
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

export default SignUp;
