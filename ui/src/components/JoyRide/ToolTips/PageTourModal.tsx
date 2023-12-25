import { CheckBox } from "@mui/icons-material";
import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import clsx from "clsx";
import styles from "./PageTourModal.module.scss";
import { cookies } from "next/headers";
import { useEffect, useState } from "react";

const PageTourModal = ({
  continuous,
  index,
  isLastStep,
  size,
  step,
  backProps,
  nextProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: any) => {
  const [tour, setTour] = useState("true");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const tourValue = localStorage.getItem("tour");
      if (!tourValue) {
        localStorage.setItem("tour", "true");
      }
      if (!tourValue || tourValue === "true") {
        setTour("true");
      } else {
        setTour("false");
      }
    }
  }, []);
  const handleDontShow = () => {
    if (tour === "true") {
      localStorage.setItem("tour", "false");
      setTour("false");
    } else {
      setTour("true");
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
        control={
          <Checkbox checked={tour !== "true"} onClick={handleDontShow} />
        }
        label="Don't show again"
      />
      <div className="flex justify-between w-full">
        {!isLastStep && (
          <Button
            className="bg-black text-white hover:ring-4 hover:bg-black"
            {...skipProps}
          >
            Skip
          </Button>
        )}

        <Button
          className="bg-black text-white hover:ring-4 hover:bg-black"
          {...primaryProps}
        >
          {isLastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default PageTourModal;
