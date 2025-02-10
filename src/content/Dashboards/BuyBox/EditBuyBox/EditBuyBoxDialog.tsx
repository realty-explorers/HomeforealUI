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
import {
  useGetLocationsQuery,
  useLazyGetLocationsQuery
} from '@/store/services/dataApiService';
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
    fields: ['buybox_name', 'description']
  },
  {
    title: 'Investment Strategy',
    fields: ['opp.strategy', 'opp.fix_and_flip', 'opp.buy_and_hold']
  },
  {
    title: 'Location',
    fields: ['target_location.locations']
  },
  {
    title: 'Property Criteria',
    fields: [
      'property.Listing Price',
      'property.Beds',
      'property.Baths',
      'property.Sqft',
      'property.Lot Size',
      'property.Year Built'
    ]
  },
  {
    title: 'Comparables',
    fields: ['opp.comparable_preferences']
  }
];

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
  const locationsQuery = useGetLocationsQuery(props.buybox?.id);
  const dispatch = useDispatch<any>();

  const getRangeFieldProperties = (
    min: number | undefined,
    max: number | undefined,
    defaultMin: number,
    defaultMax: number
  ) => {
    return {
      enabled: min !== undefined || max !== undefined,
      min: min || defaultMin,
      max: max || defaultMax
    };
  };

  const getMinFieldProperties = (
    min: number | undefined,
    defaultMin: number
  ) => {
    return {
      enabled: min !== undefined,
      value: min || defaultMin
    };
  };

  const getSimilarityFieldProperties = (buyboxSimilarity: any) => {
    return {
      enabled: true,
      same_property_type: buyboxSimilarity.same_property_type,
      beds_offset: getRangeFieldProperties(
        buyboxSimilarity.beds_min_offset
          ? -buyboxSimilarity.beds_min_offset
          : undefined,
        buyboxSimilarity.beds_max_offset,
        defaultSimilarityFields.bedrooms.min,
        defaultSimilarityFields.bedrooms.max
      ),
      baths_offset: getRangeFieldProperties(
        buyboxSimilarity.baths_min_offset
          ? -buyboxSimilarity.baths_min_offset
          : undefined,
        buyboxSimilarity.baths_max_offset,
        defaultSimilarityFields.bathrooms.min,
        defaultSimilarityFields.bathrooms.max
      ),
      area_offset: getRangeFieldProperties(
        buyboxSimilarity.area_min_offset
          ? -buyboxSimilarity.area_min_offset
          : undefined,
        buyboxSimilarity.area_max_offset,
        defaultSimilarityFields.area.min,
        defaultSimilarityFields.area.max
      ),
      lot_area_offset: getRangeFieldProperties(
        buyboxSimilarity.lot_area_min_offset
          ? -buyboxSimilarity.lot_area_min_offset
          : undefined,
        buyboxSimilarity.lot_area_max_offset,
        defaultSimilarityFields.lotSize.min,
        defaultSimilarityFields.lotSize.max
      ),
      year_built_offset: getRangeFieldProperties(
        buyboxSimilarity.year_built_min_offset
          ? -buyboxSimilarity.year_built_min_offset
          : undefined,
        buyboxSimilarity.year_built_max_offset,
        defaultSimilarityFields.yearBuilt.min,
        defaultSimilarityFields.yearBuilt.max
      ),
      max_distance: getMinFieldProperties(
        buyboxSimilarity.max_distance,
        defaultSimilarityFields.distance.min
      ),
      max_listing_age_months: getMinFieldProperties(
        buyboxSimilarity.max_listing_age_months,
        defaultSimilarityFields.saleDate.min
      ),
      weight: buyboxSimilarity.weight || 1
    };
  };

  const getAllSimilarityFields = (buyboxData: BuyboxSchemaData) => {
    const similarityFields: any[] = [];
    for (let i = 0; i < 4; i++) {
      let fieldsData = defaultSimilarityCriteriaFormSchemaFirstRank;
      if (i < buyboxData.similarity_criteria.length) {
        fieldsData = getSimilarityFieldProperties(
          buyboxData.similarity_criteria[i]
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
      property_criteria: {
        property_types: {
          enabled: Boolean(buyboxData.property_criteria.property_types),
          items:
            buyboxData.property_criteria.property_types ||
            defaults.propertyTypes.default
        },
        beds: getRangeFieldProperties(
          buyboxData.property_criteria.min_beds,
          buyboxData.property_criteria.max_beds,
          defaults.bedrooms.min,
          defaults.bedrooms.max
        ),
        baths: getRangeFieldProperties(
          buyboxData.property_criteria.min_baths,
          buyboxData.property_criteria.max_baths,
          defaults.bathrooms.min,
          defaults.bathrooms.max
        ),
        area: getRangeFieldProperties(
          buyboxData.property_criteria.min_area,
          buyboxData.property_criteria.max_area,
          defaults.area.min,
          defaults.area.max
        ),
        lot_area: getRangeFieldProperties(
          buyboxData.property_criteria.min_lot_area,
          buyboxData.property_criteria.max_lot_area,
          defaults.lotSize.min,
          defaults.lotSize.max
        ),
        year_built: getRangeFieldProperties(
          buyboxData.property_criteria.min_year_built,
          buyboxData.property_criteria.max_year_built,
          defaults.yearBuilt.min,
          defaults.yearBuilt.max
        ),
        price: getRangeFieldProperties(
          buyboxData.property_criteria.min_price,
          buyboxData.property_criteria.max_price,
          defaults.listingPrice.min,
          defaults.listingPrice.max
        )
      },
      strategy: {
        min_arv: getMinFieldProperties(
          buyboxData.strategy.min_arv,
          defaults.arv.min
        ),
        min_margin: getMinFieldProperties(
          buyboxData.strategy.min_margin,
          defaults.margin.min
        )
      },
      similarity_criteria: getAllSimilarityFields(buyboxData)
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
    console.log(JSON.stringify(props.buybox, null, 2));
    console.log(JSON.stringify(getValues(), null, 2));
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
      props.buybox?.permissions.length === 1 &&
      props.buybox?.permissions[0] === 'view';
    if (viewOnlyBuyBox) {
      const originalFormValues = mapBuyBoxData(props.buybox?.parameters);
      reset(originalFormValues);
      // reset(props.buybox?.parameters);
    }
    props.setShowEditBuybox(false);
  };

  const onSubmit = async (data: any) => {
    try {
      if (props.buybox) {
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
                // buybox_name: data.buybox_name
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
      if (error.status === 'FETCH_ERROR') {
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
  //     if (error.status === 'FETCH_ERROR') {
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
  //   setValue("target_location.locations", value);
  //   console.log(getValues("target_location.locations"));
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
  //       return errors?.target_locations;
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
          return errors?.target_locations;
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
            className={clsx([' text-2xl font-bold ', styles.font_poppins])}
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
                  className={clsx([styles.font_poppins, 'cursor-pointer'])}
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
                styles.font_poppins,
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
                    <Typography className={styles.button_text}>
                      Reset
                    </Typography>
                  </Button>
                )}
                {activeStep === steps.length - 1 && !props.buybox && (
                  <LoadingButton
                    onClick={handleSubmitForm}
                    className={styles.button}
                    loading={isSubmitting}
                  >
                    <Typography className={styles.button_text}>
                      Finish
                    </Typography>
                  </LoadingButton>
                )}
                {props.buybox && props.buybox?.permissions.includes('edit') && (
                  <LoadingButton
                    onClick={handleSubmitForm}
                    className={styles.button}
                    loading={isSubmitting}
                  >
                    <Typography className={styles.button_text}>
                      {props.buybox ? 'Save & Finish' : 'Finish'}
                    </Typography>
                  </LoadingButton>
                )}

                {activeStep < steps.length - 1 && (
                  <Button onClick={handleNextStep} className={styles.button}>
                    <Typography className={styles.button_text}>Next</Typography>
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
