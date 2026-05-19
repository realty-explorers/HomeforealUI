// contexts/FormProvider.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  useCallback,
  useEffect
} from 'react';
import { useSnackbar } from 'notistack';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  DefaultValues,
  useFormContext
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OfferSchema, OfferFormData } from '@/schemas/OfferDataSchemas';
import { emptyTemplate } from '@/data/offerTemplates';
import {
  useGetUserTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation
} from '@/store/services/offersApi';
import { merge } from 'lodash';
import { OfferTemplate } from 'types/offers/offer-template';

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

// Custom hook for template selection
export const useTemplateSelection = (methods: UseFormReturn<OfferFormData>) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [templates, setTemplates] = useState([]);
  const { reset, getValues } = methods;
  const { enqueueSnackbar } = useSnackbar();

  // Use the RTK Query hooks
  const {
    data: apiTemplates,
    isLoading,
    isSuccess
  } = useGetUserTemplatesQuery({});

  const [createTemplate, { isLoading: isCreating }] =
    useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] =
    useUpdateTemplateMutation();
  const [deleteTemplateMutation, { isLoading: isDeleting }] =
    useDeleteTemplateMutation();
  const isSaving = isCreating || isUpdating || isDeleting;

  // Load templates from API when available
  useEffect(() => {
    if (isSuccess && apiTemplates) {
      setTemplates(apiTemplates);
    }
  }, [apiTemplates, isSuccess]);

  const selectTemplate = (
    id: string | null,
    defaultData?: Partial<OfferFormData>
  ) => {
    setSelectedTemplateId(id);

    if (!id) {
      reset({ ...emptyTemplate.data, ...defaultData });
      return;
    }

    const template = templates.find((t) => t._id === id);
    if (template) {
      reset(merge({}, template.data, defaultData));
    } else {
      reset(merge({}, emptyTemplate.data, defaultData));
    }
  };

  const selectedTemplate = selectedTemplateId
    ? templates.find((t) => t._id === selectedTemplateId) || null
    : null;

  const deleteTemplate = async (templateId: string) => {
    try {
      const result = await deleteTemplateMutation({ templateId }).unwrap();

      // If the deleted template was selected, reset to custom template
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId(null);
        reset(emptyTemplate.data);
      }

      enqueueSnackbar('Template deleted successfully', { variant: 'success' });
      return { success: true, data: result };
    } catch (error) {
      enqueueSnackbar('Failed to delete template', { variant: 'error' });
      return { success: false, error };
    }
  };

  const saveTemplate = async (
    name: string,
    description: string,
    templateId?: string
  ) => {
    try {
      const currentFormData = getValues();
      const templateData = JSON.parse(JSON.stringify(currentFormData));
      delete templateData.financialDetails.purchasePrice;
      let closingDays = 30;
      if (
        templateData.closingDetails?.closeByDate &&
        templateData.closingDetails.closingDate
      ) {
        const closeByDate = new Date(templateData.closingDetails.closingDate);
        const today = new Date();
        closingDays = Math.ceil(
          (closeByDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
        );
      } else if (templateData.closingDetails?.closingDeadline) {
        closingDays = templateData.closingDetails.closingDeadline;
      }
      templateData.closingDetails.closeByDate = false;
      templateData.closingDetails.closingDeadline = closingDays;

      let result;

      // If templateId is provided, update the existing template
      if (templateId) {
        result = await updateTemplate({
          templateId,
          body: {
            newName: name,
            description,
            data: currentFormData
          }
        }).unwrap();
      } else {
        // Otherwise create a new template
        result = await createTemplate({
          name,
          description,
          data: currentFormData
        }).unwrap();
      }

      // Select the newly created/updated template
      if (!templateId && result._id) {
        selectTemplate(result._id, currentFormData);
      }

      const action = templateId ? 'updated' : 'saved';
      enqueueSnackbar(`Template ${action} successfully`, {
        variant: 'success'
      });
      return { success: true, data: result };
    } catch (error) {
      const action = templateId ? 'update' : 'save';
      enqueueSnackbar(`Failed to ${action} template`, { variant: 'error' });
      return { success: false, error };
    }
  };

  return {
    templates,
    selectedTemplateId,
    selectedTemplate,
    selectTemplate,
    saveTemplate,
    deleteTemplate,
    isLoading,
    isSaving
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
