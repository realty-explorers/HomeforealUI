import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { OfferSchemaType } from '@/schemas/OfferSchemas';
import {
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import clsx from 'clsx';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useState } from 'react';
import {
  Control,
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../OfferDialog.module.scss';

const disclosures: {
  label: string;
  helper?: string;
  fieldName: Path<OfferSchemaType>;
}[] = [
  {
    label: 'Occupancy and property',
    helper:
      'Provide disclosure relating to leases, liens, litigation and general title issues in association with the property.',
    fieldName: 'propertyConditions.disclosureTopics.occupancyAndProperty'
  },
  {
    label: 'Fixtures and items',
    helper:
      'Provide disclosure relating to what items and fixtures are on the property and whether there are any defects in association with them. (e.g. appliances and smoke detectors)',
    fieldName: 'propertyConditions.disclosureTopics.fixturesAndItems'
  },
  {
    label: 'Roof, downspouts, and gutters',
    helper:
      'Provide disclosure relating to the history and condition of the roof, downspouts and gutters.',
    fieldName: 'propertyConditions.disclosureTopics.roof'
  },
  {
    label: 'Additions, alterations, and structural issues',
    helper:
      'Provide disclosure relating to various conditions and issues of the property structure. (e.g. foundation, additional structural reinforcements, building code compliance, etc.)',
    fieldName: 'propertyConditions.disclosureTopics.additionsAndAlterations'
  },
  {
    label: 'Soil, trees, and vegetation',
    helper:
      'Provide disclosure relating to the property’s soil and vegetation.',
    fieldName: 'propertyConditions.disclosureTopics.soilTreeAndVegetation'
  },
  {
    label: 'Wood-destroying organisms',
    helper:
      'Provide disclosure relating to any organism that affects the wooden structures of the property. (e.g. termites and dry rots)',
    fieldName: 'propertyConditions.disclosureTopics.woodDestroyingOrganisms'
  },
  {
    label: 'Flood and moisture damage',
    helper:
      'Provide disclosure relating to issues of flood hazards and water damage in the property. (e.g. mold and humidity problems, flood guidelines compliance, etc.)',
    fieldName: 'propertyConditions.disclosureTopics.floodAndMoisture'
  },
  {
    label: 'Toxic material and substances',
    helper:
      'Provide disclosure relating to toxic material or hazards on or near the property. (e.g. radon gas, PCBs, asbestos, etc.)',
    fieldName: 'propertyConditions.disclosureTopics.toxicMaterialAndSubstances'
  },
  {
    label: 'Covenants, fees, and assessments',
    helper:
      'Provide disclosure relating to any fees or obligations the owner is responsible for. (e.g. community associations and their associated fees)',
    fieldName: 'propertyConditions.disclosureTopics.covenantsFeesAndAssessments'
  },
  {
    label: 'Plumbing',
    helper:
      'Provide disclosure relating to any plumbing issues on the property. (e.g. water source, water problems and septic tank issues, etc.)',
    fieldName: 'propertyConditions.disclosureTopics.plumbing'
  },
  {
    label: 'Insulation',
    helper: 'Provide disclosure relating to the insulation of the property.',
    fieldName: 'propertyConditions.disclosureTopics.insulation'
  },
  {
    label: 'Miscellaneous',
    helper:
      'Provide disclosure relating to various general issues that affect the property. (e.g. pest infestations, noise or odor disturbances, general physical problems not covered by other disclosure sections, whether the property is the subject of a litigation, etc.)',
    fieldName: 'propertyConditions.disclosureTopics.miscellaneous'
  }
];

type OfferingPropertyConditionProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingPropertyCondition = ({
  register,
  control,
  watch,
  errors
}: OfferingPropertyConditionProps) => {
  const [isSellerRepairing, setIsSellerRepairing] = useState(false);
  const [provideDisclosure, setProvideDisclosure] = useState(false);
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Property Condition
      </Typography>
      <Typography
        className={clsx([
          styles.subheader,
          'col-span-1 flex items-center gap-x-2'
        ])}
      >
        The property is brand new?
        <Tooltip title="If the property being sold is a brand new home, then federal law requires the seller to disclose the insulation details in the Real Estate Purchase Agreement">
          <HelpOutlineOutlinedIcon className="text-gray-400" />
        </Tooltip>
      </Typography>

      <SwitchField
        control={control}
        fieldName="propertyConditions.isNew"
        className="m-0"
      />

      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        The seller will provide a residential property disclosure statement?
      </Typography>

      <Switch
        className="m-0"
        checked={provideDisclosure}
        onChange={() => setProvideDisclosure(!provideDisclosure)}
      />

      {provideDisclosure && (
        <div className="grid grid-cols-2">
          {disclosures.map((disclosure, index) => (
            <>
              <Typography className={clsx([styles.subheader])}>
                {disclosure.label}
                {disclosure.helper && (
                  <Tooltip title={disclosure.helper}>
                    <HelpOutlineOutlinedIcon className="text-gray-400" />
                  </Tooltip>
                )}
              </Typography>
              <SwitchField
                control={control}
                fieldName={disclosure.fieldName}
                className="m-0"
              />
            </>
          ))}

          <Typography className={clsx([styles.subheader])}>
            Additional and county/local law
          </Typography>

          <TextField
            label="List the disclosures (if any)"
            variant="outlined"
            size="small"
            {...register(
              'propertyConditions.disclosureTopics.additionalDisclosures'
            )}
            helperText={
              errors?.propertyConditions?.disclosureTopics.additionalDisclosures
                ?.message
            }
            error={
              !!errors?.propertyConditions?.disclosureTopics
                .additionalDisclosures
            }
          />
        </div>
      )}

      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        The seller will make repairs or improvements before the closing date?
      </Typography>

      <Switch
        className="m-0"
        checked={isSellerRepairing}
        onChange={() => setIsSellerRepairing(!isSellerRepairing)}
      />
      {isSellerRepairing && (
        <TextField
          label="Seller Repairs and Improvements"
          variant="outlined"
          size="small"
          {...register('propertyConditions.sellerRepairs')}
          helperText={errors?.propertyConditions?.sellerRepairs?.message}
          error={!!errors?.propertyConditions?.sellerRepairs}
        />
      )}

      <Typography
        className={clsx([styles.subheader, 'col-span-1 col-start-1'])}
      >
        Ask to conduct a threatened or endangered species report?
        <Tooltip title="The property might be affected by threatened or endangered species which can limit renovation work in some states">
          <HelpOutlineOutlinedIcon className="text-gray-400" />
        </Tooltip>
      </Typography>

      <SwitchField
        control={control}
        fieldName="propertyCondition.conductEndangeredSpeciesReport"
        className="m-0"
      />

      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        Conduct an environmental report?
        <Tooltip title="You can have an environmental specialist create an environmental assessment report to determine whether any characteristics of the property are causing a negative environmental impact. For example, the report would inform the buyer if there were any underground storage tanks on the property that were leaking a contaminant into the soil.">
          <HelpOutlineOutlinedIcon className="text-gray-400" />
        </Tooltip>
      </Typography>

      <SwitchField
        control={control}
        fieldName="propertyCondition.conductEnvironmnetalReport"
        className="m-0"
      />

      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        You require a residential service contract?
      </Typography>

      <SwitchField
        control={control}
        fieldName="propertyCondition.requireResidentialServiceContract"
        className="m-0"
      />
    </>
  );
};

export default OfferingPropertyCondition;
