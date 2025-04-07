import FormField from '@/components/FormField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import ConditionalField from '../PropertyDescription/ConditionalField';

const InspectionAndServey = ({
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
  const conductInspection = watch('propertyTerms.conductInspection');
  const isInspectionContingent = watch('propertyTerms.isInspectionContingent');
  return (
    <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Property Conditions</h3>

      <ConditionalField
        control={control}
        setValue={setValue}
        watch={watch}
        register={register}
        errors={errors}
        mainField={{
          name: 'conditions.propertyState.isNew',
          label: 'Is the property new?',
          description: ''
        }}
        conditionalFields={[
          {
            component: (
              <Controller
                name="conditions.propertyState.requestBuilderWarrany"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="conductInspection">
                        {' '}
                        Request Builder Warranty
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Will the buyer request a builder warranty?
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
            ),
            resetField: () =>
              setValue('conditions.propertyState.requestBuilderWarrany', false)
          }
        ]}
      />

      <ConditionalField
        control={control}
        setValue={setValue}
        watch={watch}
        register={register}
        errors={errors}
        mainField={{
          name: 'conditions.sellerRepairs.isRequired',
          label: 'Are repairs required?',
          description: 'Will the seller be required to make repairs?',
          helperText: 'This is a common condition in real estate transactions.'
        }}
        conditionalFields={[
          {
            component: (
              <FormField
                id="conditions.sellerRepairs.repairsDetails"
                label="Repairs Required"
                error={
                  errors.conditions?.sellerRepairs?.repairsDetails
                    ?.message as string
                }
              >
                <Input
                  id="conditions.sellerRepairs.repairsDetails"
                  placeholder="Enter details of repairs required"
                  {...register('conditions.sellerRepairs.repairsDetails')}
                  className={
                    errors.conditions?.sellerRepairs?.repairsDetails
                      ? 'border-red-500'
                      : ''
                  }
                />
              </FormField>
            ),
            resetField: () =>
              setValue('conditions.sellerRepairs.repairsDetails', undefined)
          }
        ]}
      />

      <h3 className="text-lg font-semibold my-4">Inspection Requirements</h3>

      <Controller
        name="propertyTerms.conductInspection"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="conductInspection">Conduct Inspection</Label>
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
        <Controller
          name="propertyTerms.inspectionDurationDays"
          control={control}
          render={({ field }) => (
            <FormField
              id="inspectionDurationDays"
              label="Inspection Period (Days)"
              className="mt-4"
              error={errors.propertyTerms?.inspectionDurationDays?.message}
            >
              <Input
                id="inspectionDurationDays"
                type="number"
                placeholder="Enter number of days"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                <Label htmlFor="requireNewSurvey">New Survey Required</Label>
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

        {watch('landSurvey.requireNewSurvey') && (
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
        )}
      </div>
    </div>
  );
};

export default InspectionAndServey;
