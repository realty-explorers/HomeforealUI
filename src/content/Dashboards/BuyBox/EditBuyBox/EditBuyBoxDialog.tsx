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
import { Controller, FieldName, useForm } from 'react-hook-form';
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

interface Location {
  type: string;
  name: string;
  identifier: string;
}

const steps = [
  {
    title: 'General',
    fields: ['buyboxName', 'description']
  },
  {
    title: 'Investment Strategy',
    fields: ['opp.strategy', 'opp.fixAndFlip', 'opp.buyAndHold']
  },
  {
    title: 'Location',
    fields: ['targetLocation.locations']
  },
  {
    title: 'Property Criteria',
    fields: [
      'property.listingPrice',
      'property.beds',
      'property.baths',
      'property.sqft',
      'property.lotSize',
      'property.yearBuilt'
    ]
  },
  {
    title: 'Comparables',
    fields: ['opp.comparablePreferences']
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

  const getAllSimilarityFields = (buyboxData: BuyboxSchemaData) => {
    const similarityFields: any[] = [];
    for (let i = 0; i < 4; i++) {
      let fieldsData = defaultSimilarityCriteriaFormSchemaFirstRank;
      if (i < buyboxData.similarityCriteria.length) {
        fieldsData = getSimilarityFieldProperties(
          buyboxData.similarityCriteria[i]
        );
      }
      similarityFields.push(fieldsData);
    }
    return similarityFields;
  };

  const mapBuyBoxData = (buyboxData: BuyboxSchemaData) => {
    const buyboxFormData: BuyBoxFormData = {
      name: buyboxData.name,
      description: buyboxData.description,
      propertyCriteria: {
        propertyTypes: {
          enabled: Boolean(buyboxData.propertyCriteria.propertyTypes),
          items:
            buyboxData.propertyCriteria.propertyTypes ||
            defaults.propertyTypes.default
        },
        beds: getRangeFieldProperties(
          buyboxData.propertyCriteria.minBeds,
          buyboxData.propertyCriteria.maxBeds,
          defaults.bedrooms.min,
          defaults.bedrooms.max
        ),
        baths: getRangeFieldProperties(
          buyboxData.propertyCriteria.minBaths,
          buyboxData.propertyCriteria.maxBaths,
          defaults.bathrooms.min,
          defaults.bathrooms.max
        ),
        area: getRangeFieldProperties(
          buyboxData.propertyCriteria.minArea,
          buyboxData.propertyCriteria.maxArea,
          defaults.area.min,
          defaults.area.max
        ),
        lotArea: getRangeFieldProperties(
          buyboxData.propertyCriteria.minLotArea,
          buyboxData.propertyCriteria.maxLotArea,
          defaults.lotSize.min,
          defaults.lotSize.max
        ),
        yearBuilt: getRangeFieldProperties(
          buyboxData.propertyCriteria.minYearBuilt,
          buyboxData.propertyCriteria.maxYearBuilt,
          defaults.yearBuilt.min,
          defaults.yearBuilt.max
        ),
        price: getRangeFieldProperties(
          buyboxData.propertyCriteria.minPrice,
          buyboxData.propertyCriteria.maxPrice,
          defaults.listingPrice.min,
          defaults.listingPrice.max
        )
      },
      strategy: {
        minArv: getMinFieldProperties(
          buyboxData.strategy.minArv,
          defaults.arv.min
        ),
        minMargin: getMinFieldProperties(
          buyboxData.strategy.minMargin,
          defaults.margin.min
        )
      },
      similarityCriteria: getAllSimilarityFields(buyboxData),
      targetLocations: buyboxData.targetLocations
    };

    return buyboxFormData;
  };

  const getDefaultFormValues = () => {
    if (props.buybox) {
      const mappedBuyBoxData = mapBuyBoxData(props.buybox.parameters);
      const fullData = _.merge(
        {},
        getDefaultBuyBoxFormData(),
        mappedBuyBoxData
      );
      return fullData;
    } else {
      const defaultData = getDefaultBuyBoxFormData();
      return defaultData;
    }
  };

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
  } = useForm<BuyBoxFormData>({
    // defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
    resolver: zodResolver(formBuyBoxSchema),
    defaultValues: getDefaultFormValues()
    // defaultValues: getDefaultData(),
  });

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
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
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
      const originalFormValues = mapBuyBoxData(props.buybox?.parameters);
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
    const defaultData = getDefaultFormValues();
    reset(defaultData);
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
    console.log(JSON.stringify(errors.strategy));
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
          console.log(getValues('similarityCriteria'));
          console.log(JSON.stringify(errors));
          return errors?.similarityCriteria;
        default:
          return undefined;
      }
    };
  }, [errors]);

  return (
    <Dialog
      open={props.showEditBuybox}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      className={clsx[poppins.variable]}
    >
      <div className="w-full h-full grid grid-cols-[15rem_1fr]  gap-x-0 overflow-hidden">
        <div className="col-span-2 w-full flex justify-center items-center shadow">
          <IconButton
            className="absolute top-0 right-0 w-8 h-8 rounded-3xl"
            onClick={handleClose}
          >
            <HighlightOffOutlinedIcon />
          </IconButton>
          <DialogTitle
            className={clsx([' text-2xl font-bold ', styles.fontPoppins])}
          >
            BuyBox Config
          </DialogTitle>
          <Stepper
            nonLinear
            activeStep={activeStep}
            className="grow px-8 bg-transparent"
          >
            {steps.map((step, index) => (
              <Step key={index} className="">
                <StepLabel
                  className={clsx([styles.fontPoppins, 'cursor-pointer'])}
                  error={Boolean(getStepsErrors(index))}
                  onClick={() => setActiveStep(index)}
                >
                  {step.title}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <div className="flex flex-col bg-[rgba(151,71,255,0.7)] pb-8">
          {steps.map((step, index) => (
            <Button
              key={index}
              onClick={() => setActiveStep(index)}
              className={clsx([
                ' text-white text-xl font-bold  h-24 rounded-[0] px-8 py-4 hover:bg-[#9747FF]',
                styles.fontPoppins,
                activeStep === index ? 'bg-[#9747FF]' : 'bg-transparent'
              ])}
            >
              {steps[index].title}
            </Button>
          ))}
        </div>
        <div className="h-full">
          <form
            className="h-full flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div
              key={activeStep}
              className="grow w-full flex"
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
                <PropertyCriteria
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                />
              )}
              {activeStep === 4 && (
                <AdjustComparable
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                />
              )}
            </motion.div>
            <div className="w-full flex justify-between py-4 px-4">
              <div className="flex gap-x-2">
                {activeStep === 0 ? (
                  <div></div>
                ) : (
                  <Button onClick={handleBackStep} className={styles.button}>
                    <ArrowBackIosOutlinedIcon className="h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex gap-x-2">
                {isDirty && (
                  <Button onClick={handleResetBuyBox} className={styles.button}>
                    <RestartAltOutlined className="h-4 w-4" />
                    <Typography className={styles.buttonText}>Reset</Typography>
                  </Button>
                )}
                {activeStep === steps.length - 1 && !props.buybox && (
                  <LoadingButton
                    onClick={handleSubmitForm}
                    className={styles.button}
                    loading={isSubmitting}
                  >
                    <Typography className={styles.buttonText}>
                      Finish
                    </Typography>
                  </LoadingButton>
                )}
                {props.buybox &&
                  EDITOR_ROLES.includes(props.buybox?.userAccess) && (
                    <LoadingButton
                      onClick={handleSubmitForm}
                      className={styles.button}
                      loading={isSubmitting}
                    >
                      <Typography className={styles.buttonText}>
                        {props.buybox ? 'Save & Finish' : 'Finish'}
                      </Typography>
                    </LoadingButton>
                  )}

                {activeStep < steps.length - 1 && (
                  <Button onClick={handleNextStep} className={styles.button}>
                    <Typography className={styles.buttonText}>Next</Typography>
                    <ArrowForwardIos className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EditBuyBoxDialog;
