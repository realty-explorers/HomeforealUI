import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  RefreshCw,
  Check,
  X,
  Sparkles,
  Zap,
  Brain
} from 'lucide-react';
import { WizardProvider } from '@/contexts/OfferWizardContext';

// Import all wizard step components
import TemplateSelection from './wizard-steps/TemplateSelection';
import BuyerDetails from './wizard-steps/BuyerDetails';
import Financing from './wizard-steps/Financing';
import TermsConditions from './wizard-steps/TermsConditions';
import Settlement from './wizard-steps/Settlement';
import { useSnackbar } from 'notistack';

const steps = [
  {
    id: 'template',
    title: 'Template',
    component: TemplateSelection,
    icon: Sparkles
  },
  { id: 'buyer', title: 'Buyer', component: BuyerDetails, icon: Brain },
  { id: 'financing', title: 'Financing', component: Financing, icon: Zap },
  {
    id: 'terms',
    title: 'Terms',
    component: TermsConditions,
    icon: ChevronRight
  },
  { id: 'settlement', title: 'Settlement', component: Settlement, icon: Check }
];

interface WizardProps {
  onClose: () => void;
}

const Wizard = ({ onClose }: WizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDraft, setIsDraft] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const goToNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all form data? This cannot be undone.'
      )
    ) {
      setCurrentStep(0);
      enqueueSnackbar('Form data has been reset.', { variant: 'info' });
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    enqueueSnackbar('Draft Saved', { variant: 'default' });
  };

  const handleSubmit = () => {
    enqueueSnackbar('Offer Submitted', {
      variant: 'default'
    });
    // Close the wizard after successful submission
    setTimeout(() => onClose(), 1000);
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const CurrentStepComponent = steps[currentStep].component;
  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <WizardProvider>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
        <motion.div
          className="bg-white bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg shadow-brand-accent/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 border border-brand-accent/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-brand-accent/20 rounded-full blur-xl animate-pulse-glow"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand-light/20 rounded-full blur-xl animate-pulse-glow"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header with new Material UI Stepper */}
          <div className="mb-6 relative">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-purple-gradient">
              Create Legal Offer
            </h1>

            {/* Material UI Style Stepper Progress Bar */}
            <div className="mt-4">
              {/* <StepperProgress */}
              {/*   steps={steps} */}
              {/*   currentStep={currentStep} */}
              {/*   className="py-2" */}
              {/* /> */}
            </div>
          </div>

          {/* Wizard content */}
          <div className="py-4 relative">
            {/* Decorative shimmer background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div className="w-[200%] h-full bg-gradient-shine animate-shimmer"></div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Wizard navigation */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
            <div>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSaveDraft}
                className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
              >
                <Save className="h-4 w-4" /> Save Draft
              </Button>

              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  variant="default"
                  onClick={goToNext}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-brand-main to-brand-light flex items-center gap-1"
                >
                  Submit <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </WizardProvider>
  );
};

export default Wizard;
