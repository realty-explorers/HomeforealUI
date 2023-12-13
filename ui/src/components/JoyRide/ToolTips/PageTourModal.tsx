import { CheckBox } from "@mui/icons-material";
import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import clsx from "clsx";
import styles from "./PageTourModal.module.scss";
import { cookies } from "next/headers";

const PageTourModal = ({
  continuous,
  index,
  isLastStep,
  size,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: any) => {
  const handleDontShow = () => {
    const tour = localStorage.getItem("tour");
    if (tour === "true") {
      localStorage.setItem("tour", "false");
    } else {
      localStorage.setItem("tour", "true");
    }
  };
  return (
    <div
      {...tooltipProps}
      className={clsx([
        "w-80 p-4 bg-white flex flex-col rounded-lg gap-y-2",
        styles.font_poppins,
      ])}
    >
      <Typography>
        {step.content}
      </Typography>
      <FormControlLabel
        control={<Checkbox onClick={handleDontShow} />}
        label="Don't show again"
      />
      <div className="flex justify-end">
        <Button
          className="bg-black text-white hover:ring-4 hover:bg-black"
          {...closeProps}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default PageTourModal;
