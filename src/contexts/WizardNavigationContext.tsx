import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef
} from 'react';

type WizardNavigationContextType = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setOnNextStep: (handler: () => void) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
};

const WizardNavigationContext = createContext<
  WizardNavigationContextType | undefined
>(undefined);

export const WizardNavigationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onNextStepRef = useRef<(() => void) | null>(null);

  const setOnNextStep = useCallback((handler: () => void) => {
    onNextStepRef.current = handler;
  }, []);

  const nextStep = useCallback(() => {
    try {
      if (onNextStepRef.current) {
        onNextStepRef.current();
      }
      setCurrentStep((prev) => prev + 1);
    } catch (e) {
      // Catch the error but don't increment step if error was thrown
      console.error('Error in next step handler:', e);
    }
  }, []);

  const prevStep = useCallback(
    () => setCurrentStep((prev) => Math.max(0, prev - 1)),
    []
  );

  const goToStep = useCallback((step: number) => setCurrentStep(step), []);

  const value = {
    currentStep,
    setCurrentStep,
    setOnNextStep,
    nextStep,
    prevStep,
    goToStep
  };

  return (
    <WizardNavigationContext.Provider value={value}>
      {children}
    </WizardNavigationContext.Provider>
  );
};

// Custom hook to use the context
export const useWizardNavigation = () => {
  const context = useContext(WizardNavigationContext);
  if (context === undefined) {
    throw new Error(
      'useWizardNavigation must be used within a WizardNavigationProvider'
    );
  }
  return context;
};
