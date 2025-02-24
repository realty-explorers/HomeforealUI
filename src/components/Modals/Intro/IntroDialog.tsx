import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Home,
  TrendingUp,
  Shield,
  ChevronRight,
  Check,
  Info,
  Wallet,
  Bot,
  SparkleIcon,
  FileCheck2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import TermsOfService from './TermsOfService';
import UserKyc from '@/content/Management/Users/profile/UserKYC';

// Define types for better code clarity
interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
  animation: string;
}

const steps: Step[] = [
  { id: 1, title: 'Welcome', icon: Home },
  { id: 2, title: 'Terms', icon: FileCheck2 },
  { id: 3, title: 'KYC', icon: Shield }
];

const benefits = [
  {
    title: 'Double Your Wins: Earn Cashback on Every Deal 🏆',
    description:
      'We scout top-tier properties AND slash fees—keep up to 2% cashback when you close. Think of it as a reward for being smart.',
    icon: Wallet,
    gradient: 'from-[#FFE29F] to-[#FFA99F]',
    animation: 'hover:scale-105 hover:rotate-2'
  },
  {
    title: 'Your 24/7 Deal-Closing Sidekick 🤖',
    description:
      'Our AI Realtor handles negotiations, paperwork, and deadlines—so you can focus on stacking profits.',
    icon: Bot,
    gradient: 'from-[#9b87f5] to-[#8B5CF6]',
    animation: 'hover:-translate-y-1 hover:rotate-[-2deg]'
  },
  {
    title: 'Secure Transactions Guaranteed 🛡️',
    description:
      'Bank-grade security and smart contracts protect every deal. Rest easy knowing your investments are safe.',
    icon: Shield,
    gradient: 'from-[#7E69AB] to-[#D946EF]',
    animation: 'hover:scale-105 hover:shadow-xl'
  }
];

interface IntroDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  step: number;
  setStep: (step: number) => void;
}

const IntroDialog: React.FC<IntroDialogProps> = ({
  open,
  setOpen,
  step,
  setStep
}) => {
  const [accepted, setAccepted] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const progress = (step / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      setOpen(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4 mb-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl bg-white border border-gray-100 shadow-lg transition-all duration-300 ${benefit.animation}`}
                >
                  <div className={`flex items-start space-x-4`}>
                    <div
                      className={`rounded-xl p-3 bg-gradient-to-r ${benefit.gradient} transform transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 mb-8">
            <TermsOfService />
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">
                I accept the terms and conditions
              </span>
            </label>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 mb-8 text-center">
            <div className="bg-primary/5 p-6 rounded-xl">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Info className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Fast & Secure KYC Process
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Our AI-powered verification takes less than 2 minutes! No more
                endless form filling - just snap, verify, and you're done! 🚀
              </p>
              <UserKyc />
              {/* <Button */}
              {/*   onClick={() => { */}
              {/*     //  Add KYC process handler */}
              {/*     alert('KYC process initiated!'); // Placeholder */}
              {/*   }} */}
              {/*   className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl" */}
              {/* > */}
              {/*   Start Verification */}
              {/* </Button> */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    switch (step) {
      case 1:
        return 'Review Terms';
      case 2:
        return 'Start KYC';
      case 3:
        return 'Complete Setup';
      default:
        return 'Next';
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-2xl w-[90%] md:w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-up max-h-[70%] flex flex-col p-0">
        <div className="hidden md:flex bg-gradient-to-r p-8 relative overflow-hidden justify-center">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary animate-fade-up">
              {/* Unlock Hidden Treasures in Real Estate! 💰 */}
              Realty Explorers
            </h1>
            {/* <h2 className="text-3xl font-bold text-white mb-8"> */}
            {/*   Welcome to Realty Explorers */}
            {/* </h2> */}
          </div>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        </div>

        {/* Progress bar */}
        <div className="px-8 pt-4 m-4 md:m-0">
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-3 justify-between mt-2 overflow-y-visible">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id <= step ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      step.id <= step ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                  >
                    {step.id < step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-sm">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Content */}
        <div className="px-8 pt-8 flex-grow overflow-y-auto" ref={contentRef}>
          {renderStepContent()}
        </div>
        <div className="pb-8 px-4 pt-0">
          {/* Action buttons */}
          <div className="flex justify-between items-center gap-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-gray-600"
            >
              Maybe later
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNext}
                    disabled={step === 2 && !accepted}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    <span>{getNextButtonText()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>We promise it's painless 😉</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntroDialog;
