import {
  AppBar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Slider,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./EditBuyBoxDialog.module.scss";
import InvestmentCriteria from "./InvestmentCriteria";
import PropertyCriteria from "./PropertyCriteria";
import ComparablePreferences from "./ComparablePreferences";
import SimilarityChart from "./SimilarityChart";
import {
  buyboxSchema,
  buyboxSchemaType,
  getDefaults,
} from "@/schemas/BuyBoxSchemas";
import BuyBox from "@/models/buybox";

type editBuyBoxDialogProps = {
  buybox: BuyBox;
  showEditBuybox: boolean;
  setShowEditBuybox: (show: boolean) => void;
};

const EditBuyBoxDialog = (props: editBuyBoxDialogProps) => {
  const handleClose = () => props.setShowEditBuybox(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    watch,
    control,
  } = useForm<buyboxSchemaType>({
    // defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
    resolver: zodResolver(buyboxSchema),
    defaultValues: getDefaults(buyboxSchema),
  });

  const onSubmit = async (data: any) => {
    alert(JSON.stringify(data));
  };

  useEffect(() => {
    if (props.buybox) {
      reset(props.buybox.data);
    }
    // reset({ name: "meow" });
  }, [props.buybox]);

  return (
    <Dialog
      open={props.showEditBuybox}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle className="font-poppins text-2xl font-bold">
        Buybox Manager
      </DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full grid gap-2 grid-cols-[15rem_1.5fr] px-36 py-10"
      >
        <Typography className={styles.mainLabel}>Name:</Typography>

        <TextField
          label="Name"
          variant="outlined"
          {...register("buybox_name")}
        />
        <Typography className={styles.mainLabel}>Description:</Typography>
        <TextField
          label="Description"
          placeholder="Description"
          multiline
          rows={2}
          maxRows={4}
          {...register("description")}
        />

        <Typography className={styles.mainLabel}>Locations:</Typography>
        <TextField
          label="Locations"
          placeholder="Locations"
          variant="outlined"
          {...register("locations")}
        />

        <InvestmentCriteria
          register={register}
          control={control}
          watch={watch}
        />

        <PropertyCriteria
          register={register}
          control={control}
          watch={watch}
        />

        <ComparablePreferences
          register={register}
          control={control}
          watch={watch}
        />

        <SimilarityChart
          register={register}
          control={control}
          watch={watch}
        />

        {/* {<p>{watch("bedrooms.active") ? "active" : "disabled"}</p>} */}
        {/* {<p>{watch("bedrooms.values")}</p>} */}

        <Button
          variant="outlined"
          className="mt-12"
          onClick={() => {
            reset(data);
          }}
        >
          Submit
        </Button>

        <Button type="submit" variant="outlined" className="mt-12">
          Submit
        </Button>
      </form>
    </Dialog>
  );
  // return (

  // );
};

export default EditBuyBoxDialog;
