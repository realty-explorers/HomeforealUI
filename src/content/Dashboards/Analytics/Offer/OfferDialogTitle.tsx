import {
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import styles from './OfferDialog.module.scss';
import clsx from 'clsx';
import { useMemo } from 'react';

type OfferDialogTitleProps = {
  steps: { title: string }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  handleClose: () => void;
  errors?: any;
};
const OfferDialogTitle = ({
  steps,
  activeStep,
  setActiveStep,
  handleClose,
  errors
}: OfferDialogTitleProps) => {
  const getStepsErrors = useMemo(() => {
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
  return (
    <div className="w-full flex justify-center items-center shadow max-h-min">
      <IconButton
        className="absolute top-0 right-0 w-8 h-8 rounded-3xl"
        onClick={handleClose}
      >
        <HighlightOffOutlinedIcon />
      </IconButton>
      <DialogTitle
        className={clsx([' text-2xl font-bold ', styles.font_poppins])}
      >
        Make an Offer
      </DialogTitle>
      <Stepper
        nonLinear
        activeStep={activeStep}
        className="hidden md:flex grow px-8 bg-transparent"
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
  );
};
export default OfferDialogTitle;
