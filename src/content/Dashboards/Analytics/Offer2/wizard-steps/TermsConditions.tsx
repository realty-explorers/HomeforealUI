import React from 'react';
import { motion } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';
import { useWizardNavigation } from '@/contexts/OfferFormContext';
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
import { OfferFormData } from '@/schemas/OfferSchemas';

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
  const { nextStep, prevStep } = useWizardNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useFormContext<OfferFormData>();

  const conductInspection = watch('propertyTerms.conductInspection');
  const isInspectionContingent = watch('propertyTerms.isInspectionContingent');

  const handleNext = async () => {
    const isValid = await trigger(
      [
        'legalDescription.description',
        'propertyConditions.disclosureTopics.additionalDisclosures',
        'propertyConditions.sellerRepairs',
        'landSurvey.surveyorChoice'
      ],
      { shouldFocus: true }
    );
    if (isValid) {
      nextStep();
    }
  };

  const onSubmit = () => handleNext();

  return (
    <motion.div
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
        <Tabs defaultValue="property" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="property" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Property Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
            <TabsTrigger value="inspection" className="flex items-center">
              <FileSearch className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Inspection & Survey</span>
              <span className="sm:hidden">Inspection</span>
            </TabsTrigger>
            <TabsTrigger value="disclosures" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Disclosures & Reports</span>
              <span className="sm:hidden">Disclosures</span>
            </TabsTrigger>
          </TabsList>

          {/* Property Details Tab */}
          <TabsContent value="property" className="mt-4">
            <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">
                Property Description
              </h3>

              <Controller
                name="legalDescription.description"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="legalDescription"
                    label="Legal Description"
                    error={errors.legalDescription?.description?.message}
                  >
                    <Textarea
                      id="legalDescription"
                      placeholder="Enter property legal description"
                      {...field}
                      className={`min-h-[100px] ${
                        errors.legalDescription?.description
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                  </FormField>
                )}
              />

              <div className="mt-4">
                <Controller
                  name="conditions.subjectProperty"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="subjectProperty">
                          Subject Property
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Is this offer subject to the property being in a
                          specific condition?
                        </p>
                      </div>
                      <Switch
                        id="subjectProperty"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>

              <Controller
                name="propertyConditions.isNew"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="isNewProperty">New Property</Label>
                      <p className="text-sm text-muted-foreground">
                        Is this a newly constructed property?
                      </p>
                    </div>
                    <Switch
                      id="isNewProperty"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
          </TabsContent>

          {/* Inspection & Survey Tab */}
          <TabsContent value="inspection" className="mt-4">
            <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">
                Inspection Requirements
              </h3>

              <Controller
                name="propertyTerms.conductInspection"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="conductInspection">
                        Conduct Inspection
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Will the buyer conduct a property inspection?
                      </p>
                    </div>
                    <Switch
                      id="conductInspection"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              {conductInspection && (
                <>
                  <Controller
                    name="propertyTerms.isInspectionContingent"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="isInspectionContingent">
                            Inspection Contingency
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Is the offer contingent on inspection results?
                          </p>
                        </div>
                        <Switch
                          id="isInspectionContingent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  {isInspectionContingent && (
                    <Controller
                      name="propertyTerms.inspectionDurationDays"
                      control={control}
                      render={({ field }) => (
                        <FormField
                          id="inspectionDurationDays"
                          label="Inspection Period (Days)"
                          className="mt-4"
                          error={
                            errors.propertyTerms?.inspectionDurationDays
                              ?.message
                          }
                        >
                          <Input
                            id="inspectionDurationDays"
                            type="number"
                            placeholder="Enter number of days"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            className={
                              errors.propertyTerms?.inspectionDurationDays
                                ? 'border-red-500'
                                : ''
                            }
                          />
                        </FormField>
                      )}
                    />
                  )}
                </>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Land Survey</h3>

                <Controller
                  name="landSurvey.requireNewSurvey"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireNewSurvey">
                          New Survey Required
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Does this transaction require a new land survey?
                        </p>
                      </div>
                      <Switch
                        id="requireNewSurvey"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="landSurvey.surveyorChoice"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      id="surveyorChoice"
                      label="Surveyor Selected By"
                      className="mt-4"
                      error={errors.landSurvey?.surveyorChoice?.message}
                    >
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="buyer"
                            value="Buyer"
                            checked={field.value === 'Buyer'}
                            onChange={() => field.onChange('Buyer')}
                            className="h-4 w-4 text-brand-main"
                          />
                          <Label htmlFor="buyer">Buyer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="seller"
                            value="Seller"
                            checked={field.value === 'Seller'}
                            onChange={() => field.onChange('Seller')}
                            className="h-4 w-4 text-brand-main"
                          />
                          <Label htmlFor="seller">Seller</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="mutual"
                            value="Mutual"
                            checked={field.value === 'Mutual'}
                            onChange={() => field.onChange('Mutual')}
                            className="h-4 w-4 text-brand-main"
                          />
                          <Label htmlFor="mutual">Mutual Agreement</Label>
                        </div>
                      </div>
                    </FormField>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Disclosures Tab */}
          <TabsContent value="disclosures" className="mt-4">
            <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Seller Disclosures</h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="disclosures">
                  <AccordionTrigger className="text-md font-medium">
                    Required Disclosure Topics
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-2">
                      {[
                        {
                          id: 'occupancyAndProperty',
                          label: 'Occupancy & Property'
                        },
                        { id: 'fixturesAndItems', label: 'Fixtures & Items' },
                        { id: 'roof', label: 'Roof' },
                        {
                          id: 'additionsAndAlterations',
                          label: 'Additions & Alterations'
                        },
                        {
                          id: 'soilTreeAndVegetation',
                          label: 'Soil, Tree & Vegetation'
                        },
                        {
                          id: 'woodDestroyingOrganisms',
                          label: 'Wood-Destroying Organisms'
                        },
                        { id: 'floodAndMoisture', label: 'Flood & Moisture' },
                        {
                          id: 'toxicMaterialAndSubstances',
                          label: 'Toxic Material & Substances'
                        },
                        {
                          id: 'covenantsFeesAndAssessments',
                          label: 'Covenants, Fees & Assessments'
                        },
                        { id: 'plumbing', label: 'Plumbing' },
                        { id: 'insulation', label: 'Insulation' },
                        { id: 'miscellaneous', label: 'Miscellaneous' }
                      ].map((item) => (
                        <Controller
                          key={item.id}
                          name={
                            `propertyConditions.disclosureTopics.${item.id}` as any
                          }
                          control={control}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={item.id}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor={item.id}>{item.label}</Label>
                            </div>
                          )}
                        />
                      ))}

                      <Controller
                        name="propertyConditions.disclosureTopics.additionalDisclosures"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            id="additionalDisclosures"
                            label="Additional Disclosures"
                            error={
                              errors.propertyConditions?.disclosureTopics
                                ?.additionalDisclosures?.message
                            }
                          >
                            <Textarea
                              id="additionalDisclosures"
                              placeholder="Enter additional disclosures if any"
                              {...field}
                              className={
                                errors.propertyConditions?.disclosureTopics
                                  ?.additionalDisclosures
                                  ? 'border-red-500'
                                  : ''
                              }
                            />
                          </FormField>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-4">
                <Controller
                  name="propertyConditions.sellerRepairs"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      id="sellerRepairs"
                      label="Required Seller Repairs"
                      error={errors.propertyConditions?.sellerRepairs?.message}
                    >
                      <Textarea
                        id="sellerRepairs"
                        placeholder="Enter any repairs the seller must complete"
                        {...field}
                        className={
                          errors.propertyConditions?.sellerRepairs
                            ? 'border-red-500'
                            : ''
                        }
                      />
                    </FormField>
                  )}
                />
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Required Reports</h3>

                <Controller
                  name="propertyConditions.conductEndangeredSpeciesReport"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="conductEndangeredSpeciesReport"
                          className="flex items-center"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          Endangered Species Report
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Requires a report on endangered species that may
                          impact the property
                        </p>
                      </div>
                      <Switch
                        id="conductEndangeredSpeciesReport"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="propertyConditions.conductEnvironmnetalReport"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="conductEnvironmnetalReport"
                          className="flex items-center"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          Environmental Report
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Requires an environmental assessment of the property
                        </p>
                      </div>
                      <Switch
                        id="conductEnvironmnetalReport"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="propertyConditions.requireResidentialServiceContract"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="requireResidentialServiceContract"
                          className="flex items-center"
                        >
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Residential Service Contract
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Requires a residential service/warranty contract
                        </p>
                      </div>
                      <Switch
                        id="requireResidentialServiceContract"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default TermsConditions;
