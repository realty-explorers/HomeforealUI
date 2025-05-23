import { useEffect, useRef, useState } from 'react';
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
  Brain,
  LoaderCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useSnackbar } from 'notistack';
import { useForm, useFormContext } from 'react-hook-form';
import {
  OfferFormProvider,
  useTemplateSelection,
  TemplateSelectionProvider,
  useTemplateSelectionContext
} from '@/contexts/OfferFormContext';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import { emptyTemplate } from '@/data/offerTemplates';

// Import all wizard step components
import TemplateSelection from './wizard-steps/TemplateSelection';
import BuyerDetails from './wizard-steps/BuyerDetails';
import Financing from './wizard-steps/Financing';
import TermsConditions from './wizard-steps/TermsConditions';
import Settlement from './wizard-steps/Settlement';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/store/hooks';
import { selectProperties } from '@/store/slices/propertiesSlice';
import { useSelector } from 'react-redux';
import { useCreateOfferMutation } from '@/store/services/offersApi';
import WizardNavigationFooter from './WizardNavigationFooter';
import {
  useWizardNavigation,
  WizardNavigationProvider
} from '@/contexts/WizardNavigationContext';

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
  open: boolean;
  onClose: () => void;
}

const WizardContent = ({ open, onClose }: WizardProps) => {
  const [isDraft, setIsDraft] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const methods = useFormContext<OfferFormData>();
  const { currentStep, setCurrentStep, nextStep, prevStep, goToStep } =
    useWizardNavigation();
  // const { selectedTemplateId, selectTemplate } = useTemplateSelection(methods);
  const { selectTemplate } = useTemplateSelectionContext();

  const { data: session, status } = useSession();

  const [createOffer, offerState] = useCreateOfferMutation();
  const { selectedProperty } = useSelector(selectProperties);
  const userFormData: Partial<OfferFormData> = {
    buyerDetails: {
      email: session?.user?.email || ''
    },
    financialDetails: {
      purchasePrice: selectedProperty?.price || 0
    }
  };

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectTemplate('custom', { ...userFormData });
    setCurrentStep(0);
  }, [session?.user, selectedProperty]);

  useEffect(() => {
    componentRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep]);

  const triggerByStep = async (step: number) => {
    switch (step) {
      case 1:
        return methods.trigger('buyerDetails');
      case 2:
        return methods.trigger('financialDetails');
      case 3:
        return (
          methods.trigger('propertyTerms') &&
          methods.trigger('conditions') &&
          methods.trigger('propertyDisclosures') &&
          methods.trigger('propertyReports')
        );
      case 4:
        return methods.trigger('settlementExpenses');
      default:
        return true;
    }
  };

  const handleGoToNext = async () => {
    // For template step, just proceed
    if (currentStep === 0) {
      nextStep();
      return;
    }

    // For other steps, validate the relevant part of the form
    const isValid = await triggerByStep(currentStep);
    if (isValid) {
      nextStep();
    } else {
      enqueueSnackbar('Please fill out the required fields', {
        variant: 'error'
      });
    }
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all form data? This cannot be undone.'
      )
    ) {
      methods.reset(emptyTemplate.data as OfferFormData);
      goToStep(0);
      selectTemplate(null);
      enqueueSnackbar('Form Reset', {
        variant: 'default'
      });
    }
  };

  const handleSaveDraft = () => {
    // Get current form values
    const formData = methods.getValues();
    // Save to localStorage
    localStorage.setItem('offerDraft', JSON.stringify(formData));

    setIsDraft(true);
    enqueueSnackbar('Draft Saved', {
      variant: 'default'
    });
  };

  const getErrors = () => {};

  const onSubmit = async (data: OfferFormData) => {
    try {
      console.log('Form submitted:', data);
      const userId = session.user.id;
      const propertyId = selectedProperty.propertyId;
      const response = await createOffer({
        userId,
        propertyId,
        offerData: data
      }).unwrap();
      enqueueSnackbar(`Offer created successfully`, {
        variant: 'success'
      });
      onClose();
    } catch (error) {
      const statusCode = error?.status;
      if (statusCode === 409) {
        enqueueSnackbar(`You already sent an offer for this property`, {
          variant: 'warning'
        });
      } else {
        enqueueSnackbar(`Error creating offer`, {
          variant: 'error'
        });
      }
    }

    // Close the wizard after successful submission
  };

  const onError = (errors, e) => {
    console.log('Form submission errors:', errors);
    enqueueSnackbar('Please fill out the required fields', {
      variant: 'error'
    });
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const CurrentStepComponent = steps[currentStep].component;
  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-gradient-to-br from-white to-purple-50">
        <div className="p-6 h-[100dvh] md:max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader className="mb-6 relative">
            <DialogTitle
              className="text-2xl font-bold bg-clip-text bg-purple-gradient"
              ref={componentRef}
            >
              Create Legal Offer
            </DialogTitle>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </DialogHeader>

          {/* Wizard content */}
          <div className="py-4 relative">
            {/* Decorative shimmer background */}
            {/* <div className="absolute inset-0 w-full h-full overflow-hidden"> */}
            {/*   <div className="w-[200%] h-full bg-gradient-shine animate-shimmer"></div> */}
            {/* </div> */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                methods.handleSubmit(onSubmit, onError);
              }}
            >
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

              <WizardNavigationFooter
                handleReset={handleReset}
                currentStep={currentStep}
                totalSteps={steps.length}
                handleGoToBack={prevStep}
                handleGoToNext={handleGoToNext}
                handleSubmit={methods.handleSubmit(onSubmit, onError)}
                loading={offerState.isLoading}
              />

              {/* {methods.formState.errors && ( */}
              {/*   <pre>{JSON.stringify(methods.formState.errors, null, 2)}</pre> */}
              {/* )} */}
              {/* Wizard navigation */}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Wizard = (props: WizardProps) => {
  return (
    <OfferFormProvider defaultValues={emptyTemplate.data as OfferFormData}>
      <TemplateSelectionProvider>
        <WizardNavigationProvider>
          <WizardContent {...props} />
        </WizardNavigationProvider>
      </TemplateSelectionProvider>
    </OfferFormProvider>
  );
};

export default Wizard;
