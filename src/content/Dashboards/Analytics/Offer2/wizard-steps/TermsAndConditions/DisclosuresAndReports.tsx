import FormField from '@/components/FormField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import { AlertTriangle } from 'lucide-react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';

const DisclosuresAndReports = ({
  control,
  setValue,
  watch,
  register,
  errors
}: {
  control: Control<OfferFormData>;
  setValue: UseFormSetValue<OfferFormData>;
  watch: UseFormWatch<OfferFormData>;
  register: UseFormRegister<OfferFormData>;
  errors: FieldErrors<OfferFormData>;
}) => {
  return (
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
                  name={`propertyDisclosures.${item.id}` as any}
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
                name="propertyDisclosures.additionalDisclosures"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="additionalDisclosures"
                    label="Additional Disclosures"
                    error={
                      errors?.propertyDisclosures?.additionalDisclosures
                        ?.message
                    }
                  >
                    <Textarea
                      id="additionalDisclosures"
                      placeholder="Enter additional disclosures if any"
                      {...field}
                      className={
                        errors?.propertyDisclosures?.additionalDisclosures
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Required Reports</h3>

        <Controller
          name="propertyReports.endangeredSpeciesReport"
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
                  Requires a report on endangered species that may impact the
                  property
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
          name="propertyReports.environmnetalReport"
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
      </div>
    </div>
  );
};

export default DisclosuresAndReports;
