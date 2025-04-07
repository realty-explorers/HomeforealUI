import FormField from '@/components/FormField';
import { Textarea } from '@/components/ui/textarea';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import ConditionalField from '../PropertyDescription/ConditionalField';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import CurrencyInput from '@/components/CurrencyInput';
import { Input } from '@/components/ui/input';

const PropertyDetails = ({
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
      <h3 className="text-lg font-semibold mb-4">Property Description</h3>

      <Controller
        name="legalDescription.description"
        control={control}
        render={({ field }) => (
          <FormField
            id="legalDescription"
            label="Legal Description"
            error={errors?.legalDescription?.description?.message}
            helperText="The legal description is different than the street or mailing address. It will refer to items such as lot and block. You might be able to find it on the land title, in tax assessment information, and in the mortgage agreement. You could also get it from a County Recorder's office (which may also be called a County Clerk or Register of Deeds office)."
          >
            <Textarea
              id="legalDescription"
              placeholder="Enter property legal description"
              {...field}
              className={`min-h-[100px] ${
                errors?.legalDescription?.description ? 'border-red-500' : ''
              }`}
            />
          </FormField>
        )}
      />

      <ConditionalField
        control={control}
        setValue={setValue}
        watch={watch}
        register={register}
        errors={errors}
        mainField={{
          name: 'conditions.subjectProperty.exists',
          label: 'Subject to property sale',
          description:
            'Is this agreement subject to the sale of another property?'
        }}
        conditionalFields={[
          {
            component: (
              <FormField
                id="conditions.subjectProperty.address"
                label="Address"
                error={
                  errors?.conditions?.subjectProperty?.address
                    ?.message as string
                }
              >
                <Input
                  id="conditions.subjectProperty.address"
                  placeholder="Enter address"
                  {...register('conditions.subjectProperty.address')}
                  className={
                    errors?.conditions?.subjectProperty?.address
                      ? 'border-red-500'
                      : ''
                  }
                />
              </FormField>
            ),
            resetField: () =>
              setValue('conditions.subjectProperty.address', undefined)
          }
        ]}
      />

      <div className="mt-4">
        <ConditionalField
          control={control}
          setValue={setValue}
          watch={watch}
          register={register}
          errors={errors}
          mainField={{
            name: 'conditions.excludeFixtures.exclude',
            label: 'Exclude Fixtures',
            description: 'Will any fixtures be excluded from the sale?',
            helperText:
              'Fixtures are personal property items that have been attached to land or a building in such a way that they cannot be removed without damaging the item. Sellers may choose to exclude fixtures such as built-in appliances or custom-made drapes if they have sentimental value or are hard to replace.'
          }}
          conditionalFields={[
            {
              component: (
                <FormField
                  id="conditions.excludeFixtures.fixtures"
                  label="Fixtures"
                  error={
                    errors?.conditions?.excludeFixtures?.fixtures
                      ?.message as string
                  }
                >
                  <Input
                    id="conditions.excludeFixtures.fixtures"
                    placeholder="Enter fixtures"
                    {...register('conditions.excludeFixtures.fixtures')}
                    className={
                      errors?.conditions?.excludeFixtures?.fixtures
                        ? 'border-red-500'
                        : ''
                    }
                  />
                </FormField>
              ),
              resetField: () =>
                setValue('conditions.excludeFixtures.fixtures', undefined)
            }
          ]}
        />
      </div>

      <div className="mt-4">
        <ConditionalField
          control={control}
          setValue={setValue}
          watch={watch}
          register={register}
          errors={errors}
          mainField={{
            name: 'conditions.residentialServiceContract.exists',
            label: 'Residential Service Contract',
            description: 'Require a residential service contract?',
            helperText:
              'A residential service contract is a service agreement that covers the repair or replacement of major home systems and appliances. It is also known as a home warranty.'
          }}
          conditionalFields={[
            {
              component: (
                <FormField
                  id="conditions.residentialServiceContract.sellerReimbursts.maximum"
                  label="Maximum Seller Reimbursement"
                  helperText="The maximum amount the seller will reimburse the buyer for repairs or replacements covered by the residential service contract. 
                  Leave 0 if the seller will not reimburse the buyer."
                  error={
                    errors?.conditions?.residentialServiceContract
                      ?.maximumReimbursement?.message as string
                  }
                >
                  <CurrencyInput
                    id="conditions.residentialServiceContract.maximusReimbursement"
                    value={
                      watch(
                        'conditions.residentialServiceContract.maximumReimbursement'
                      ) || 0
                    }
                    onChange={(value) =>
                      setValue(
                        'conditions.residentialServiceContract.maximumReimbursement',
                        value,
                        {
                          shouldValidate: true
                        }
                      )
                    }
                    error={
                      !!errors.conditions?.residentialServiceContract
                        ?.maximumReimbursement
                    }
                  />
                </FormField>
              ),
              resetField: () => {
                setValue(
                  'conditions.residentialServiceContract.maximumReimbursement',
                  undefined
                );
              }
            }
          ]}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;
