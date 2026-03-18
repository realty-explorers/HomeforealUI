import {
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import styles from './EditBuyBoxDialog.module.scss';
import clsx from 'clsx';

type EditBuyboxDialogTitleProps = {
  steps: { title: string }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  handleClose: () => void;
  getStepError?: (step: number) => boolean;
};
const EditBuyboxDialogTitle = ({
  steps,
  activeStep,
  setActiveStep,
  handleClose,
  getStepError
}: EditBuyboxDialogTitleProps) => {
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
        Configure Buybox
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
              error={Boolean(getStepError?.(index))}
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
export default EditBuyboxDialogTitle;
