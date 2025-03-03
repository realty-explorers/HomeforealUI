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
import { poppins } from '@/components/Fonts';
import LoadingButton from '@mui/lab/LoadingButton';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FieldName, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './OfferDialog.module.scss';

import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import { ArrowForwardIos, RestartAltOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import OfferFinancing from './OfferSteps/OfferFinancing';
import {
  defaultOfferData,
  OfferSchema,
  OfferSchemaType
} from '@/schemas/OfferSchemas';
import OfferPropertyDetails from './OfferSteps/OfferPropertyDetails';
import OfferPartyDetails from './OfferSteps/OfferPartyDetails';
import OfferFinalSteps from './OfferSteps/OfferFinalSteps';
import OfferDialogTitle from './OfferDialogTitle';
import { useCreateOfferMutation } from '@/store/services/offersApi';
import { selectProperties } from '@/store/slices/propertiesSlice';
import { useSession } from 'next-auth/react';

const steps: {
  title: string;
  fields: Path<OfferSchemaType>[];
}[] = [
  {
    title: `Buyer Details`,
    fields: [
      'buyerDetails.name',
      'buyerDetails.email',
      'buyerDetails.phone',
      'buyerDetails.address'
    ]
  },
  {
    title: 'Financing',
    fields: ['financialDetails', 'deposit', 'conditions', 'landSurvey']
  },
  {
    title: 'Terms & Conditions',
    fields: ['legalDescription', 'propertyDescription', 'propertyConditions']
  },
  {
    title: 'Final Steps',
    fields: ['settlementExpenses', 'closingDetails']
  }
];

type OfferDialogProps = {
  show: boolean;
  setShow: (show: boolean) => void;
};

const OfferDialog = (props: OfferDialogProps) => {
  const session = useSession();
  const [createOffer, offerState] = useCreateOfferMutation();
  const [activeStep, setActiveStep] = useState(0);

  const { selectedPropertyPreview, selectedProperty } =
    useSelector(selectProperties);

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
  } = useForm<OfferSchemaType>({
    // defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
    resolver: zodResolver(OfferSchema),
    defaultValues: defaultOfferData
    // defaultValues: getDefaultFormValues()
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
    console.log(JSON.stringify(getValues(), null, 2));
    const fields = steps[activeStep].fields;
    console.log(fields);
    const output = await trigger(fields, { shouldFocus: true });
    console.log(output);
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
    props.setShow(false);
  };

  const onSubmit = async (data: any) => {
    try {
      const userId = session.data.user.id;
      const analysisId = selectedProperty.id;
      const response = await createOffer({
        userId,
        analysisId,
        offerData: data
      }).unwrap();
      enqueueSnackbar(`Offer created successfully`, {
        variant: 'success'
      });
    } catch (error) {
      const statusCode = error?.status;
      if (statusCode === 409) {
        enqueueSnackbar(`You already sent an offer for this property`, {
          variant: 'warning'
        });
      } else {
        enqueueSnackbar(`Error creating offer`, {
          variant: 'error'
        });
      }
    }
    // handleClose();
  };

  const handleResetBuyBox = () => {
    const defaultData = {};
    reset(defaultData);
    setActiveStep(0);
  };

  const getStepsErrors = useMemo(() => {
    return (step: number) => {
      const fieldNames = steps[step].fields;
      const errors = fieldNames.map((fieldName) => {
        return errors[fieldName];
      });
      return errors;
    };
    return (step: number) => {};
    // return (step: number) => {
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
  }, [errors]);

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
        <OfferPartyDetails
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />
      )}

      {activeStep === 1 && (
        <OfferFinancing
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />
      )}

      {activeStep === 2 && (
        <OfferPropertyDetails
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />
      )}

      {activeStep === 3 && (
        <OfferFinalSteps
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />
      )}
    </motion.div>
  );
  const FormFooter = (
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
            <Typography className={styles.button_text}>Reset</Typography>
          </Button>
        )}
        <LoadingButton
          onClick={handleSubmitForm}
          className={styles.button}
          loading={isSubmitting}
        >
          <Typography className={styles.button_text}>
            {isDirty ? 'Save & Finish' : 'Finish'}
          </Typography>
        </LoadingButton>

        {activeStep < steps.length - 1 && (
          <Button onClick={handleNextStep} className={styles.button}>
            <Typography className={styles.button_text}>Next</Typography>
            <ArrowForwardIos className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
  return (
    <Dialog
      open={props.show}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      className={clsx[(poppins.variable, '')]}
    >
      <div className="h-[80vh] w-full flex flex-col gap-x-0 overflow-hidden">
        <OfferDialogTitle
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          errors={errors}
          handleClose={handleClose}
        />
        <div className="flex w-full flex-grow overflow-hidden">
          {StepButtons}
          <div className=" w-full overflow-y-auto">
            <form
              className="flex min-h-full flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              {StepSections}
              {FormFooter}
              {/* <pre> */}
              {/*   {Object.entries(errors).map(([key, error]) => ( */}
              {/*     <li key={key}> */}
              {/*       {key}:{' '} */}
              {/*       {Object.entries(error).map(([key, value]) => ( */}
              {/*         <li key={key}> */}
              {/*           {key}: {value.message} */}
              {/*         </li> */}
              {/*       ))} */}
              {/*       ) */}
              {/*     </li> */}
              {/*   ))} */}
              {/* </pre> */}
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OfferDialog;
