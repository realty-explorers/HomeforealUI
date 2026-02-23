import {
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Pagination,
  Slider,
  Switch,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { Button as ShadButton } from '@/components/ui/button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';

import _ from 'lodash';
import { poppins } from '@/components/Fonts';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './EditBuyBoxDialog.module.scss';

import { motion } from 'framer-motion';
import InvestmentCriteria from './InvestmentCriteria';
import ComparablePreferences from './ComparablePreferences';
import SimilarityChart from './SimilarityChart';
import { buyboxSchema, BuyboxSchemaData } from '@/schemas/BuyBoxSchemas';
import BuyBox from '@/models/buybox';
import {
  buyBoxApi,
  useCreateBuyBoxMutation,
  useDeleteBuyBoxMutation,
  useUpdateBuyBoxMutation
} from '@/store/services/buyboxApiService';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import GeneralSection from './Sections/GeneralSection';
import InvestmentStrategy from './Sections/InvestmentStrategy';
import LocationCoverage from './Sections/LocationCoverage/LocationCoverage';
import AdjustComparable from './Sections/AdjustComparable';
import PropertyCriteria from './Sections/PropertyCriteria';
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  ArrowForwardIos,
  ArrowOutwardOutlined,
  RestartAltOutlined
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import {
  BuyBoxFormData,
  defaultSimilarityCriteriaFormSchemaFirstRank,
  formBuyBoxSchema,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import { defaults, defaultSimilarityFields } from '@/schemas/defaults';
import de from 'date-fns/esm/locale/de/index';
import AdjustComparables from './Sections/AdjustComparables';
import EditBuyboxDialogTitle from './EditBuyboxDialogTitle';
import { useIsMobile } from '@/hooks/useMobile';
import { ChevronRight, Loader2, RotateCcw, Save } from 'lucide-react';
import MultifamilyTabsSkeleton from './Sections/MultifamilyTabsSkeleton';
import { mapBuyBoxDataToForm } from './buyboxFormMappers';

interface Location {
  type: string;
  name: string;
  identifier: string;
}

const defaultSteps = [
  {
    title: 'General',
    fields: ['name', 'description']
  },
  {
    title: 'Investment Strategy',
    fields: ['strategy.strategyType']
  },
  {
    title: 'Location',
    fields: ['targetLocations']
  },
  {
    title: 'Property Criteria',
    fields: ['propertyCriteria']
  },
  {
    title: 'Comparables',
    fields: ['weights']
  }
];

const multifamilyDiscoveryTabs = [
  'Asset Filters',
  'Unit Mix Preferences',
  'Deal Quality Gates',
  'Ranking Weights'
];

const multifamilyDefaultsTabs = [
  'Income Defaults',
  'Expense Defaults',
  'Utilities Defaults',
  'Taxes and Insurance Defaults',
  'Financing Defaults',
  'Stress Test Presets'
];

const multifamilySteps = [
  {
    title: 'General',
    fields: ['name', 'description']
  },
  {
    title: 'Investment Strategy',
    fields: ['strategy.strategyType']
  },
  {
    title: 'Location',
    fields: ['targetLocations']
  },
  {
    title: 'Multifamily Discovery',
    fields: []
  },
  {
    title: 'Multifamily Defaults',
    fields: []
  }
];

const EDITOR_ROLES = ['edit', 'maitainer', 'owner'];

type editBuyBoxDialogProps = {
  buybox?: BuyBox;
  showEditBuybox: boolean;
  setShowEditBuybox: (show: boolean) => void;
};

const EditBuyBoxDialog = (props: editBuyBoxDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [createBuyBox, createResult] = useCreateBuyBoxMutation();
  const [updateBuyBox, updateResult] = useUpdateBuyBoxMutation();
  const [deleteBuyBox, deleteResult] = useDeleteBuyBoxMutation();
  const dispatch = useDispatch<any>();

  const getRangeFieldProperties = (
    min: number | undefined,
    max: number | undefined,
    defaultMin: number,
    defaultMax: number
  ) => {
    return {
      enabled: Boolean(min) || Boolean(max),
      min: min || defaultMin,
      max: max || defaultMax
    };
  };

  const getMinFieldProperties = (
    min: number | undefined,
    defaultMin: number
  ) => {
    return {
      enabled: Boolean(min),
      value: min || defaultMin
    };
  };

  const getSimilarityFieldProperties = (buyboxSimilarity: any) => {
    return {
      enabled: true,
      samePropertyType: buyboxSimilarity.samePropertyType,
      bedsOffset: getRangeFieldProperties(
        buyboxSimilarity.bedsMinOffset
          ? -buyboxSimilarity.bedsMinOffset
          : undefined,
        buyboxSimilarity.bedsMaxOffset,
        defaultSimilarityFields.bedrooms.min,
        defaultSimilarityFields.bedrooms.max
      ),
      bathsOffset: getRangeFieldProperties(
        buyboxSimilarity.bathsMinOffset
          ? -buyboxSimilarity.bathsMinOffset
          : undefined,
        buyboxSimilarity.bathsMaxOffset,
        defaultSimilarityFields.bathrooms.min,
        defaultSimilarityFields.bathrooms.max
      ),
      areaOffset: getRangeFieldProperties(
        buyboxSimilarity.areaMinOffset
          ? -buyboxSimilarity.areaMinOffset
          : undefined,
        buyboxSimilarity.areaMaxOffset,
        defaultSimilarityFields.area.min,
        defaultSimilarityFields.area.max
      ),
      lotAreaOffset: getRangeFieldProperties(
        buyboxSimilarity.lotAreaMinOffset
          ? -buyboxSimilarity.lotAreaMinOffset
          : undefined,
        buyboxSimilarity.lotAreaMaxOffset,
        defaultSimilarityFields.lotSize.min,
        defaultSimilarityFields.lotSize.max
      ),
      yearBuiltOffset: getRangeFieldProperties(
        buyboxSimilarity.yearBuiltMinOffset
          ? -buyboxSimilarity.yearBuiltMinOffset
          : undefined,
        buyboxSimilarity.yearBuiltMaxOffset,
        defaultSimilarityFields.yearBuilt.min,
        defaultSimilarityFields.yearBuilt.max
      ),
      maxDistance: getMinFieldProperties(
        buyboxSimilarity.maxDistance,
        defaultSimilarityFields.distance.min
      ),
      maxListingAgeMonths: getMinFieldProperties(
        buyboxSimilarity.maxListingAgeMonths,
        defaultSimilarityFields.saleDate.min
      ),
      weight: buyboxSimilarity.weight || 1
    };
  };

  // const getAllSimilarityFields = (buyboxData: BuyboxSchemaData) => {
  //   const similarityFields: any[] = [];
  //   for (let i = 0; i < 4; i++) {
  //     let fieldsData = defaultSimilarityCriteriaFormSchemaFirstRank;
  //     if (i < buyboxData.similarityCriteria.length) {
  //       fieldsData = getSimilarityFieldProperties(
  //         buyboxData.similarityCriteria[i]
  //       );
  //     }
  //     similarityFields.push(fieldsData);
  //   }
  //   return similarityFields;
  // };
  //
  const mappedBuyBoxData = useMemo(() => {
    if (!props.buybox) return null;
    return mapBuyBoxDataToForm(props.buybox.parameters);
  }, [props.buybox]);

  const defaultFormValues = useMemo(() => {
    if (props.buybox && mappedBuyBoxData) {
      return _.merge({}, getDefaultBuyBoxFormData(), mappedBuyBoxData);
    }
    return getDefaultBuyBoxFormData();
  }, [props.buybox, mappedBuyBoxData]);

  // const getDefaultFormValues = () => {
  //   if (props.buybox) {
  //     const mappedBuyBoxData = mapBuyBoxData(props.buybox.parameters);
  //     const fullData = _.merge(
  //       {},
  //       getDefaultBuyBoxFormData(),
  //       mappedBuyBoxData
  //     );
  //     return fullData;
  //   } else {
  //     const defaultData = getDefaultBuyBoxFormData();
  //     return defaultData;
  //   }
  // };

  const formMethods = useForm<BuyBoxFormData>({
    // defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
    resolver: zodResolver(formBuyBoxSchema),
    defaultValues: defaultFormValues
    // defaultValues: getDefaultData(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
    getValues,
    watch,
    control,
    trigger
  } = formMethods;

  const selectedStrategyType = watch('strategy.strategyType');
  const steps = useMemo(
    () =>
      selectedStrategyType === 'MULTIFAMILY' ? multifamilySteps : defaultSteps,
    [selectedStrategyType]
  );

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitForm = async () => {
    const completeOutput = await trigger();
    if (!completeOutput) {
      enqueueSnackbar(`Some steps are not completed`, {
        variant: 'error'
      });
      return;
    }
    await handleSubmit(onSubmit)();
  };

  const handleNextStep = async () => {
    // show form values
    const fields = steps[activeStep].fields;
    const output = await trigger(fields as Path<BuyBoxFormData>[], {
      shouldFocus: true
    });
    if (!output) {
      enqueueSnackbar(`Please fill out all required fields`, {
        variant: 'error'
      });
      return;
    }
    if (activeStep === steps.length - 1) {
      await handleSubmitForm();
      return;
    }

    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleClose = () => {
    const viewOnlyBuyBox =
      props.buybox && !EDITOR_ROLES.includes(props.buybox?.userAccess);
    if (viewOnlyBuyBox) {
      const originalFormValues = mapBuyBoxDataToForm(props.buybox?.parameters);
      reset(originalFormValues);
      // reset(props.buybox?.parameters);
    }
    props.setShowEditBuybox(false);
  };

  const onSubmit = async (data: any) => {
    console.log(`meow: ${JSON.stringify(getValues(), null, 2)}`);
    try {
      if (props.buybox) {
        console.log(`updating buybox: ${JSON.stringify(data)}`);
        await updateBuyBox({ id: props.buybox.id, parameters: data }).unwrap();
        enqueueSnackbar(`BuyBox Saved`, {
          variant: 'success'
        });
      } else {
        const result = await createBuyBox(data).unwrap();
        console.log(result);

        const patchCollection = dispatch(
          buyBoxApi.util.updateQueryData(
            'getBuyBoxes',
            '',
            (buyBoxes: BuyBox[]) => {
              buyBoxes.push({
                ...data,
                permissions: ['edit', 'view']
                // buyboxName: data.buyboxName
              });
              return buyBoxes;
            }
          )
        );
        enqueueSnackbar(`BuyBox Created`, {
          variant: 'success'
        });
      }
    } catch (error) {
      if (error.status === 'FETCHERROR') {
        enqueueSnackbar(`Connection error - please try again later`, {
          variant: 'error'
        });
      } else {
        enqueueSnackbar(`Error: ${error.data?.message || error.error}`, {
          variant: 'error'
        });
      }
    }
    handleClose();
  };

  // const handleDelete = async () => {
  //   try {
  //     await deleteBuyBox(props.buybox.id).unwrap();
  //
  //     enqueueSnackbar(`BuyBox Deleted`, {
  //       variant: 'success'
  //     });
  //   } catch (error) {
  //     if (error.status === 'FETCHERROR') {
  //       enqueueSnackbar(`Connection error - please try again later`, {
  //         variant: 'error'
  //       });
  //     } else {
  //       enqueueSnackbar(`Error: ${error.data?.message || error.error}`, {
  //         variant: 'error'
  //       });
  //     }
  //   }
  //   handleClose();
  // };

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    handleResetBuyBox();
  }, [props.buybox]);

  const handleResetBuyBox = () => {
    // const defaultData = getDefaultFormValues();
    reset(defaultFormValues);
    setActiveStep(0);
  };

  // const handleLocationsChanged = (event: any, value: any) => {
  //   setValue("targetLocation.locations", value);
  //   console.log(getValues("targetLocation.locations"));
  // };

  // const getUniqueLocations = (locations: Location[]) => {
  //   const locationNames = new Set();
  //   const uniqueLocations = [];
  //   for (const location of locations) {
  //     if (!locationNames.has(location.name)) {
  //       locationNames.add(location.name);
  //       uniqueLocations.push(location);
  //     }
  //   }
  //   return uniqueLocations;
  // };

  // const getStepsErrors = (step: number) => {
  //   switch (step) {
  //     case 0:
  //       return errors?.name || errors?.description;
  //     case 1:
  //       return errors?.strategy;
  //     case 2:
  //       return errors?.targetLocations;
  //     default:
  //       return undefined;
  //   }
  // };
  const getStepsErrors = useMemo(() => {
    return (step: number) => {
      switch (step) {
        case 0:
          return errors?.name || errors?.description;
        case 1:
          return errors?.strategy;
        case 2:
          return errors?.targetLocations;
        case 3:
          console.log(getValues('propertyCriteria'));
          console.log(JSON.stringify(errors));
          return errors?.propertyCriteria;
        case 4:
          console.log(getValues('weights'));
          console.log(JSON.stringify(errors));
          return errors?.weights;
        default:
          return undefined;
      }
    };
  }, [errors]);

  const StepSections = (
    <motion.div
      key={activeStep}
      className="grow w-full flex justify-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeStep === 0 && (
        <GeneralSection
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />
      )}
      {activeStep === 1 && (
        <InvestmentStrategy
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />
      )}
      {activeStep === 2 && (
        <LocationCoverage
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />
      )}

      {activeStep === 3 && (
        <>
          {selectedStrategyType === 'MULTIFAMILY' ? (
            <MultifamilyTabsSkeleton
              title="Multifamily Discovery"
              description="Configure discovery filters, quality gates, and ranking preferences for multifamily opportunities."
              tabs={multifamilyDiscoveryTabs}
              mode="criteria"
            />
          ) : (
            <PropertyCriteria
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
            />
          )}
        </>
      )}
      {activeStep === 4 && (
        <>
          {selectedStrategyType === 'MULTIFAMILY' ? (
            <MultifamilyTabsSkeleton
              title="Multifamily Defaults"
              description="Set defaults used only when listing and document data are missing."
              tabs={multifamilyDefaultsTabs}
              mode="setup"
            />
          ) : (
            <AdjustComparables
            // register={register}
            // control={control}
            // watch={watch}
            // setValue={setValue}
            // getValues={getValues}
            />
          )}
        </>
      )}
    </motion.div>
  );

  const FormFooter = (
    <div className="w-full flex flex-wrap justify-between py-4 px-4 gap-y-2">
      <div className="flex gap-x-2">
        {activeStep === 0 ? (
          <div></div>
        ) : (
          <ShadButton
            type="button"
            onClick={handleBackStep}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md shadow-violet-300/30 hover:shadow-lg hover:shadow-violet-400/40 transition-all duration-300 group"
          >
            <span className="text-base">Back</span>
          </ShadButton>
        )}
      </div>
      <div className="flex flex-wrap gap-x-2">
        {isDirty && (
          <ShadButton
            type="button"
            onClick={handleResetBuyBox}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md shadow-violet-300/30 hover:shadow-lg hover:shadow-violet-400/40 transition-all duration-300 group"
          >
            <RotateCcw className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden md:flex text-base">Reset</span>
          </ShadButton>
        )}

        {((props.buybox && props.buybox.userAccess !== 'viewer') ||
          !props.buybox) && (
          <ShadButton
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md shadow-violet-300/30 hover:shadow-lg hover:shadow-violet-400/40 transition-all duration-300 group"
            type="button"
            onClick={handleSubmitForm}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            )}
            <Typography className="hidden md:flex">
              {isDirty ? 'Save & Finish' : 'Finish'}
            </Typography>
          </ShadButton>
        )}

        {activeStep < steps.length - 1 && (
          <ShadButton
            type="button"
            onClick={handleNextStep}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md shadow-violet-300/30 hover:shadow-lg hover:shadow-violet-400/40 transition-all duration-300 group"
          >
            <Typography className={styles.button_text}>Next</Typography>
            <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </ShadButton>
        )}
      </div>
    </div>
  );

  const StepButtons = (
    <div className="hidden md:flex flex-col bg-[rgba(151,71,255,0.7)] pb-8 h-full">
      {steps.map((step, index) => (
        <Button
          key={index}
          onClick={() => setActiveStep(index)}
          className={clsx([
            ' text-white text-xl font-bold  h-24 rounded-[0] px-8 py-4 hover:bg-[#9747FF]',
            styles.font_poppins,
            activeStep === index ? 'bg-[#9747FF]' : 'bg-transparent'
          ])}
        >
          {steps[index].title}
        </Button>
      ))}
    </div>
  );

  const isMobile = useIsMobile();

  return (
    <Dialog
      open={props.showEditBuybox}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="lg"
      className={clsx[poppins.variable]}
    >
      <div className="h-full md:h-[80vh] w-full flex flex-col gap-x-0 overflow-hidden">
        <EditBuyboxDialogTitle
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          errors={errors}
          handleClose={handleClose}
        />

        <div className="flex w-full flex-grow overflow-hidden">
          {StepButtons}
          <div className=" w-full overflow-y-auto">
            <FormProvider {...formMethods}>
              <form
                className="flex min-h-full flex-col"
                onSubmit={handleSubmit(onSubmit)}
              >
                {StepSections}
                {FormFooter}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditBuyBoxDialog;
