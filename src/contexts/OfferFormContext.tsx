// contexts/FormProvider.tsx
import { createContext, useContext, ReactNode, useState } from 'react';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  DefaultValues,
  useFormContext
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OfferSchema, OfferFormData } from '@/schemas/OfferSchemas';
import { offerTemplates, emptyTemplate } from '@/data/offerTemplates';

interface FormProviderProps<T extends FieldValues> {
  children: ReactNode;
  defaultValues?: DefaultValues<T>;
}

export function OfferFormProvider<T extends FieldValues>({
  children,
  defaultValues
}: FormProviderProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(OfferSchema as any),
    defaultValues,
    mode: 'onChange'
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

// Custom hook for wizard navigation
export const useWizardNavigation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));
  const goToStep = (step: number) => setCurrentStep(step);

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep
  };
};

// Custom hook for template selection
export const useTemplateSelection = (methods: UseFormReturn<OfferFormData>) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const { reset } = methods;

  const selectTemplate = (
    id: string | null,
    defaultData?: Partial<OfferFormData>
  ) => {
    setSelectedTemplateId(id);

    if (!id) {
      reset({ ...emptyTemplate.data, ...defaultData });
      return;
    }

    const template = offerTemplates.find((t) => t.id === id);
    if (template) {
      reset({ ...template.data, ...defaultData });
    } else {
      reset({ ...emptyTemplate.data, ...defaultData });
    }
  };

  const selectedTemplate = selectedTemplateId
    ? offerTemplates.find((t) => t.id === selectedTemplateId) || null
    : null;

  return {
    templates: offerTemplates,
    selectedTemplateId,
    selectedTemplate,
    selectTemplate
  };
};

const TemplateSelectionContext = createContext<ReturnType<
  typeof useTemplateSelection
> | null>(null);

// Create a provider component
export const TemplateSelectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const methods = useFormContext<OfferFormData>();
  const templateSelection = useTemplateSelection(methods);

  return (
    <TemplateSelectionContext.Provider value={templateSelection}>
      {children}
    </TemplateSelectionContext.Provider>
  );
};

// Create a hook to use the context
export const useTemplateSelectionContext = () => {
  const context = useContext(TemplateSelectionContext);
  if (!context) {
    throw new Error(
      'useTemplateSelectionContext must be used within a TemplateSelectionProvider'
    );
  }
  return context;
};
