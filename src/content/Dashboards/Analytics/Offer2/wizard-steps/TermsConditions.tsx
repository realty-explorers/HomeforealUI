import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';
import FormField from '@/components/FormField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  FileText,
  FileSearch,
  Shield,
  AlertTriangle,
  Check
} from 'lucide-react';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import HelperIcon from '@/components/HelperIcon';
import ConditionalField from './PropertyDescription/ConditionalField';
import PropertyDetails from './TermsAndConditions/PropertyDetails';
import InspectionAndServey from './TermsAndConditions/InspectionAndServey';
import DisclosuresAndReports from './TermsAndConditions/DisclosuresAndReports';
import { useWizardNavigation } from '@/contexts/WizardNavigationContext';

const disclosureTopics = [
  'occupancyAndProperty',
  'fixturesAndItems',
  'roof',
  'additionsAndAlterations',
  'soilTreeAndVegetation',
  'woodDestroyingOrganisms',
  'floodAndMoisture',
  'toxicMaterialAndSubstances',
  'covenantsFeesAndAssessments',
  'plumbing',
  'insulation',
  'miscellaneous'
];

const TermsConditions: React.FC = () => {
  const { setOnNextStep } = useWizardNavigation();
  const [currentTab, setCurrentTab] = React.useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    register,
    setValue
  } = useFormContext<OfferFormData>();

  const handleTabChange = (value: string) => {
    alert(value);
    setCurrentTab(Number(value));
  };
  const componentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOnNextStep(() => {
      if (currentTab < 2) {
        setCurrentTab((prev) => {
          if (componentRef.current) {
            componentRef.current.scrollIntoView({ behavior: 'smooth' });
          }
          return prev + 1;
        });
        throw new Error('Next tab');
      }
    });
    return () => {
      setOnNextStep(() => {});
    };
  }, [currentTab]);

  return (
    <motion.div
      ref={componentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="wizard-title">Terms & Conditions</div>
      <p className="wizard-subtitle">
        Define property conditions, disclosures and inspection requirements
      </p>

      <div className="space-y-6">
        <Tabs
          defaultValue="property"
          className="w-full"
          onValueChange={handleTabChange}
          value={currentTab.toString()}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="0" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Property Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
            <TabsTrigger value="1" className="flex items-center">
              <FileSearch className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Inspection & Survey</span>
              <span className="sm:hidden">Inspection</span>
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Disclosures & Reports</span>
              <span className="sm:hidden">Disclosures</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="0" className="mt-4">
            <PropertyDetails
              control={control}
              errors={errors}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </TabsContent>

          <TabsContent value="1" className="mt-4">
            <InspectionAndServey
              control={control}
              errors={errors}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </TabsContent>

          {/* Disclosures Tab */}
          <TabsContent value="2" className="mt-4">
            <DisclosuresAndReports
              control={control}
              errors={errors}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default TermsConditions;
